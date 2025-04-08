import express from 'express'
import { register, getMe} from '../Controllers/globalAdminAuthController.js'
import { jwtMiddleWare } from '../utils/jwtMiddleWare.js'
import { storeToken } from '../Controllers/globalAdminAuthController.js'

const globalAdminAuthRouter = express.Router()
// Register
globalAdminAuthRouter.put('/register', register)

// Store JWT token in cookie
globalAdminAuthRouter.post('/storeToken', storeToken)

// Get user with JWT token
globalAdminAuthRouter.post('/me', jwtMiddleWare, getMe)

export default globalAdminAuthRouter