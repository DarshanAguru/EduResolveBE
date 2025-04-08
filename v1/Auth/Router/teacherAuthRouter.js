import express from 'express'
import { register, getMe } from '../Controllers/teacherAuthController.js'
import { jwtMiddleWare } from '../utils/jwtMiddleWare.js'
const teacherAuthRouter = express.Router()

// Register 
teacherAuthRouter.put('/register', register)

//Get user with JWT token
teacherAuthRouter.post('/me',jwtMiddleWare, getMe)

export default teacherAuthRouter