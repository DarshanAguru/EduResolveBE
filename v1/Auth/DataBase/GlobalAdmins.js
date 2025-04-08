import { model, Schema } from 'mongoose'

const GlobalAdminsSchema = new Schema({
  age: { type: Number },
  gender: { type: String },
})

export const GlobalAdmins = model('GlobalAdmins', GlobalAdminsSchema)
