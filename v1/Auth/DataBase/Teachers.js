import { model, Schema } from 'mongoose'

const NotificationSchema = new Schema({
  userId: { type: String },
  userName: { type: String },
  notificationType: { type: String },
  createdAt: { type: String },
  count: { type: Number, default: 0 }
},
{
  timestamps: false
})

const TeachersSchema = new Schema({
  subjectExpertise: { type: [String], required: true },
  institution: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  verificationStatus: { type: String, default: 'pending' },
  qualification: { type: String },
  assignments: { type: [String] },
  messages: { type: [String] },
  notifications: { type: [NotificationSchema] }
});

export const Teachers = model('Teachers', TeachersSchema)
