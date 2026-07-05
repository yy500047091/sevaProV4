"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpController = sendOtpController;
exports.verifyOtpController = verifyOtpController;
exports.loginController = loginController;
const auth_service_1 = require("../services/auth.service");
async function sendOtpController(req, res) {
    try {
        const { phone } = req.body;
        const result = (0, auth_service_1.sendOtp)(phone);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to send OTP.' });
    }
}
async function verifyOtpController(req, res) {
    try {
        const { phone, otp } = req.body;
        const result = await (0, auth_service_1.verifyOtp)(phone, otp);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'OTP verification failed.' });
    }
}
async function loginController(req, res) {
    try {
        const { email, password } = req.body;
        const result = await (0, auth_service_1.loginWithPassword)(email, password);
        res.json(result);
    }
    catch (error) {
        res.status(401).json({ error: error instanceof Error ? error.message : 'Login failed.' });
    }
}
//# sourceMappingURL=auth.controller.js.map