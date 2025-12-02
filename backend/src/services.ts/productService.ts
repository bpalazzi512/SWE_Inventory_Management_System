import Product, { IProduct } from '../models/Product';
import { Types } from 'mongoose';
import categoryService from './categoryService';

export type Location = 'Boston' | 'Seattle' | 'Oakland';

const LOCATION_CODES: Record<Location, string> = {
  Boston: 'BOS',
  Seattle: 'SEA',
  Oakland: 'OAK',
};

export interface CreateProductDto {
  name: string;
  categoryId: string;
  location: Location;
  price: number;
  lowStockThreshold?: number;
}

export interface UpdateProductDto {
  name?: string;
  categoryId?: string;
  price?: number;
  lowStockThreshold?: number;
}

export class ProductService {
  // Generate the next sequential SKU per location prefix in the format PREFIX + 5 digits (e.g., SEA00001)
  private async generateSequentialSKU(locationCode: string): Promise<string> {
    const prefix = locationCode;
    // Find the max existing SKU for this prefix (lexicographical works because of zero-padding)
    const latest = await Product
      .findOne({ sku: { $regex: `^${prefix}\\d{5}$` } })
      .sort({ sku: -1 })
      .lean();

    let nextNumber = 1;
    if (latest?.sku) {
      const tail = latest.sku.slice(prefix.length); // last 5 digits
      const current = parseInt(tail, 10);
      if (Number.isFinite(current)) nextNumber = current + 1;
    }

    if (nextNumber > 99999) {
      throw new Error('SKU sequence overflow for this location');
    }

    const padded = String(nextNumber).padStart(5, '0');
    return `${prefix}${padded}`;
  }

  // Create a new product
  async createProduct(productData: CreateProductDto): Promise<IProduct> {
    // Validate category exists
    const category = await categoryService.getCategoryById(productData.categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Get location code
    const locationCode = LOCATION_CODES[productData.location];
    if (!locationCode) {
      throw new Error('Invalid location. Must be Boston, Seattle, or Oakland');
    }

    // Generate sequential SKU like SEA00001
    let sku = await this.generateSequentialSKU(locationCode);

    // Rare race condition handling: retry a few times if unique constraint collides
    for (let attempt = 0; attempt < 3; attempt++) {
      const existing = await Product.findOne({ sku });
      if (!existing) break;
      // if exists, advance by one
      const num = parseInt(sku.slice(locationCode.length), 10) + 1;
      if (num > 99999) throw new Error('SKU sequence overflow for this location');
      sku = `${locationCode}${String(num).padStart(5, '0')}`;
    }

    const threshold =
      typeof productData.lowStockThreshold === 'number' && productData.lowStockThreshold > 0
        ? productData.lowStockThreshold
        : -1;

    const product = new Product({
      name: productData.name,
      sku,
      categoryId: productData.categoryId,
      price: productData.price,
      lowStockThreshold: threshold,
    });

    return await product.save();
  }

  // Get all products
  async getAllProducts(): Promise<IProduct[]> {
    return await Product.find().populate('categoryId', 'name');
  }

  // Get product by ID
  async getProductById(id: string): Promise<IProduct | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Product.findById(id).populate('categoryId', 'name');
  }

  // Get product by SKU
  async getProductBySKU(sku: string): Promise<IProduct | null> {
    return await Product.findOne({ sku }).populate('categoryId', 'name');
  }

  // Get products by category
  async getProductsByCategory(categoryId: string): Promise<IProduct[]> {
    if (!Types.ObjectId.isValid(categoryId)) {
      return [];
    }
    return await Product.find({ categoryId }).populate('categoryId', 'name');
  }

  // Update product by ID
  async updateProduct(id: string, productData: UpdateProductDto): Promise<IProduct | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    // Validate category if it's being updated
    if (productData.categoryId) {
      const category = await categoryService.getCategoryById(productData.categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: productData },
      { new: true, runValidators: true }
    ).populate('categoryId', 'name');

    return product;
  }

  // Delete product by ID
  async deleteProduct(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await Product.findByIdAndDelete(id);
    return result !== null;
  }
}

export default new ProductService();

