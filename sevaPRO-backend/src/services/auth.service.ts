import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { IUser, User } from '../models/User';

// In-memory OTP store: phone -> { otp, expiresAt }
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

const DEV_OTP = '248637';
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function signToken(user: IUser): string {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn } as jwt.SignOptions,
  );
}

function signRefreshToken(user: IUser): string {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.jwtSecret,
    { expiresIn: '30d' } as jwt.SignOptions,
  );
}

// ---------------------------------------------------------------------------
// OTP flow (customer phone login)
// ---------------------------------------------------------------------------

export function sendOtp(phone: string): { message: string; devOtp?: string } {
  if (!phone || phone.trim().length === 0) {
    throw new Error('A valid phone number is required.');
  }

  // In production you would call an SMS gateway here.
  // For non-production we use the hardcoded OTP.
  const otp = env.nodeEnv === 'production'
    ? String(Math.floor(100000 + Math.random() * 900000))
    : DEV_OTP;

  otpStore.set(phone.trim(), { otp, expiresAt: Date.now() + OTP_TTL_MS });

  console.log(`[OTP] Sent OTP ${otp} to ${phone}`);

  const result: { message: string; devOtp?: string } = {
    message: `OTP sent to ${phone}.`,
  };

  if (env.nodeEnv !== 'production') {
    result.devOtp = otp;
  }

  return result;
}

export async function verifyOtp(
  phone: string,
  otp: string,
): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
  const normalised = phone.trim();
  const entry = otpStore.get(normalised);

  if (!entry) {
    throw new Error('No OTP requested for this phone number.');
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalised);
    throw new Error('OTP has expired. Please request a new one.');
  }

  if (entry.otp !== otp.trim()) {
    throw new Error('Invalid OTP. Please try again.');
  }

  // OTP verified — remove from store
  otpStore.delete(normalised);

  // Upsert customer user
  let user = await User.findOne({ phone: normalised });
  if (!user) {
    user = await User.create({
      name: `Customer ${normalised.slice(-4)}`,
      phone: normalised,
      role: 'customer',
    });
  }

  const accessToken = signToken(user);
  const refreshToken = signRefreshToken(user);

  return { accessToken, refreshToken, user };
}

// ---------------------------------------------------------------------------
// Email + password login (admin / provider only)
// ---------------------------------------------------------------------------

export async function loginWithPassword(
  email: string,
  password: string,
): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
  const normalised = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalised });
  if (!user) {
    throw new Error('Invalid email or password.');
  }

  if (user.role !== 'admin' && user.role !== 'provider') {
    throw new Error('This login method is only available for admin and provider accounts.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  const accessToken = signToken(user);
  const refreshToken = signRefreshToken(user);

  return { accessToken, refreshToken, user };
}
