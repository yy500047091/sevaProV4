import mongoose, { Document } from 'mongoose';
export interface IService extends Document {
    name: string;
    description: string;
    price: number;
    duration: number;
    icon: string;
    categoryId?: mongoose.Types.ObjectId;
    checklist: string[];
}
export declare const Service: mongoose.Model<IService, {}, {}, {}, mongoose.Document<unknown, {}, IService, {}, mongoose.DefaultSchemaOptions> & IService & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IService>;
//# sourceMappingURL=Service.d.ts.map