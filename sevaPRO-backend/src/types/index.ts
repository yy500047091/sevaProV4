import { Request } from 'express';
import { IUser } from '../models/User';

export type { UserRole } from '../models/User';
export type { BookingStatus, PaymentStatus } from '../models/Booking';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
