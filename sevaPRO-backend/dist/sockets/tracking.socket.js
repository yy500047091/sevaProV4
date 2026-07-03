"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTrackingSocket = registerTrackingSocket;
const tracking_service_1 = require("../services/tracking.service");
function registerTrackingSocket(io, socket) {
    socket.on('joinRoom', (room) => {
        socket.join(room);
    });
    socket.on('workerLocation', (payload) => {
        const location = (0, tracking_service_1.setLocation)(payload.bookingId, payload.lat, payload.lng, payload.heading);
        io.to(`booking:${payload.bookingId}`).emit('locationUpdate', location);
    });
    socket.on('bookingStatus', (payload) => {
        io.to(`booking:${payload.bookingId}`).emit('statusChange', { status: payload.status });
    });
}
//# sourceMappingURL=tracking.socket.js.map