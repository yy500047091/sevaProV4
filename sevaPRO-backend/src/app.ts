import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { connectDatabase } from './config/database';
import { env } from './config/env';
import { seedDatabase } from './config/seed';
import { errorHandler, notFound } from './middleware/errorHandler';
import routes from './routes';
import { registerNotificationSocket } from './sockets/notification.socket';
import { registerTrackingSocket } from './sockets/tracking.socket';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.corsOrigin,
    methods: ['GET', 'POST', 'PATCH'],
  },
});

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: '2mb' }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

io.on('connection', (socket) => {
  registerTrackingSocket(io, socket);
  registerNotificationSocket(socket);
});

async function bootstrap() {
  await connectDatabase();
  await seedDatabase();
  server.listen(env.port, () => {
    console.log(`ServeEase API running on http://localhost:${env.port}`);
  });
}

if (require.main === module) {
  bootstrap().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { app, io, server };
