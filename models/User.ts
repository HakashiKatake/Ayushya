import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId: string;
  email: string;
  name: string;
  role: 'PATIENT' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['PATIENT', 'ADMIN'],
      default: 'PATIENT',
    },
  },
  {
    timestamps: true,
  }
);

export default models.User || model<IUser>('User', UserSchema);
