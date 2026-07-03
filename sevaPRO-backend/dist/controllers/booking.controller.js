"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingController = createBookingController;
exports.customerBookingsController = customerBookingsController;
exports.workerBookingsController = workerBookingsController;
exports.bookingDetailsController = bookingDetailsController;
exports.verifyPaymentController = verifyPaymentController;
exports.updateBookingStatusController = updateBookingStatusController;
const booking_service_1 = require("../services/booking.service");
const payment_service_1 = require("../services/payment.service");
const tracking_service_1 = require("../services/tracking.service");
function createBookingController(req, res) {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized.' });
    }
    const booking = (0, booking_service_1.createBooking)({
        customerId: req.user.id,
        serviceId: req.body.serviceId,
        subServiceId: req.body.subServiceId,
        scheduledAt: req.body.scheduledAt,
        address: req.body.address,
        couponCode: req.body.couponCode,
    });
    res.status(201).json({
        booking,
        paymentParams: (0, payment_service_1.createPaymentOrder)(booking.bookingId, booking.pricing.total),
    });
}
function customerBookingsController(req, res) {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized.' });
    }
    (0, booking_service_1.seedBookings)(req.user.id);
    res.json({ bookings: (0, booking_service_1.listCustomerBookings)(req.user.id) });
}
function workerBookingsController(req, res) {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized.' });
    }
    res.json({ bookings: (0, booking_service_1.listProviderBookings)('pro_amit') });
}
function bookingDetailsController(req, res) {
    try {
        res.json({ booking: (0, booking_service_1.getBooking)(String(req.params.bookingId)) });
    }
    catch (error) {
        res.status(404).json({ error: error instanceof Error ? error.message : 'Booking not found.' });
    }
}
function verifyPaymentController(req, res) {
    try {
        const ok = (0, payment_service_1.verifyPaymentSignature)();
        if (!ok) {
            return res.status(400).json({ error: 'Payment signature verification failed.' });
        }
        const booking = (0, booking_service_1.markBookingPaid)(req.body.bookingId);
        return res.json({ booking });
    }
    catch (error) {
        return res.status(400).json({ error: error instanceof Error ? error.message : 'Payment failed.' });
    }
}
function updateBookingStatusController(req, res) {
    try {
        const status = (0, tracking_service_1.normalizeStatus)(req.body.status);
        const booking = (0, booking_service_1.updateBookingStatus)(String(req.params.bookingId), status);
        return res.json({ booking });
    }
    catch (error) {
        return res.status(400).json({ error: error instanceof Error ? error.message : 'Status update failed.' });
    }
}
//# sourceMappingURL=booking.controller.js.map