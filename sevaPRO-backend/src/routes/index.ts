import { Router } from 'express';
import authRoutes from './auth.routes';
import bookingRoutes from './booking.routes';
import providerRoutes from './provider.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'ServeEase API' });
});

router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/catalog', providerRoutes);

export default router;
