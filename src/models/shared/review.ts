import { Staff } from '@models/company-user';
import { User } from '@models/user';

import { mongoose } from '..';

const { Schema } = mongoose;

export type ReviewBase = {
  user: User;
  reply: Staff;
};

export const modificationSchema = {
  key: {
    type: String,
    required: true,
  },
  value: {
    type: Schema.Types.Mixed,
  },
  previousValue: {
    type: Schema.Types.Mixed,
  },
  valueChanged: Boolean,
  visible: {
    type: Boolean,
    default: true,
  },
  requiresValidation: Boolean,
  valid: Boolean,
  validatedBy: Schema.Types.ObjectId,
  author: Schema.Types.ObjectId,
  validatedAt: Date,
  automaticallyAccepted: Boolean,
  createdByAdmin: Boolean,
  additionalData: Schema.Types.Mixed,
  processed: Boolean,
};
