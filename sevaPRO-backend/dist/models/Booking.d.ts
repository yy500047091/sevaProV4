import mongoose, { Document } from 'mongoose';
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
export declare const Booking: mongoose.Model<IBooking, {}, {}, {}, mongoose.Document<unknown, {}, IBooking, {}, mongoose.DefaultSchemaOptions> & IBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IBooking>;
//# sourceMappingURL=Booking.d.ts.map