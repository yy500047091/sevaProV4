import { BookingStatus } from '../types';
export declare function setLocation(bookingId: string, lat: number, lng: number, heading?: number): {
    lat: number;
    lng: number;
    heading: number | undefined;
};
export declare function getLocation(bookingId: string): {
    lat: number;
    lng: number;
    heading?: number;
};
export declare function normalizeStatus(status: string): BookingStatus;
//# sourceMappingURL=tracking.service.d.ts.map