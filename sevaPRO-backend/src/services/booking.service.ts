import { Address, Booking, BookingPricing, BookingStatus } from '../types';
import { providers } from './provider.service';

const bookings = new Map<string, Booking>();

const basePrices: Record<string, number> = {
  cat_cleaning: 350,
  cat_plumbing: 299,
  cat_electrical: 249,
  cat_appliances: 399,
  cat_carpentry: 349,
  cat_painting: 499,
  cat_pest: 599,
  cat_moving: 799,
  cat_salon: 299,
  cat_ac: 449,
  cat_interior: 699,
  plumbing: 299,
  electrical: 249,
  cleaning: 350,
  ac_repair: 449,
  salon: 299,
};

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

function calculatePricing(serviceId: string, couponCode?: string): BookingPricing {
  const base = basePrices[serviceId] || 350;
  const platformFee = 49;
  const discount = couponCode === 'WELCOME100' ? 100 : 0;
  const taxable = Math.max(0, base + platformFee - discount);
  const gst = Math.round(taxable * 0.18);

  return { base, platformFee, gst, discount, total: taxable + gst };
}

export function createBooking(input: {
  customerId: string;
  serviceId: string;
  subServiceId: string;
  scheduledAt: string;
  address: Address;
  couponCode?: string;
}) {
  const now = new Date().toISOString();
  const provider = providers.find((item) => item.skills.includes(input.serviceId)) || providers[0];
  const booking: Booking = {
    id: makeId('mongo'),
    bookingId: makeId('book'),
    customerId: input.customerId,
    providerId: provider.id,
    serviceId: input.serviceId,
    subServiceId: input.subServiceId,
    scheduledAt: input.scheduledAt,
    address: input.address,
    status: 'pending_payment',
    otp: '248637',
    couponCode: input.couponCode,
    pricing: calculatePricing(input.serviceId, input.couponCode),
    paymentStatus: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  bookings.set(booking.bookingId, booking);
  return booking;
}

export function listCustomerBookings(customerId: string) {
  return Array.from(bookings.values())
    .filter((booking) => booking.customerId === customerId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listProviderBookings(providerId: string) {
  return Array.from(bookings.values())
    .filter((booking) => booking.providerId === providerId || booking.status === 'confirmed')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getBooking(bookingId: string) {
  const booking = bookings.get(bookingId);
  if (!booking) {
    throw new Error('Booking not found.');
  }
  return booking;
}

export function updateBookingStatus(bookingId: string, status: BookingStatus) {
  const booking = getBooking(bookingId);
  booking.status = status;
  booking.updatedAt = new Date().toISOString();
  bookings.set(booking.bookingId, booking);
  return booking;
}

export function markBookingPaid(bookingId: string) {
  const booking = getBooking(bookingId);
  booking.paymentStatus = 'paid';
  booking.status = 'worker_assigned';
  booking.updatedAt = new Date().toISOString();
  bookings.set(booking.bookingId, booking);
  return booking;
}

export function seedBookings(customerId: string) {
  if (listCustomerBookings(customerId).length > 0) {
    return;
  }

  createBooking({
    customerId,
    serviceId: 'cat_cleaning',
    subServiceId: 'deep_cleaning',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    address: {
      line1: '221B Baker Street',
      city: 'London',
      state: 'London',
      pincode: 'NW16XE',
      lat: 28.6139,
      lng: 77.209,
    },
  });
}

export function seedProviderBookings(providerId: string) {
  if (listProviderBookings(providerId).length > 0) {
    return;
  }

  const booking = createBooking({
    customerId: 'usr_customer_demo',
    serviceId: 'cat_cleaning',
    subServiceId: 'deep_cleaning',
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    address: {
      line1: 'Flat 405, Green Heights',
      city: 'London',
      state: 'London',
      pincode: 'NW16XE',
      lat: 28.6139,
      lng: 77.209,
    },
  });
  booking.providerId = providerId;
  booking.status = 'worker_assigned';
  booking.paymentStatus = 'paid';
}
