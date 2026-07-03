import { Address, Booking, BookingStatus } from '../types';
export declare function createBooking(input: {
    customerId: string;
    serviceId: string;
    subServiceId: string;
    scheduledAt: string;
    address: Address;
    couponCode?: string;
}): Booking;
export declare function listCustomerBookings(customerId: string): Booking[];
export declare function listProviderBookings(providerId: string): Booking[];
export declare function getBooking(bookingId: string): Booking;
export declare function updateBookingStatus(bookingId: string, status: BookingStatus): Booking;
export declare function markBookingPaid(bookingId: string): Booking;
export declare function seedBookings(customerId: string): void;
//# sourceMappingURL=booking.service.d.ts.map