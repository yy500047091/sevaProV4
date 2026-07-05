import mongoose from 'mongoose';
import { Booking } from '../models/Booking';
import { User } from '../models/User';

export async function createBooking(input: {
  customerId: string;
  serviceId: string;
  address: string;
  scheduledAt: string;
}) {
  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
  
  const booking = await Booking.create({
    customer: new mongoose.Types.ObjectId(input.customerId),
    service: new mongoose.Types.ObjectId(input.serviceId),
    address: input.address,
    scheduledAt: new Date(input.scheduledAt),
    status: 'pending',
    paymentStatus: 'pending',
    otp,
  });
  return booking.populate(['customer', 'service', 'provider']);
}

export async function getCustomerBookings(customerId: string) {
  return Booking.find({ customer: customerId })
    .populate('service', 'name price duration icon')
    .populate('provider', 'name phone')
    .sort({ createdAt: -1 });
}

export async function getAllBookings() {
  return Booking.find({ status: { $in: ['pending', 'assigned'] } })
    .populate('customer', 'name phone')
    .populate('service', 'name price icon')
    .populate('provider', 'name phone')
    .sort({ createdAt: -1 });
}

export async function getProviderBookings(providerId: string) {
  return Booking.find({ provider: providerId, status: 'assigned' })
    .populate('customer', 'name phone')
    .populate('service', 'name price duration icon')
    .sort({ createdAt: -1 });
}

export async function assignProvider(bookingId: string, providerId: string) {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { provider: new mongoose.Types.ObjectId(providerId), status: 'assigned' },
    { new: true }
  ).populate(['customer', 'service', 'provider']);
  if (!booking) throw new Error('Booking not found.');
  return booking;
}

export async function completeBooking(bookingId: string) {
  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { status: 'completed', paymentStatus: 'paid' },
    { new: true }
  ).populate(['customer', 'service', 'provider']);
  if (!booking) throw new Error('Booking not found.');
  return booking;
}

export async function getAdminStats() {
  const completed = await Booking.find({ status: 'completed' }).populate('service', 'price');
  const totalRevenue = completed.reduce((sum, b) => {
    const svc = b.service as any;
    return sum + (svc?.price || 0);
  }, 0);
  return { totalCompleted: completed.length, totalRevenue };
}

export async function getAllProviders() {
  return User.find({ role: 'provider' }, 'name phone email');
}
