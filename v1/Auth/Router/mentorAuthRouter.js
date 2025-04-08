import express from 'express'
import { register, getMe} from '../Controllers/mentorAuthController.js'
import { jwtMiddleWare } from '../utils/jwtMiddleWare.js'
import { storeToken } from '../Controllers/mentorAuthController.js'

const mentorAuthRouter = express.Router()
// Register
mentorAuthRouter.put('/register', register)

// Store JWT token in cookie
mentorAuthRouter.post('/storeToken', storeToken)

// Get user with JWT token
mentorAuthRouter.post('/me', jwtMiddleWare, getMe)

export default mentorAuthRouter