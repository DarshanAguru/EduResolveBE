import express from 'express'
import { register, getMe} from '../Controllers/globalAdminAuthController.js'
import { jwtMiddleWare } from '../utils/jwtMiddleWare.js'

const globalAdminAuthRouter = express.Router()
// Register
globalAdminAuthRouter.put('/register', register)

// Get user with JWT token
globalAdminAuthRouter.post('/me', jwtMiddleWare, getMe)

export default globalAdminAuthRouter