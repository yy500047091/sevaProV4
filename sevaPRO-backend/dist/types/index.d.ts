import { Request } from 'express';
export type UserRole = 'customer' | 'worker' | 'admin';
export type BookingStatus = 'pending_payment' | 'confirmed' | 'worker_assigned' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
export interface Address {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    lat: number;
    lng: number;
}
export interface UserProfile {
    id: string;
    phone: string;
    name: string;
    email?: string;
    role: UserRole;
    addresses: Address[];
    wallet: {
        balance: number;
    };
    createdAt: string;
}
export interface ProviderProfile {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
    skills: string[];
    rating: number;
    totalJobs: number;
    experience: number;
    isOnline: boolean;
    distanceKm: number;
    location: {
        lat: number;
        lng: number;
    };
    earnings: {
        today: number;
        weekly: number;
        total: number;
    };
}
export interface ServiceCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
    startingPrice: number;
}
export interface BookingPricing {
    base: number;
    platformFee: number;
    gst: number;
    discount: number;
    total: number;
}
export interface Booking {
    id: string;
    bookingId: string;
    customerId: string;
    providerId?: string;
    serviceId: string;
    subServiceId: string;
    scheduledAt: string;
    address: Address;
    status: BookingStatus;
    otp: string;
    couponCode?: string;
    pricing: BookingPricing;
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    createdAt: string;
    updatedAt: string;
}
export interface AuthenticatedRequest extends Request {
    user?: UserProfile;
}
//# sourceMappingURL=index.d.ts.map