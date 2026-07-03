"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.providers = exports.categories = void 0;
exports.listCategories = listCategories;
exports.listProviders = listProviders;
exports.getProvider = getProvider;
exports.categories = [
    { id: 'cat_cleaning', name: 'Cleaning', icon: 'broom', color: '#EBF3FF', startingPrice: 350 },
    { id: 'cat_plumbing', name: 'Plumbing', icon: 'pipe-wrench', color: '#E0F5FF', startingPrice: 299 },
    { id: 'cat_electrical', name: 'Electrical', icon: 'lightning-bolt', color: '#FEF3C7', startingPrice: 249 },
    { id: 'cat_appliances', name: 'Appliance', icon: 'washing-machine', color: '#F0FDF4', startingPrice: 399 },
    { id: 'cat_carpentry', name: 'Carpentry', icon: 'hammer', color: '#FFF7ED', startingPrice: 349 },
    { id: 'cat_painting', name: 'Painting', icon: 'palette', color: '#FDF4FF', startingPrice: 499 },
    { id: 'cat_pest', name: 'Pest Control', icon: 'bug', color: '#F0FDF4', startingPrice: 599 },
    { id: 'cat_moving', name: 'Moving', icon: 'truck', color: '#EBF3FF', startingPrice: 799 },
    { id: 'cat_salon', name: 'Salon & Spa', icon: 'content-cut', color: '#FDF4FF', startingPrice: 299 },
    { id: 'cat_ac', name: 'AC Repair', icon: 'air-conditioner', color: '#E0F5FF', startingPrice: 449 },
    { id: 'cat_interior', name: 'Interior', icon: 'sofa', color: '#FFF7ED', startingPrice: 699 },
    { id: 'cat_more', name: 'More', icon: 'dots-horizontal', color: '#F1F5F9', startingPrice: 199 },
];
exports.providers = [
    {
        id: 'pro_amit',
        name: 'Amit Kumar',
        phone: '+919876543210',
        skills: ['cat_cleaning', 'cat_plumbing', 'cleaning', 'plumbing'],
        rating: 4.9,
        totalJobs: 1240,
        experience: 6,
        isOnline: true,
        distanceKm: 2.4,
        location: { lat: 28.595, lng: 77.24 },
        earnings: { today: 2850, weekly: 12850, total: 171409 },
    },
    {
        id: 'pro_neha',
        name: 'Neha Sharma',
        phone: '+919812345678',
        skills: ['cat_salon', 'salon', 'cat_interior'],
        rating: 4.8,
        totalJobs: 862,
        experience: 4,
        isOnline: true,
        distanceKm: 3.1,
        location: { lat: 28.62, lng: 77.22 },
        earnings: { today: 1840, weekly: 9340, total: 98200 },
    },
    {
        id: 'pro_rajesh',
        name: 'Rajesh Verma',
        phone: '+919998887777',
        skills: ['cat_electrical', 'cat_appliances', 'cat_ac', 'electrical', 'ac_repair'],
        rating: 4.7,
        totalJobs: 1034,
        experience: 7,
        isOnline: true,
        distanceKm: 4.2,
        location: { lat: 28.605, lng: 77.19 },
        earnings: { today: 2240, weekly: 11890, total: 132700 },
    },
];
function listCategories() {
    return exports.categories;
}
function listProviders(serviceId) {
    if (!serviceId) {
        return exports.providers;
    }
    return exports.providers.filter((provider) => provider.skills.includes(serviceId));
}
function getProvider(providerId) {
    return exports.providers.find((provider) => provider.id === providerId) || exports.providers[0];
}
//# sourceMappingURL=provider.service.js.map