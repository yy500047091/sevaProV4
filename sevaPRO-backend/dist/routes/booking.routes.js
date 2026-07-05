"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("../controllers/booking.controller");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// Customer
router.post('/', (0, auth_1.requireRole)('customer'), (0, validation_1.requireFields)(['serviceId', 'address', 'scheduledAt']), booking_controller_1.createBookingController);
router.get('/customer', (0, auth_1.requireRole)('customer'), booking_controller_1.customerBookingsController);
// Admin
router.get('/admin', (0, auth_1.requireRole)('admin'), booking_controller_1.adminBookingsController);
router.get('/stats', (0, auth_1.requireRole)('admin'), booking_controller_1.adminStatsController);
router.get('/providers', (0, auth_1.requireRole)('admin'), booking_controller_1.allProvidersController);
router.put('/:id/assign', (0, auth_1.requireRole)('admin'), (0, validation_1.requireFields)(['providerId']), booking_controller_1.assignProviderController);
// Provider
router.get('/provider', (0, auth_1.requireRole)('provider'), booking_controller_1.providerBookingsController);
router.patch('/:id/complete', (0, auth_1.requireRole)('provider'), booking_controller_1.completeBookingController);
exports.default = router;
//# sourceMappingURL=booking.routes.js.map