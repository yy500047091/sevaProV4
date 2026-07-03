"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerNotificationSocket = registerNotificationSocket;
function registerNotificationSocket(socket) {
    socket.on('joinUser', (userId) => {
        socket.join(`user:${userId}`);
    });
}
//# sourceMappingURL=notification.socket.js.map