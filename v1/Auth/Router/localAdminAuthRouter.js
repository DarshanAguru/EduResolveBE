import express from 'express'
import { login, register, forgotPassword, logout} from '../Controllers/localAdminAuthController.js'
import { verifyToken } from '../utils/jwtVerify.js'

const localAdminAuthRouter = express.Router()
// login and Register
localAdminAuthRouter.post('/login', login)
localAdminAuthRouter.put('/register', register)


// forgot password
localAdminAuthRouter.post('/forgotPassword', forgotPassword)

// logout with JWT token
localAdminAuthRouter.post('/logout/:id', verifyToken, logout)

export default localAdminAuthRouter