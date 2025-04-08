import express from 'express'
import { register, getMe} from '../Controllers/mentorAuthController.js'
import { jwtMiddleWare } from '../utils/jwtMiddleWare.js'

const mentorAuthRouter = express.Router()
// Register
mentorAuthRouter.put('/register', register)

// Get user with JWT token
mentorAuthRouter.post('/me', jwtMiddleWare, getMe)

export default mentorAuthRouter