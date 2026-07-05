"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesController = categoriesController;
exports.providersController = providersController;
const provider_service_1 = require("../services/provider.service");
async function categoriesController(_req, res) {
    const categories = await (0, provider_service_1.listCategories)();
    res.json({ categories });
}
async function providersController(req, res) {
    const providers = await (0, provider_service_1.listProviders)(req.query.serviceId);
    res.json({ providers });
}
//# sourceMappingURL=provider.controller.js.map