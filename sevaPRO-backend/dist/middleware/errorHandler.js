"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = notFound;
exports.errorHandler = errorHandler;
function notFound(req, res) {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}
function errorHandler(error, _req, res, _next) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Internal server error.' });
}
//# sourceMappingURL=errorHandler.js.map