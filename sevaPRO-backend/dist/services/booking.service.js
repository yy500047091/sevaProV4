"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = createBooking;
exports.getCustomerBookings = getCustomerBookings;
exports.getAllBookings = getAllBookings;
exports.getProviderBookings = getProviderBookings;
exports.assignProvider = assignProvider;
exports.completeBooking = completeBooking;
exports.getAdminStats = getAdminStats;
exports.getAllProviders = getAllProviders;
const mongoose_1 = __importDefault(require("mongoose"));
const Booking_1 = require("../models/Booking");
const User_1 = require("../models/User");
async function createBooking(input) {
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    const booking = await Booking_1.Booking.create({
        customer: new mongoose_1.default.Types.ObjectId(input.customerId),
        service: new mongoose_1.default.Types.ObjectId(input.serviceId),
        address: input.address,
        scheduledAt: new Date(input.scheduledAt),
        status: 'pending',
        paymentStatus: 'pending',
        otp,
    });
    return booking.populate(['customer', 'service', 'provider']);
}
async function getCustomerBookings(customerId) {
    return Booking_1.Booking.find({ customer: customerId })
        .populate('service', 'name price duration icon')
        .populate('provider', 'name phone')
        .sort({ createdAt: -1 });
}
async function getAllBookings() {
    return Booking_1.Booking.find({ status: { $in: ['pending', 'assigned'] } })
        .populate('customer', 'name phone')
        .populate('service', 'name price icon')
        .populate('provider', 'name phone')
        .sort({ createdAt: -1 });
}
async function getProviderBookings(providerId) {
    return Booking_1.Booking.find({ provider: providerId, status: 'assigned' })
        .populate('customer', 'name phone')
        .populate('service', 'name price duration icon')
        .sort({ createdAt: -1 });
}
async function assignProvider(bookingId, providerId) {
    const booking = await Booking_1.Booking.findByIdAndUpdate(bookingId, { provider: new mongoose_1.default.Types.ObjectId(providerId), status: 'assigned' }, { new: true }).populate(['customer', 'service', 'provider']);
    if (!booking)
        throw new Error('Booking not found.');
    return booking;
}
async function completeBooking(bookingId) {
    const booking = await Booking_1.Booking.findByIdAndUpdate(bookingId, { status: 'completed', paymentStatus: 'paid' }, { new: true }).populate(['customer', 'service', 'provider']);
    if (!booking)
        throw new Error('Booking not found.');
    return booking;
}
async function getAdminStats() {
    const completed = await Booking_1.Booking.find({ status: 'completed' }).populate('service', 'price');
    const totalRevenue = completed.reduce((sum, b) => {
        const svc = b.service;
        return sum + (svc?.price || 0);
    }, 0);
    return { totalCompleted: completed.length, totalRevenue };
}
async function getAllProviders() {
    return User_1.User.find({ role: 'provider' }, 'name phone email');
}
//# sourceMappingURL=booking.service.js.map