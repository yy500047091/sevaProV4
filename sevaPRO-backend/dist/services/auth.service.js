"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = sendOtp;
exports.verifyOtp = verifyOtp;
exports.loginWithPassword = loginWithPassword;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const User_1 = require("../models/User");
// In-memory OTP store: phone -> { otp, expiresAt }
const otpStore = new Map();
const DEV_OTP = '248637';
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function signToken(user) {
    return jsonwebtoken_1.default.sign({ sub: user._id.toString(), role: user.role }, env_1.env.jwtSecret, { expiresIn: env_1.env.jwtExpiresIn });
}
function signRefreshToken(user) {
    return jsonwebtoken_1.default.sign({ sub: user._id.toString(), role: user.role }, env_1.env.jwtSecret, { expiresIn: '30d' });
}
// ---------------------------------------------------------------------------
// OTP flow (customer phone login)
// ---------------------------------------------------------------------------
function sendOtp(phone) {
    if (!phone || phone.trim().length === 0) {
        throw new Error('A valid phone number is required.');
    }
    // In production you would call an SMS gateway here.
    // For non-production we use the hardcoded OTP.
    const otp = env_1.env.nodeEnv === 'production'
        ? String(Math.floor(100000 + Math.random() * 900000))
        : DEV_OTP;
    otpStore.set(phone.trim(), { otp, expiresAt: Date.now() + OTP_TTL_MS });
    console.log(`[OTP] Sent OTP ${otp} to ${phone}`);
    const result = {
        message: `OTP sent to ${phone}.`,
    };
    if (env_1.env.nodeEnv !== 'production') {
        result.devOtp = otp;
    }
    return result;
}
async function verifyOtp(phone, otp) {
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
    let user = await User_1.User.findOne({ phone: normalised });
    if (!user) {
        user = await User_1.User.create({
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
async function loginWithPassword(email, password) {
    const normalised = email.trim().toLowerCase();
    const user = await User_1.User.findOne({ email: normalised });
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
//# sourceMappingURL=auth.service.js.map