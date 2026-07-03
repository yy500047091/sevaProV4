"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = createBooking;
exports.listCustomerBookings = listCustomerBookings;
exports.listProviderBookings = listProviderBookings;
exports.getBooking = getBooking;
exports.updateBookingStatus = updateBookingStatus;
exports.markBookingPaid = markBookingPaid;
exports.seedBookings = seedBookings;
const provider_service_1 = require("./provider.service");
const bookings = new Map();
const basePrices = {
    cat_cleaning: 350,
    cat_plumbing: 299,
    cat_electrical: 249,
    cat_appliances: 399,
    cat_carpentry: 349,
    cat_painting: 499,
    cat_pest: 599,
    cat_moving: 799,
    cat_salon: 299,
    cat_ac: 449,
    cat_interior: 699,
    plumbing: 299,
    electrical: 249,
    cleaning: 350,
    ac_repair: 449,
    salon: 299,
};
function makeId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}
function calculatePricing(serviceId, couponCode) {
    const base = basePrices[serviceId] || 350;
    const platformFee = 49;
    const discount = couponCode === 'WELCOME100' ? 100 : 0;
    const taxable = Math.max(0, base + platformFee - discount);
    const gst = Math.round(taxable * 0.18);
    return { base, platformFee, gst, discount, total: taxable + gst };
}
function createBooking(input) {
    const now = new Date().toISOString();
    const provider = provider_service_1.providers.find((item) => item.skills.includes(input.serviceId)) || provider_service_1.providers[0];
    const booking = {
        id: makeId('mongo'),
        bookingId: makeId('book'),
        customerId: input.customerId,
        providerId: provider.id,
        serviceId: input.serviceId,
        subServiceId: input.subServiceId,
        scheduledAt: input.scheduledAt,
        address: input.address,
        status: 'pending_payment',
        otp: '248637',
        couponCode: input.couponCode,
        pricing: calculatePricing(input.serviceId, input.couponCode),
        paymentStatus: 'pending',
        createdAt: now,
        updatedAt: now,
    };
    bookings.set(booking.bookingId, booking);
    return booking;
}
function listCustomerBookings(customerId) {
    return Array.from(bookings.values())
        .filter((booking) => booking.customerId === customerId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
function listProviderBookings(providerId) {
    return Array.from(bookings.values())
        .filter((booking) => booking.providerId === providerId || booking.status === 'confirmed')
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
function getBooking(bookingId) {
    const booking = bookings.get(bookingId);
    if (!booking) {
        throw new Error('Booking not found.');
    }
    return booking;
}
function updateBookingStatus(bookingId, status) {
    const booking = getBooking(bookingId);
    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    bookings.set(booking.bookingId, booking);
    return booking;
}
function markBookingPaid(bookingId) {
    const booking = getBooking(bookingId);
    booking.paymentStatus = 'paid';
    booking.status = 'worker_assigned';
    booking.updatedAt = new Date().toISOString();
    bookings.set(booking.bookingId, booking);
    return booking;
}
function seedBookings(customerId) {
    if (listCustomerBookings(customerId).length > 0) {
        return;
    }
    createBooking({
        customerId,
        serviceId: 'cat_cleaning',
        subServiceId: 'deep_cleaning',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        address: {
            line1: '221B Baker Street',
            city: 'London',
            state: 'London',
            pincode: 'NW16XE',
            lat: 28.6139,
            lng: 77.209,
        },
    });
}
//# sourceMappingURL=booking.service.js.map