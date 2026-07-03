import { Router } from 'express';
import {
  bookingDetailsController,
  createBookingController,
  customerBookingsController,
  updateBookingStatusController,
  verifyPaymentController,
  workerBookingsController,
} from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth';
import { requireFields } from '../middleware/validation';
import { walletController } from '../controllers/payment.controller';

const router = Router();

router.use(authenticate);
router.post('/', requireFields(['serviceId', 'subServiceId', 'scheduledAt', 'address']), createBookingController);
router.get('/customer', customerBookingsController);
router.get('/worker', workerBookingsController);
router.get('/wallet', walletController);
router.post('/payment-verify', requireFields(['bookingId']), verifyPaymentController);
router.get('/:bookingId', bookingDetailsController);
router.patch('/:bookingId/status', requireFields(['status']), updateBookingStatusController);

export default router;
