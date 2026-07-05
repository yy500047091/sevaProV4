import { Response } from 'express';
import {
  createBooking,
  getCustomerBookings,
  getAllBookings,
  getProviderBookings,
  assignProvider,
  completeBooking,
  getAdminStats,
  getAllProviders,
} from '../services/booking.service';
import { AuthenticatedRequest } from '../types';

export async function createBookingController(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
    const booking = await createBooking({
      customerId: req.user._id.toString(),
      serviceId: req.body.serviceId,
      address: req.body.address,
      scheduledAt: req.body.scheduledAt,
    });
    res.status(201).json({ booking });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Booking failed.' });
  }
}

export async function customerBookingsController(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
    const bookings = await getCustomerBookings(req.user._id.toString());
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
}

export async function adminBookingsController(req: AuthenticatedRequest, res: Response) {
  try {
    const bookings = await getAllBookings();
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
}

export async function providerBookingsController(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
    const bookings = await getProviderBookings(req.user._id.toString());
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
}

export async function assignProviderController(req: AuthenticatedRequest, res: Response) {
  try {
    const booking = await assignProvider(String(req.params.id), req.body.providerId);
    res.json({ booking });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Assignment failed.' });
  }
}

export async function completeBookingController(req: AuthenticatedRequest, res: Response) {
  try {
    const booking = await completeBooking(String(req.params.id));
    res.json({ booking });
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Completion failed.' });
  }
}

export async function adminStatsController(_req: AuthenticatedRequest, res: Response) {
  try {
    const stats = await getAdminStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
}

export async function allProvidersController(_req: AuthenticatedRequest, res: Response) {
  try {
    const providers = await getAllProviders();
    res.json({ providers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch providers.' });
  }
}
