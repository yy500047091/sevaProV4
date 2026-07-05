import mongoose, { Document } from 'mongoose';
export type UserRole = 'customer' | 'provider' | 'admin';
export interface IUser extends Document {
    name: string;
    phone?: string;
    email?: string;
    password?: string;
    role: UserRole;
    profileImage?: string;
    bio?: string;
    rating?: number;
    totalJobs?: number;
    walletBalance: number;
    createdAt: Date;
    comparePassword(candidate: string): Promise<boolean>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
//# sourceMappingURL=User.d.ts.map