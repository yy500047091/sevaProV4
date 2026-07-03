import { Response } from 'express';
import {
  createBooking,
  getBooking,
  listCustomerBookings,
  listProviderBookings,
  markBookingPaid,
  seedBookings,
  seedProviderBookings,
  updateBookingStatus,
} from '../services/booking.service';
import { createPaymentOrder, verifyPaymentSignature } from '../services/payment.service';
import { normalizeStatus } from '../services/tracking.service';
import { AuthenticatedRequest } from '../types';

export function createBookingController(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  const booking = createBooking({
    customerId: req.user.id,
    serviceId: req.body.serviceId,
    subServiceId: req.body.subServiceId,
    scheduledAt: req.body.scheduledAt,
    address: req.body.address,
    couponCode: req.body.couponCode,
  });

  res.status(201).json({
    booking,
    paymentParams: createPaymentOrder(booking.bookingId, booking.pricing.total),
  });
}

export function customerBookingsController(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  seedBookings(req.user.id);
  res.json({ bookings: listCustomerBookings(req.user.id) });
}

export function workerBookingsController(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  seedProviderBookings('pro_amit');
  res.json({ bookings: listProviderBookings('pro_amit') });
}

export function bookingDetailsController(req: AuthenticatedRequest, res: Response) {
  try {
    res.json({ booking: getBooking(String(req.params.bookingId)) });
  } catch (error) {
    res.status(404).json({ error: error instanceof Error ? error.message : 'Booking not found.' });
  }
}

export function verifyPaymentController(req: AuthenticatedRequest, res: Response) {
  try {
    const ok = verifyPaymentSignature();
    if (!ok) {
      return res.status(400).json({ error: 'Payment signature verification failed.' });
    }
    const booking = markBookingPaid(req.body.bookingId);
    return res.json({ booking });
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Payment failed.' });
  }
}

export function updateBookingStatusController(req: AuthenticatedRequest, res: Response) {
  try {
    const status = normalizeStatus(req.body.status);
    const booking = updateBookingStatus(String(req.params.bookingId), status);
    return res.json({ booking });
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Status update failed.' });
  }
}
