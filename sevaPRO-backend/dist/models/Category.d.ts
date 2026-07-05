import mongoose, { Document } from 'mongoose';
export interface ICategory extends Document {
    name: string;
    icon: string;
    color?: string;
    isActive: boolean;
}
export declare const Category: mongoose.Model<ICategory, {}, {}, {}, mongoose.Document<unknown, {}, ICategory, {}, mongoose.DefaultSchemaOptions> & ICategory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICategory>;
//# sourceMappingURL=Category.d.ts.map