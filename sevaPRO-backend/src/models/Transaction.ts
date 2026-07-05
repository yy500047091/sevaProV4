import mongoose, { Document, Schema } from 'mongoose';

export type TransactionType = 'deposit' | 'withdrawal' | 'earning' | 'payment';

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  booking?: mongoose.Types.ObjectId;
  amount: number;
  type: TransactionType;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'withdrawal', 'earning', 'payment'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  description: { type: String, required: true },
}, { timestamps: true });

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
