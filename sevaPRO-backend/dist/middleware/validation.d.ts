import { NextFunction, Request, Response } from 'express';
export declare function requireFields(fields: string[]): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=validation.d.ts.map