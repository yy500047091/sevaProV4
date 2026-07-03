"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpController = sendOtpController;
exports.verifyOtpController = verifyOtpController;
const auth_service_1 = require("../services/auth.service");
function sendOtpController(req, res) {
    const { phone, role = 'customer' } = req.body;
    const result = (0, auth_service_1.sendOtp)(phone, role);
    res.json(result);
}
function verifyOtpController(req, res) {
    try {
        const { phone, otp, role = 'customer' } = req.body;
        res.json((0, auth_service_1.verifyOtp)(phone, otp, role));
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'OTP verification failed.' });
    }
}
//# sourceMappingURL=auth.controller.js.map