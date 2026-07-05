import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  icon: string;
  categoryId?: mongoose.Types.ObjectId;
  checklist: string[];
}

const ServiceSchema = new Schema<IService>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // minutes
  icon: { type: String, default: '🔧' },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  checklist: { type: [String], default: [] },
}, { timestamps: true });

export const Service = mongoose.model<IService>('Service', ServiceSchema);
