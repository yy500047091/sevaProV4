import { Router } from 'express';
import {
  sendOtpController,
  verifyOtpController,
  loginController,
  devLoginController,
} from '../controllers/auth.controller';
import { requireFields } from '../middleware/validation';

const router = Router();

// Customer phone login
router.post(
  '/send-otp',
  requireFields(['phone']),
  sendOtpController,
);

// Firebase returns an ID token after OTP verification
router.post(
  '/firebase-login',
  requireFields(['idToken']),
  verifyOtpController,
);
router.post(
  '/dev-login',
  requireFields(['phone']),
  devLoginController,
);
// Admin / Provider login
router.post(
  '/login',
  requireFields(['email', 'password']),
  loginController,
);

export default router;