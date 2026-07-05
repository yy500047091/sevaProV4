"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingController = createBookingController;
exports.customerBookingsController = customerBookingsController;
exports.adminBookingsController = adminBookingsController;
exports.providerBookingsController = providerBookingsController;
exports.assignProviderController = assignProviderController;
exports.completeBookingController = completeBookingController;
exports.adminStatsController = adminStatsController;
exports.allProvidersController = allProvidersController;
const booking_service_1 = require("../services/booking.service");
async function createBookingController(req, res) {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized.' });
        const booking = await (0, booking_service_1.createBooking)({
            customerId: req.user._id.toString(),
            serviceId: req.body.serviceId,
            address: req.body.address,
            scheduledAt: req.body.scheduledAt,
        });
        res.status(201).json({ booking });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Booking failed.' });
    }
}
async function customerBookingsController(req, res) {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized.' });
        const bookings = await (0, booking_service_1.getCustomerBookings)(req.user._id.toString());
        res.json({ bookings });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings.' });
    }
}
async function adminBookingsController(req, res) {
    try {
        const bookings = await (0, booking_service_1.getAllBookings)();
        res.json({ bookings });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings.' });
    }
}
async function providerBookingsController(req, res) {
    try {
        if (!req.user)
            return res.status(401).json({ error: 'Unauthorized.' });
        const bookings = await (0, booking_service_1.getProviderBookings)(req.user._id.toString());
        res.json({ bookings });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings.' });
    }
}
async function assignProviderController(req, res) {
    try {
        const booking = await (0, booking_service_1.assignProvider)(String(req.params.id), req.body.providerId);
        res.json({ booking });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Assignment failed.' });
    }
}
async function completeBookingController(req, res) {
    try {
        const booking = await (0, booking_service_1.completeBooking)(String(req.params.id));
        res.json({ booking });
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Completion failed.' });
    }
}
async function adminStatsController(_req, res) {
    try {
        const stats = await (0, booking_service_1.getAdminStats)();
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats.' });
    }
}
async function allProvidersController(_req, res) {
    try {
        const providers = await (0, booking_service_1.getAllProviders)();
        res.json({ providers });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch providers.' });
    }
}
//# sourceMappingURL=booking.controller.js.map