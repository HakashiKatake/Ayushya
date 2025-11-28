import mongoose, { Schema, model, models, Document } from 'mongoose';

export interface ISecondOpinionRequest extends Document {
  caseId: mongoose.Types.ObjectId;
  userQuestion: string;
  questionType: string;
  aiSummary: string;
  aiRecommendations: string[];
  status: 'PENDING' | 'COMPLETE';
  createdAt: Date;
  updatedAt: Date;
}

const SecondOpinionRequestSchema = new Schema<ISecondOpinionRequest>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
    },
    userQuestion: {
      type: String,
      required: true,
    },
    questionType: {
      type: String,
      required: true,
    },
    aiSummary: {
      type: String,
      default: '',
    },
    aiRecommendations: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETE'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

export default models.SecondOpinionRequest || model<ISecondOpinionRequest>('SecondOpinionRequest', SecondOpinionRequestSchema);
