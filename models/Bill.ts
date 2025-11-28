import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IBill extends Document {
  caseId: mongoose.Types.ObjectId;
  totalAmount: number;
  fileUrl?: string;
  parsedData: Record<string, any>;
  fraudScore: number;
  estimatedOverchargeMin: number;
  estimatedOverchargeMax: number;
  analysisExplanation: string;
  createdAt: Date;
  updatedAt: Date;
}

const BillSchema = new Schema<IBill>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    fileUrl: String,
    parsedData: {
      type: Schema.Types.Mixed,
      default: {},
    },
    fraudScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    estimatedOverchargeMin: {
      type: Number,
      default: 0,
    },
    estimatedOverchargeMax: {
      type: Number,
      default: 0,
    },
    analysisExplanation: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default models.Bill || model<IBill>('Bill', BillSchema);
