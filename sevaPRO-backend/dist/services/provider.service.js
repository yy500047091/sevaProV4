"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategories = listCategories;
exports.listProviders = listProviders;
exports.getProvider = getProvider;
const Category_1 = require("../models/Category");
const User_1 = require("../models/User");
async function listCategories() {
    return Category_1.Category.find({ isActive: true });
}
async function listProviders(serviceId) {
    // If we wanted to filter by service, we'd need to look up which providers offer it.
    // For now, just return all providers.
    return User_1.User.find({ role: 'provider' }).select('-password');
}
async function getProvider(providerId) {
    return User_1.User.findById(providerId).select('-password');
}
//# sourceMappingURL=provider.service.js.map