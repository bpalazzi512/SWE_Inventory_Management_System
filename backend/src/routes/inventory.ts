import { Router } from 'express';
import Product from '../models/Product';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Return inventory view for frontend - protected
router.get('/', authenticateToken, async (_req, res) => {
  try {
    const products = await Product.find().populate('categoryId', 'name');
    const items = products.map((p: any) => ({
      name: p.name,
      sku: p.sku,
      category: p.categoryId?.name || '',
      quantity: p.quantity ?? 0,
      unitPrice: p.price,
      description: '',
    }));
    res.json(items);
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'Failed to fetch inventory' });
  }
});

export default router;
