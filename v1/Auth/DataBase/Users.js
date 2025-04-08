import { model, Schema } from 'mongoose'


const UserSchema = new Schema(
  {
    cognitoSub: { type: String, required: true, unique: true , index : true},
    phoneNumber: { type: String, required: true, unique: true},
    name: { type: String, required: true },
    emailId: { type: String },
    role : { type: String, enum: ['student', 'teacher', 'localAdmin', 'mentor', 'globalAdmin'], required: true },
    profileRef : {type: Schema.Types.ObjectId, refPath: 'role'}
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
)

export const Users = model('Users', UserSchema)
