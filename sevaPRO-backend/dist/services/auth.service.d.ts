import { UserProfile, UserRole } from '../types';
export declare function sendOtp(phone: string, role?: UserRole): {
    message: string;
    expiresIn: number;
    devOtp: string;
};
export declare function verifyOtp(phone: string, otp: string, role?: UserRole): {
    accessToken: string;
    refreshToken: string;
    user: UserProfile;
};
export declare function getUserByToken(token: string): UserProfile;
//# sourceMappingURL=auth.service.d.ts.map