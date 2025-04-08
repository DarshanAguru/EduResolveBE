import { model, Schema } from 'mongoose'

const LocalAdminsSchema = new Schema({
  designation: { type: String, required: true },
  institution: { type: String, required: true },
  birthdate: { type: String },
  gender: { type: String },
  verificationStatus: { type: String, default: 'pending' },
  description: { type: String }
})

export const LocalAdmins = model('LocalAdmins', LocalAdminsSchema)
