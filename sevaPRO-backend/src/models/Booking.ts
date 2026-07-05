import mongoose, { Document, Schema } from 'mongoose';

export type BookingStatus = 'pending' | 'assigned' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid';

export interface IBooking extends Document {
  customer: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  provider?: mongoose.Types.ObjectId;
  status: BookingStatus;
  address: string;
  scheduledAt: Date;
  paymentStatus: PaymentStatus;
  otp: string;
  photos: string[];
  rating?: number;
  review?: string;
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  customer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  provider: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: ['pending', 'assigned', 'completed', 'cancelled'], default: 'pending' },
  address: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  otp: { type: String, required: true },
  photos: { type: [String], default: [] },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String },
}, { timestamps: true });

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
