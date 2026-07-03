"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = sendOtp;
exports.verifyOtp = verifyOtp;
exports.getUserByToken = getUserByToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const users = new Map();
const otps = new Map();
const defaultAddress = {
    line1: '221B Baker Street',
    city: 'London',
    state: 'London',
    pincode: 'NW16XE',
    lat: 28.6139,
    lng: 77.209,
};
function userKey(phone, role) {
    return `${role}:${phone}`;
}
function createUser(phone, role) {
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
function sendOtp(phone, role = 'customer') {
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
function verifyOtp(phone, otp, role = 'customer') {
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
    const accessToken = jsonwebtoken_1.default.sign({ sub: user.id, phone: user.phone, role: user.role }, env_1.env.jwtSecret, { expiresIn: env_1.env.jwtExpiresIn });
    const refreshToken = jsonwebtoken_1.default.sign({ sub: user.id, phone: user.phone, role: user.role, type: 'refresh' }, env_1.env.jwtSecret, { expiresIn: '30d' });
    return { accessToken, refreshToken, user };
}
function getUserByToken(token) {
    const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
    const user = users.get(userKey(decoded.phone, decoded.role));
    if (!user) {
        throw new Error('Authenticated user was not found.');
    }
    return user;
}
//# sourceMappingURL=auth.service.js.map