"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("../controllers/booking.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const payment_controller_1 = require("../controllers/payment.controller");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/', (0, validation_1.requireFields)(['serviceId', 'subServiceId', 'scheduledAt', 'address']), booking_controller_1.createBookingController);
router.get('/customer', booking_controller_1.customerBookingsController);
router.get('/worker', booking_controller_1.workerBookingsController);
router.get('/wallet', payment_controller_1.walletController);
router.post('/payment-verify', (0, validation_1.requireFields)(['bookingId']), booking_controller_1.verifyPaymentController);
router.get('/:bookingId', booking_controller_1.bookingDetailsController);
router.patch('/:bookingId/status', (0, validation_1.requireFields)(['status']), booking_controller_1.updateBookingStatusController);
exports.default = router;
//# sourceMappingURL=booking.routes.js.map