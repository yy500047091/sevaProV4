import { IUser } from '../models/User';
export declare function sendOtp(phone: string): {
    message: string;
    devOtp?: string;
};
export declare function verifyOtp(phone: string, otp: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IUser;
}>;
export declare function loginWithPassword(email: string, password: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: IUser;
}>;
//# sourceMappingURL=auth.service.d.ts.map