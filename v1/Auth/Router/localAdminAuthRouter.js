import express from 'express'
import { register, getMe} from '../Controllers/localAdminAuthController.js'
import { jwtMiddleWare } from '../utils/jwtMiddleWare.js'
import { storeToken } from '../Controllers/localAdminAuthController.js'

const localAdminAuthRouter = express.Router()
// Register
localAdminAuthRouter.put('/register', register)

// Store JWT token in cookie
localAdminAuthRouter.post('/storeToken', storeToken)

// Get user with JWT token
localAdminAuthRouter.post('/me', jwtMiddleWare, getMe)

export default localAdminAuthRouter