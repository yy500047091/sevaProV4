import { Socket } from 'socket.io';

export function registerNotificationSocket(socket: Socket) {
  socket.on('joinUser', (userId: string) => {
    socket.join(`user:${userId}`);
  });
}
