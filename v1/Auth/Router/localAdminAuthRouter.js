import express from 'express'
import { login, register, forgotPassword} from '../Controllers/localAdminAuthController.js'

const localAdminAuthRouter = express.Router()
// login and Register
localAdminAuthRouter.post('/login', login)
localAdminAuthRouter.put('/register', register)

// forgot password
localAdminAuthRouter.post('/forgotPassword', forgotPassword)

export default localAdminAuthRouter