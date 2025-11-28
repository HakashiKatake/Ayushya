import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface IPatientSummarySnapshot extends Document {
  caseId: mongoose.Types.ObjectId;
  summaryJson: Record<string, any>;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSummarySnapshotSchema = new Schema<IPatientSummarySnapshot>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
    },
    summaryJson: {
      type: Schema.Types.Mixed,
      required: true,
    },
    pdfUrl: String,
  },
  {
    timestamps: true,
  }
);

export default models.PatientSummarySnapshot || model<IPatientSummarySnapshot>('PatientSummarySnapshot', PatientSummarySnapshotSchema);
