import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'customer' | 'provider' | 'admin';

export interface IUser extends Document {
  name: string;
  phone?: string;
  email?: string;
  password?: string;
  role: UserRole;
  profileImage?: string;
  bio?: string;
  rating?: number;
  totalJobs?: number;
  walletBalance: number;
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  phone: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true, lowercase: true },
  password: { type: String },
  role: { type: String, enum: ['customer', 'provider', 'admin'], required: true, default: 'customer' },
  profileImage: { type: String },
  bio: { type: String },
  rating: { type: Number, default: 0 },
  totalJobs: { type: Number, default: 0 },
  walletBalance: { type: Number, default: 0 },
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
