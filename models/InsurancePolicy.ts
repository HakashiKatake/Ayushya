import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IInsurancePolicy extends Document {
  patientId: mongoose.Types.ObjectId;
  insurerName: string;
  policyNumber: string;
  sumInsured: number;
  fileUrl?: string;
  parsedRules: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const InsurancePolicySchema = new Schema<IInsurancePolicy>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    insurerName: {
      type: String,
      required: true,
    },
    policyNumber: {
      type: String,
      required: true,
    },
    sumInsured: {
      type: Number,
      required: true,
    },
    fileUrl: String,
    parsedRules: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default models.InsurancePolicy || model<IInsurancePolicy>('InsurancePolicy', InsurancePolicySchema);
