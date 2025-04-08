import { model, Schema } from 'mongoose'

const NotificationSchema = new Schema(
  {
    userId: { type: String },
    userName: { type: String },
    notificationType: { type: String },
    createdAt: { type: String },
    count: { type: Number, default: 0 }
  },
  {
    timestamps: false
  }
)

const StudentSchema = new Schema(
  {
    grade: { type: String, required: true },
    school: { type: String, required: true },
    age: { type: String },
    gender: { type: String },
    assignments: { type: [String] },
    messages: { type: [String] },
    notifications: { type: [NotificationSchema] }
  }
)

export const Students = model('Students', StudentSchema)
