import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface ICase extends Document {
  patientId: mongoose.Types.ObjectId;
  hospitalName: string;
  location: string;
  admissionDatetime: Date;
  dischargeDatetime?: Date;
  chiefComplaint: string;
  status: 'ACTIVE' | 'DISCHARGED';
  createdAt: Date;
  updatedAt: Date;
}

const CaseSchema = new Schema<ICase>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hospitalName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    admissionDatetime: {
      type: Date,
      required: true,
    },
    dischargeDatetime: Date,
    chiefComplaint: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'DISCHARGED'],
      default: 'ACTIVE',
    },
  },
  {
    timestamps: true,
  }
);

export default models.Case || model<ICase>('Case', CaseSchema);
