import { Request, Response } from 'express';
import productService, { CreateProductDto, UpdateProductDto, Location } from '../services.ts/productService';

export class ProductController {
  // Create a new product
  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { name, categoryId, location, price, lowStockThreshold } = req.body;

      // Validate required fields
      if (!name || !categoryId || !location || price === undefined) {
        res.status(400).json({ error: 'Name, categoryId, location, and price are required' });
        return;
      }

      // Validate location
      const validLocations: Location[] = ['Boston', 'Seattle', 'Oakland'];
      if (!validLocations.includes(location)) {
        res.status(400).json({ error: 'Location must be Boston, Seattle, or Oakland' });
        return;
      }

      // Validate price
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum < 0) {
        res.status(400).json({ error: 'Price must be a valid positive number' });
        return;
      }

      const productData: CreateProductDto = {
        name: name.trim(),
        categoryId,
        location: location as Location,
        price: priceNum,
        lowStockThreshold,
      };

      const product = await productService.createProduct(productData);
      res.status(201).json(product);
    } catch (error: any) {
      if (error.message === 'Category not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message === 'Invalid location. Must be Boston, Seattle, or Oakland') {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message || 'Failed to create product' });
    }
  }

  // Get all products
  async getAllProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch products' });
    }
  }

  // Get product by ID
  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Product ID is required' });
        return;
      }
      const product = await productService.getProductById(id);

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.status(200).json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch product' });
    }
  }

  // Update product by ID
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Product ID is required' });
        return;
      }

      const updateData: UpdateProductDto = {};

      if (req.body.name !== undefined) {
        if (req.body.name.trim() === '') {
          res.status(400).json({ error: 'Product name cannot be empty' });
          return;
        }
        updateData.name = req.body.name.trim();
      }

      if (req.body.categoryId !== undefined) {
        updateData.categoryId = req.body.categoryId;
      }

      if (req.body.price !== undefined) {
        const priceNum = parseFloat(req.body.price);
        if (isNaN(priceNum) || priceNum < 0) {
          res.status(400).json({ error: 'Price must be a valid positive number' });
          return;
        }
        updateData.price = priceNum;
      }

      if (req.body.lowStockThreshold !== undefined) {
        const tNum = Number(req.body.lowStockThreshold);
        // -1 means "disabled"; any positive number is accepted as a threshold.
        if (!Number.isFinite(tNum)) {
          res.status(400).json({ error: 'lowStockThreshold must be a number' });
          return;
        }
        updateData.lowStockThreshold = tNum > 0 ? tNum : -1;
      }

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: 'No fields to update' });
        return;
      }

      const product = await productService.updateProduct(id, updateData);

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.status(200).json(product);
    } catch (error: any) {
      if (error.message === 'Category not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: error.message || 'Failed to update product' });
    }
  }

  // Delete product by ID
  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Product ID is required' });
        return;
      }
      const deleted = await productService.deleteProduct(id);

      if (!deleted) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete product' });
    }
  }
}

export default new ProductController();

