"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLocation = setLocation;
exports.getLocation = getLocation;
exports.normalizeStatus = normalizeStatus;
const locations = new Map();
function setLocation(bookingId, lat, lng, heading) {
    const location = { lat, lng, heading };
    locations.set(bookingId, location);
    return location;
}
function getLocation(bookingId) {
    return locations.get(bookingId) || { lat: 28.595, lng: 77.24, heading: 90 };
}
function normalizeStatus(status) {
    const allowed = [
        'pending',
        'assigned',
        'completed',
        'cancelled',
    ];
    if (!allowed.includes(status)) {
        throw new Error('Unsupported booking status.');
    }
    return status;
}
//# sourceMappingURL=tracking.service.js.map