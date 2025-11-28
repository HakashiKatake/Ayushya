import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IPatientProfile extends Document {
  userId: mongoose.Types.ObjectId;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  abhaId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PatientProfileSchema = new Schema<IPatientProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    age: Number,
    gender: String,
    bloodGroup: String,
    emergencyContact: String,
    abhaId: String,
  },
  {
    timestamps: true,
  }
);

export default models.PatientProfile || model<IPatientProfile>('PatientProfile', PatientProfileSchema);
