import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  icon: string;
  color?: string;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, trim: true },
  icon: { type: String, required: true }, // URL or emoji or icon name
  color: { type: String }, // Hex code for UI tint
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
