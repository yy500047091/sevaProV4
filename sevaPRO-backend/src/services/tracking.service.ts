import { BookingStatus } from '../types';

const locations = new Map<string, { lat: number; lng: number; heading?: number }>();

export function setLocation(bookingId: string, lat: number, lng: number, heading?: number) {
  const location = { lat, lng, heading };
  locations.set(bookingId, location);
  return location;
}

export function getLocation(bookingId: string) {
  return locations.get(bookingId) || { lat: 28.595, lng: 77.24, heading: 90 };
}

export function normalizeStatus(status: string): BookingStatus {
  const allowed: BookingStatus[] = [
    'pending_payment',
    'confirmed',
    'worker_assigned',
    'en_route',
    'arrived',
    'in_progress',
    'completed',
    'cancelled',
  ];

  if (!allowed.includes(status as BookingStatus)) {
    throw new Error('Unsupported booking status.');
  }

  return status as BookingStatus;
}
