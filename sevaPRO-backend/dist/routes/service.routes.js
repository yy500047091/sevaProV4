"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Service_1 = require("../models/Service");
const router = (0, express_1.Router)();
router.get('/', async (_req, res) => {
    try {
        const services = await Service_1.Service.find();
        res.json({ services });
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch services.' });
    }
});
exports.default = router;
//# sourceMappingURL=service.routes.js.map