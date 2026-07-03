import { Server, Socket } from 'socket.io';
import { setLocation } from '../services/tracking.service';

export function registerTrackingSocket(io: Server, socket: Socket) {
  socket.on('joinRoom', (room: string) => {
    socket.join(room);
  });

  socket.on('workerLocation', (payload: { bookingId: string; lat: number; lng: number; heading?: number }) => {
    const location = setLocation(payload.bookingId, payload.lat, payload.lng, payload.heading);
    io.to(`booking:${payload.bookingId}`).emit('locationUpdate', location);
  });

  socket.on('bookingStatus', (payload: { bookingId: string; status: string }) => {
    io.to(`booking:${payload.bookingId}`).emit('statusChange', { status: payload.status });
  });
}
