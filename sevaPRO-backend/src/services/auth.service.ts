import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserProfile, UserRole } from '../types';

const users = new Map<string, UserProfile>();
const otps = new Map<string, { code: string; expiresAt: number; role: UserRole }>();

const defaultAddress = {
  line1: '221B Baker Street',
  city: 'London',
  state: 'London',
  pincode: 'NW16XE',
  lat: 28.6139,
  lng: 77.209,
};

function userKey(phone: string, role: UserRole) {
  return `${role}:${phone}`;
}

function createUser(phone: string, role: UserRole): UserProfile {
  const suffix = phone.slice(-4);
  return {
    id: `usr_${role}_${suffix}`,
    phone,
    name: role === 'worker' ? 'Amit Kumar' : 'Rohit Sharma',
    role,
    addresses: [defaultAddress],
    wallet: { balance: role === 'worker' ? 5680 : 150 },
    createdAt: new Date().toISOString(),
  };
}

export function sendOtp(phone: string, role: UserRole = 'customer') {
  const code = process.env.NODE_ENV === 'production'
    ? String(Math.floor(100000 + Math.random() * 900000))
    : '248637';

  otps.set(userKey(phone, role), {
    code,
    role,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  return {
    message: 'OTP generated successfully.',
    expiresIn: 300,
    devOtp: code,
  };
}

export function verifyOtp(phone: string, otp: string, role: UserRole = 'customer') {
  const key = userKey(phone, role);
  const record = otps.get(key);

  if (!record || record.expiresAt < Date.now()) {
    throw new Error('OTP expired. Please request a new code.');
  }

  if (record.code !== otp) {
    throw new Error('Invalid verification code.');
  }

  let user = users.get(key);
  if (!user) {
    user = createUser(phone, role);
    users.set(key, user);
  }

  otps.delete(key);

  const accessToken = jwt.sign(
    { sub: user.id, phone: user.phone, role: user.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] },
  );

  const refreshToken = jwt.sign(
    { sub: user.id, phone: user.phone, role: user.role, type: 'refresh' },
    env.jwtSecret,
    { expiresIn: '30d' },
  );

  return { accessToken, refreshToken, user };
}

export function getUserByToken(token: string): UserProfile {
  const decoded = jwt.verify(token, env.jwtSecret) as { phone: string; role: UserRole };
  const user = users.get(userKey(decoded.phone, decoded.role));
  if (!user) {
    throw new Error('Authenticated user was not found.');
  }
  return user;
}
