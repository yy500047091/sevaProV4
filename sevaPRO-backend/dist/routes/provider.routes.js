"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const provider_controller_1 = require("../controllers/provider.controller");
const router = (0, express_1.Router)();
router.get('/categories', provider_controller_1.categoriesController);
router.get('/providers', provider_controller_1.providersController);
exports.default = router;
//# sourceMappingURL=provider.routes.js.map