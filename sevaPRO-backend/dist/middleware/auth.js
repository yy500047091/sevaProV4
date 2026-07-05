"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireRole = requireRole;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const User_1 = require("../models/User");
async function authenticate(req, res, next) {
    try {
        const header = req.headers.authorization;
        const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
        if (!token)
            return res.status(401).json({ error: 'Missing bearer token.' });
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        const user = await User_1.User.findById(decoded.sub);
        if (!user)
            return res.status(401).json({ error: 'User not found.' });
        req.user = user;
        return next();
    }
    catch {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
}
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: insufficient role.' });
        }
        return next();
    };
}
//# sourceMappingURL=auth.js.map