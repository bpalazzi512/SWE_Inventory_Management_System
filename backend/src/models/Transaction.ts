import mongoose, { Document, Schema } from 'mongoose';

export type TransactionType = 'IN' | 'OUT';

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  tid: string; // human-friendly id
  productId: mongoose.Types.ObjectId;
  sku: string;
  type: TransactionType;
  quantity: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    tid: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['IN', 'OUT'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
