import express from 'express'
import { register,  getMe} from '../Controllers/studentAuthController.js'
import { jwtMiddleWare } from '../utils/jwtMiddleWare.js'
import { storeToken } from '../Controllers/studentAuthController.js'

const studentAuthRouter = express.Router()
// Register
studentAuthRouter.put('/register', register)

// Store JWT token in cookie
studentAuthRouter.post('/storeToken', storeToken)

// Get user with JWT token
studentAuthRouter.post('/me', jwtMiddleWare, getMe)

export default studentAuthRouter