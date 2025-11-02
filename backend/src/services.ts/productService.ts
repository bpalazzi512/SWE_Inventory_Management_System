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
}

export interface UpdateProductDto {
  name?: string;
  categoryId?: string;
  price?: number;
}

export class ProductService {
  // Generate a unique SKU
  private async generateUniqueSKU(locationCode: string): Promise<string> {
    let sku: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!isUnique && attempts < maxAttempts) {
      // Generate 9 random numbers
      const randomNumbers = Math.floor(100000000 + Math.random() * 900000000).toString();
      sku = `${locationCode}${randomNumbers}`;

      // Check if SKU already exists
      const existingProduct = await Product.findOne({ sku });
      if (!existingProduct) {
        isUnique = true;
      } else {
        attempts++;
      }
    }

    if (!isUnique) {
      throw new Error('Failed to generate unique SKU after multiple attempts');
    }

    return sku!;
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

    // Generate unique SKU
    const sku = await this.generateUniqueSKU(locationCode);

    const product = new Product({
      name: productData.name,
      sku,
      categoryId: productData.categoryId,
      price: productData.price,
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

