"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesController = categoriesController;
exports.providersController = providersController;
const provider_service_1 = require("../services/provider.service");
function categoriesController(_req, res) {
    res.json({ categories: (0, provider_service_1.listCategories)() });
}
function providersController(req, res) {
    res.json({ providers: (0, provider_service_1.listProviders)(req.query.serviceId) });
}
//# sourceMappingURL=provider.controller.js.map