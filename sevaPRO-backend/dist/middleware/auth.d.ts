import { NextFunction, Response } from 'express';
import { UserRole } from '../models/User';
import { AuthenticatedRequest } from '../types';
export declare function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
export declare function requireRole(...roles: UserRole[]): (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=auth.d.ts.map