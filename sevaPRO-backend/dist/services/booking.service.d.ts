import mongoose from 'mongoose';
export declare function createBooking(input: {
    customerId: string;
    serviceId: string;
    address: string;
    scheduledAt: string;
}): Promise<mongoose.PopulateDocumentResult<mongoose.Document<unknown, {}, import("../models/Booking").IBooking, {}, mongoose.DefaultSchemaOptions> & import("../models/Booking").IBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, {}, import("../models/Booking").IBooking, import("../models/Booking").IBooking>>;
export declare function getCustomerBookings(customerId: string): Promise<(mongoose.Document<unknown, {}, import("../models/Booking").IBooking, {}, mongoose.DefaultSchemaOptions> & import("../models/Booking").IBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
export declare function getAllBookings(): Promise<(mongoose.Document<unknown, {}, import("../models/Booking").IBooking, {}, mongoose.DefaultSchemaOptions> & import("../models/Booking").IBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
export declare function getProviderBookings(providerId: string): Promise<(mongoose.Document<unknown, {}, import("../models/Booking").IBooking, {}, mongoose.DefaultSchemaOptions> & import("../models/Booking").IBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
export declare function assignProvider(bookingId: string, providerId: string): Promise<mongoose.Document<unknown, {}, import("../models/Booking").IBooking, {}, mongoose.DefaultSchemaOptions> & import("../models/Booking").IBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare function completeBooking(bookingId: string): Promise<mongoose.Document<unknown, {}, import("../models/Booking").IBooking, {}, mongoose.DefaultSchemaOptions> & import("../models/Booking").IBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare function getAdminStats(): Promise<{
    totalCompleted: number;
    totalRevenue: number;
}>;
export declare function getAllProviders(): Promise<(mongoose.Document<unknown, {}, import("../models/User").IUser, {}, mongoose.DefaultSchemaOptions> & import("../models/User").IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
})[]>;
//# sourceMappingURL=booking.service.d.ts.map