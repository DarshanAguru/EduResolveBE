import { model, Schema } from 'mongoose'

const GlobalAdminsSchema = new Schema({
  birthdate: { type: String },
  gender: { type: String },
})

export const GlobalAdmins = model('GlobalAdmins', GlobalAdminsSchema)
