import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../types';
export declare function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
//# sourceMappingURL=auth.d.ts.map