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
    const query = { role: 'provider' };
    if (serviceId) {
        // Filter providers by service if that field is available.
        query.skills = serviceId;
    }
    return User_1.User.find(query).select('-password');
}
async function getProvider(providerId) {
    return User_1.User.findById(providerId).select('-password');
}
//# sourceMappingURL=provider.service.js.map