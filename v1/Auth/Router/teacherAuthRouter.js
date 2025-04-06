import express from 'express'
import { login, register, forgotPassword, logout } from '../Controllers/teacherAuthController.js'
import { verifyToken } from '../utils/jwtVerify.js'
const teacherAuthRouter = express.Router()
// login and Register
teacherAuthRouter.post('/login', login)
teacherAuthRouter.put('/register', register)

// forgot password
teacherAuthRouter.post('/forgotPassword', forgotPassword)

//logout with JWT token
teacherAuthRouter.post('/logout/:id',verifyToken, logout)

export default teacherAuthRouter