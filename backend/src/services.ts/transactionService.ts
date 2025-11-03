import Product from '../models/Product';
import Transaction, { ITransaction, TransactionType } from '../models/Transaction';

export interface CreateTransactionDto {
  sku: string;
  type: TransactionType;
  quantity: number;
  description?: string | undefined;
}

function generateTid(prefix: string = 'T'): string {
  // Simple TID generator using timestamp and random segment
  const ts = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}${ts}-${rand}`;
}

export class TransactionService {
  async create(dto: CreateTransactionDto): Promise<ITransaction> {
    const { sku, type, quantity, description } = dto;

    if (!sku || !type || !quantity || quantity <= 0) {
      throw new Error('sku, type and positive quantity are required');
    }

    const product = await Product.findOne({ sku });
    if (!product) {
      throw new Error('Product not found for provided SKU');
    }

    if (type === 'OUT' && product.quantity < quantity) {
      throw new Error('Insufficient stock for OUT transaction');
    }

    // Update product quantity
    const newQty = type === 'IN' ? product.quantity + quantity : product.quantity - quantity;
    product.quantity = newQty;
    await product.save();

    // Create transaction record
    const tid = generateTid('T');
    const trx = new Transaction({
      tid,
      productId: product._id,
      sku: product.sku,
      type,
      quantity,
      description,
    });
    return await trx.save();
  }

  async list(): Promise<ITransaction[]> {
    return Transaction.find().sort({ createdAt: -1 });
  }
}

export default new TransactionService();
