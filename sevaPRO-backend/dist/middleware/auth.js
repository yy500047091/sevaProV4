"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const auth_service_1 = require("../services/auth.service");
function authenticate(req, res, next) {
    try {
        const header = req.headers.authorization;
        const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
        if (!token) {
            return res.status(401).json({ error: 'Missing bearer token.' });
        }
        req.user = (0, auth_service_1.getUserByToken)(token);
        return next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
}
//# sourceMappingURL=auth.js.map