import { Router } from 'express';
import {
  createBookingController,
  customerBookingsController,
  adminBookingsController,
  providerBookingsController,
  assignProviderController,
  completeBookingController,
  adminStatsController,
  allProvidersController,
} from '../controllers/booking.controller';
import { authenticate, requireRole } from '../middleware/auth';
import { requireFields } from '../middleware/validation';

const router = Router();

router.use(authenticate);

// Customer
router.post('/', requireRole('customer'), requireFields(['serviceId', 'address', 'scheduledAt']), createBookingController);
router.get('/customer', requireRole('customer'), customerBookingsController);

// Admin
router.get('/admin', requireRole('admin'), adminBookingsController);
router.get('/stats', requireRole('admin'), adminStatsController);
router.get('/providers', requireRole('admin'), allProvidersController);
router.put('/:id/assign', requireRole('admin'), requireFields(['providerId']), assignProviderController);

// Provider
router.get('/provider', requireRole('provider'), providerBookingsController);
router.patch('/:id/complete', requireRole('provider'), completeBookingController);

export default router;
