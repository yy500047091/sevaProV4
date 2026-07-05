"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.io = exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const seed_1 = require("./config/seed");
const errorHandler_1 = require("./middleware/errorHandler");
const routes_1 = __importDefault(require("./routes"));
const notification_socket_1 = require("./sockets/notification.socket");
const tracking_socket_1 = require("./sockets/tracking.socket");
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: env_1.env.corsOrigin,
        methods: ['GET', 'POST', 'PATCH'],
    },
});
exports.io = io;
app.use((0, cors_1.default)({ origin: env_1.env.corsOrigin }));
app.use(express_1.default.json({ limit: '2mb' }));
app.use('/api', routes_1.default);
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
io.on('connection', (socket) => {
    (0, tracking_socket_1.registerTrackingSocket)(io, socket);
    (0, notification_socket_1.registerNotificationSocket)(socket);
});
async function bootstrap() {
    await (0, database_1.connectDatabase)();
    await (0, seed_1.seedDatabase)();
    server.listen(env_1.env.port, () => {
        console.log(`ServeEase API running on http://localhost:${env_1.env.port}`);
    });
}
if (require.main === module) {
    bootstrap().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
//# sourceMappingURL=app.js.map