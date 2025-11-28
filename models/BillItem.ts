import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IBillItem extends Document {
  billId: mongoose.Types.ObjectId;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  timestamp?: Date;
  isSuspicious: boolean;
  suspicionReasons: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BillItemSchema = new Schema<IBillItem>(
  {
    billId: {
      type: Schema.Types.ObjectId,
      ref: 'Bill',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    timestamp: Date,
    isSuspicious: {
      type: Boolean,
      default: false,
    },
    suspicionReasons: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default models.BillItem || model<IBillItem>('BillItem', BillItemSchema);
