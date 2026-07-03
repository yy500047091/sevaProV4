"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const booking_routes_1 = __importDefault(require("./booking.routes"));
const provider_routes_1 = __importDefault(require("./provider.routes"));
const router = (0, express_1.Router)();
router.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'ServeEase API' });
});
router.use('/auth', auth_routes_1.default);
router.use('/bookings', booking_routes_1.default);
router.use('/catalog', provider_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map