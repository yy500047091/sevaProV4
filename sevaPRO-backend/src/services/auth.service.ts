import '../config/firebase';

import jwt from 'jsonwebtoken';
import { getAuth } from 'firebase-admin/auth';

import { env } from '../config/env';
import { IUser, User } from '../models/User';

// ---------------------------------------------------------------------------
// JWT Helpers
// ---------------------------------------------------------------------------

function signToken(user: IUser): string {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    } as jwt.SignOptions,
  );
}

function signRefreshToken(user: IUser): string {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    env.jwtSecret,
    {
      expiresIn: '30d',
    } as jwt.SignOptions,
  );
}

// ---------------------------------------------------------------------------
// Customer Phone Login (Firebase)
// ---------------------------------------------------------------------------

// Firebase sends the OTP from the mobile app.
// Backend does not generate OTP anymore.
export async function sendOtp(phone: string): Promise<{ message: string }> {
  if (!phone || phone.trim().length === 0) {
    throw new Error('A valid phone number is required.');
  }

  return {
    message:
      'OTP will be sent using Firebase Phone Authentication from the mobile app.',
  };
}

// Backend verifies Firebase ID Token after OTP verification.
export async function verifyOtp(
  idToken: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
  user: IUser;
}> {
  const decodedToken = await getAuth().verifyIdToken(idToken);

  const phone = decodedToken.phone_number;

  if (!phone) {
    throw new Error('Phone number not found in Firebase token.');
  }

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({
      name: `Customer ${phone.slice(-4)}`,
      phone,
      role: 'customer',
    });
  }

  const accessToken = signToken(user);
  const refreshToken = signRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    user,
  };
}

// ---------------------------------------------------------------------------
// Email + Password Login (Admin / Provider)
// ---------------------------------------------------------------------------

export async function loginWithPassword(
  email: string,
  password: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
  user: IUser;
}> {
  const normalised = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalised,
  });

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  if (user.role !== 'admin' && user.role !== 'provider') {
    throw new Error(
      'This login method is only available for admin and provider accounts.',
    );
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  const accessToken = signToken(user);
  const refreshToken = signRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    user,
  };
}