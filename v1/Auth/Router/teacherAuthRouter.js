import express from 'express'
import { register, getMe } from '../Controllers/teacherAuthController.js'
import { jwtMiddleWare } from '../utils/jwtMiddleWare.js'
import { storeToken } from '../Controllers/teacherAuthController.js'
const teacherAuthRouter = express.Router()

// Register 
teacherAuthRouter.put('/register', register)

// Store JWT token in cookie
teacherAuthRouter.post('/storeToken', storeToken)

//Get user with JWT token
teacherAuthRouter.post('/me',jwtMiddleWare, getMe)

export default teacherAuthRouter