import express from 'express'
import { login, register, forgotPassword} from '../Controllers/StudentAuthController.js'

const StudentAuthRouter = express.Router()
// login and Register
StudentAuthRouter.post('/login', login)
StudentAuthRouter.put('/register', register)

// forgot password
StudentAuthRouter.post('/forgotPassword', forgotPassword)

export default StudentAuthRouter