import { Router } from 'express';
import { sendOtpController, verifyOtpController, loginController } from '../controllers/auth.controller';
import { requireFields } from '../middleware/validation';

const router = Router();

router.post('/send-otp', requireFields(['phone']), sendOtpController);
router.post('/verify-otp', requireFields(['phone', 'otp']), verifyOtpController);
router.post('/login', requireFields(['email', 'password']), loginController);

export default router;
