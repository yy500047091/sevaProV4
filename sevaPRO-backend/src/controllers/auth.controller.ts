import { Request, Response } from 'express';
import { sendOtp, verifyOtp } from '../services/auth.service';
import { UserRole } from '../types';

export function sendOtpController(req: Request, res: Response) {
  const { phone, role = 'customer' } = req.body as { phone: string; role?: UserRole };
  const result = sendOtp(phone, role);
  res.json(result);
}

export function verifyOtpController(req: Request, res: Response) {
  try {
    const { phone, otp, role = 'customer' } = req.body as {
      phone: string;
      otp: string;
      role?: UserRole;
    };
    res.json(verifyOtp(phone, otp, role));
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'OTP verification failed.' });
  }
}
