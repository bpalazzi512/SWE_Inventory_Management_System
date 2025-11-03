import { Request, Response } from 'express';
import transactionService, { CreateTransactionDto } from '../services.ts/transactionService';

export class TransactionController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { sku, type, quantity, description } = req.body as CreateTransactionDto & { description?: string };

      if (!sku || !type || quantity === undefined) {
        res.status(400).json({ error: 'sku, type and quantity are required' });
        return;
      }

      const qtyNum = Number(quantity);
      if (!Number.isFinite(qtyNum) || qtyNum <= 0) {
        res.status(400).json({ error: 'quantity must be a positive number' });
        return;
      }

      const created = await transactionService.create({ sku: String(sku).trim(), type, quantity: qtyNum, description });
      res.status(201).json(created);
    } catch (error: any) {
      const msg = error?.message || 'Failed to create transaction';
      if (msg.includes('not found')) {
        res.status(404).json({ error: msg });
        return;
      }
      if (msg.includes('Insufficient')) {
        res.status(400).json({ error: msg });
        return;
      }
      res.status(500).json({ error: msg });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const list = await transactionService.list();

      // shape into items[] array expected by frontend
      const shaped = list.map((t) => ({
        tid: t.tid,
        date: t.createdAt.toISOString().slice(0, 10),
        items: [
          {
            sku: t.sku,
            type: t.type,
            quantity: t.quantity,
            description: t.description || '',
          },
        ],
      }));

      res.status(200).json(shaped);
    } catch (error: any) {
      res.status(500).json({ error: error?.message || 'Failed to fetch transactions' });
    }
  }
}

export default new TransactionController();
