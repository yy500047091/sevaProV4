import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare function createBookingController(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function customerBookingsController(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function adminBookingsController(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function providerBookingsController(req: AuthenticatedRequest, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function assignProviderController(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function completeBookingController(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function adminStatsController(_req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function allProvidersController(_req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=booking.controller.d.ts.map