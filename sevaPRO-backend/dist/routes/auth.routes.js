"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.post('/send-otp', (0, validation_1.requireFields)(['phone']), auth_controller_1.sendOtpController);
router.post('/verify-otp', (0, validation_1.requireFields)(['phone', 'otp']), auth_controller_1.verifyOtpController);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map