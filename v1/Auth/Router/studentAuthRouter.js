import express from 'express'
import { register,  getMe} from '../Controllers/studentAuthController.js'
import { jwtMiddleWare } from '../utils/jwtMiddleWare.js'

const studentAuthRouter = express.Router()
// Register
studentAuthRouter.put('/register', register)

// Get user with JWT token
studentAuthRouter.post('/me', jwtMiddleWare, getMe)

export default studentAuthRouter