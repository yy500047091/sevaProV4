import mongoose, { Document } from 'mongoose';
export type TransactionType = 'deposit' | 'withdrawal' | 'earning' | 'payment';
export interface ITransaction extends Document {
    user: mongoose.Types.ObjectId;
    booking?: mongoose.Types.ObjectId;
    amount: number;
    type: TransactionType;
    status: 'pending' | 'completed' | 'failed';
    description: string;
    createdAt: Date;
}
export declare const Transaction: mongoose.Model<ITransaction, {}, {}, {}, mongoose.Document<unknown, {}, ITransaction, {}, mongoose.DefaultSchemaOptions> & ITransaction & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ITransaction>;
//# sourceMappingURL=Transaction.d.ts.map