import express from 'express'
import { register, getMe} from '../Controllers/localAdminAuthController.js'
import { jwtMiddleWare } from '../utils/jwtMiddleWare.js'

const localAdminAuthRouter = express.Router()
// Register
localAdminAuthRouter.put('/register', register)

// Get user with JWT token
localAdminAuthRouter.post('/me', jwtMiddleWare, getMe)

export default localAdminAuthRouter