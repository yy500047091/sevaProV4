import { Request, Response } from 'express';
import {
  sendOtp,
  verifyOtp,
  loginWithPassword,
  devLogin,
} from '../services/auth.service';
// ---------------------------------------------------------------------------
// Customer Phone Login
// ---------------------------------------------------------------------------

export async function sendOtpController(req: Request, res: Response) {
  try {
    const { phone } = req.body as { phone: string };

    const result = await sendOtp(phone);

    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to send OTP.',
    });
  }
}

export async function verifyOtpController(req: Request, res: Response) {
  try {
    const { idToken } = req.body as { idToken: string };

    const result = await verifyOtp(idToken);

    res.json(result);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : 'OTP verification failed.',
    });
  }
}
export async function devLoginController(req: Request, res: Response) {
  try {
    const { phone } = req.body as { phone: string };

    const result = await devLogin(phone);

    res.json(result);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error
          ? error.message
          : 'Development login failed.',
    });
  }
}
// ---------------------------------------------------------------------------
// Admin / Provider Login
// ---------------------------------------------------------------------------

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    const result = await loginWithPassword(email, password);

    res.json(result);
  } catch (error) {
    res.status(401).json({
      error: error instanceof Error ? error.message : 'Login failed.',
    });
  }
}