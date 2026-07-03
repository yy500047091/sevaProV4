import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare function createBookingController(req: AuthenticatedRequest, res: Response): Response<any, Record<string, any>> | undefined;
export declare function customerBookingsController(req: AuthenticatedRequest, res: Response): Response<any, Record<string, any>> | undefined;
export declare function workerBookingsController(req: AuthenticatedRequest, res: Response): Response<any, Record<string, any>> | undefined;
export declare function bookingDetailsController(req: AuthenticatedRequest, res: Response): void;
export declare function verifyPaymentController(req: AuthenticatedRequest, res: Response): Response<any, Record<string, any>>;
export declare function updateBookingStatusController(req: AuthenticatedRequest, res: Response): Response<any, Record<string, any>>;
//# sourceMappingURL=booking.controller.d.ts.map