import mongoose, { Schema, model, models, Document } from 'mongoose';

export type EventType =
  | 'TEST_ORDERED'
  | 'TEST_RESULT'
  | 'DOCTOR_VISIT'
  | 'MEDICATION_GIVEN'
  | 'ROOM_CHANGE'
  | 'ICU_ADMISSION'
  | 'ICU_DISCHARGE'
  | 'BILL_ITEM_ADDED'
  | 'INSURANCE_ACTION'
  | 'NOTE';

export type EventSource = 'USER' | 'SYSTEM' | 'SIMULATOR';

export interface IEvent extends Document {
  caseId: mongoose.Types.ObjectId;
  timestamp: Date;
  type: EventType;
  source: EventSource;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'TEST_ORDERED',
        'TEST_RESULT',
        'DOCTOR_VISIT',
        'MEDICATION_GIVEN',
        'ROOM_CHANGE',
        'ICU_ADMISSION',
        'ICU_DISCHARGE',
        'BILL_ITEM_ADDED',
        'INSURANCE_ACTION',
        'NOTE',
      ],
      required: true,
    },
    source: {
      type: String,
      enum: ['USER', 'SYSTEM', 'SIMULATOR'],
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.index({ caseId: 1, timestamp: 1 });

export default models.Event || model<IEvent>('Event', EventSchema);
