import { model, Schema } from 'mongoose'

const MentorsSchema = new Schema({
  qualification: { type: String, required: true },
  subjectExpertise: { type: [String], required: true },
  resumeLink: { type: String, required: true },
  institution: { type: String },
  birthdate: { type: String },
  gender: { type: String },
  verificationStatus: { type: String, default: 'pending' },
  description: { type: String },
  messages: { type: [String] }
})

export const Mentors = model('Mentors', MentorsSchema)
