import { Router } from 'express';
import authRoutes from './auth.routes';
import bookingRoutes from './booking.routes';
import serviceRoutes from './service.routes';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'SevaPRO API' });
});

router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/services', serviceRoutes);

export default router;
