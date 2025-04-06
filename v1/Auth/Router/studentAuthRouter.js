import express from 'express'
import { login, register, forgotPassword, logout} from '../Controllers/studentAuthController.js'
import { verifyToken } from '../utils/jwtVerify.js'

const studentAuthRouter = express.Router()
// login and Register
studentAuthRouter.post('/login', login)
studentAuthRouter.put('/register', register)

// forgot password
studentAuthRouter.post('/forgotPassword', forgotPassword)

// logout with JWT token
studentAuthRouter.post('/logout/:id', verifyToken, logout)

export default studentAuthRouter