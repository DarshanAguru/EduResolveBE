import { Students } from '../Database/Students.js'
import { VerificationTag } from '../Database/VerificationTag.js'
import jwt from 'jsonwebtoken'
import { hashPassword, verifyPass } from '../utils/verifyPass.js'
import dotenv from 'dotenv'
import logger from '../utils/logger.js'
import { ForgotPassword } from '../DataBase/ForgotPassword.js'
import { generate } from 'otp-generator'
import nodemailer from 'nodemailer'

dotenv.config()

export const login = async (req, res) => {
  const { phoneNumber, password } = req.body // taking post parameters from request
  try {
    const student = await Students.findOne({ phoneNumber }) // getting the student details
    if (!student) {
      logger.info('Student not found:', phoneNumber);
      return res.status(404).send({ message: 'Student Not Found' }) // student not found
    }

    // if incorrect credentials
    if (!student.password || student.password.trim() === '') {
      return res.status(401).send({ message: 'Not authorized' })
    }

    if (!( await verifyPass(password, student.password))) { 
      return res.status(401).send({ message: 'Not authorized' })
    }

    const expTime = 60 * 60 * 24 // expiration time in seconds (1 day)

    // jwt token generation
    const token = jwt.sign(
      { userType: 'Students', userId: student._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: expTime,
        algorithm: 'HS256'
      }
    )

    res.setHeader('Authorization', 'Bearer '+ token) // setting the token in the header

    const tag = await VerificationTag.findOneAndUpdate(
      { userId: student._id },
      {
        userType: 'Students',
        token
      },
      { upsert: true, new: true }
    )

    if (!tag) {
      throw new Error('Failed to create verification tag');
    }

    const dataToSend = {
      ...student._doc,
      password: undefined,
      messages: undefined,
      created_at: undefined,
      updated_at: undefined,
      __v: undefined,
    }

    logger.info('verified student and verification tag created');
    res.status(200).send(dataToSend) // retuning student details
  } catch (err) {
    logger.error('Error in login:', err);
    res.status(500).send({ message: 'Internal Server Error' }) // Not authorized
  }
}

export const register = async (req, res) => {
  const { phoneNumber, name, emailId, grade, school, age, gender, password } =
    req.body
  const hashedPassword =  await hashPassword(password)

  try {
    const newStudent = new Students({
      phoneNumber,
      name,
      emailId,
      grade,
      age,
      gender,
      school,
      password: hashedPassword
    })

    await newStudent.save()
    res.status(201).send({ message: 'Registered' })
  } catch (err) {
    res.status(500).send({ message: 'Internal Server Error' }) // Internal Server Error
  }
}


export const forgotPassword = async (req, res) => {
  const query = req.body.query
  const email = req.body.email
  const phoneNo = req.body.phoneNo
  const type = 'student'
  try {
    let data
    if (query === 'generateOTP') {
        data = await Students.findOne({ phoneNumber: phoneNo, emailId: email })
    

      if (!data || (data === null)) {
        return res.status(404).send({ message: 'Data Not Found' })
      }

      const otp = generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.APP_PASS
        }
      })

      const mailOptions = {
        from: process.env.USER_MAIL,
        to: email,
        subject: 'EDU RESOLVE password reset OTP!',
        text: `Dear User,\nYour OTP for the EDU RESOLVE account reset password is ${otp}.\nIt is valid for 3 minutes, please don't share.\nWarm Regards,\nEDU RESOLVE team.`
      }

      const response = await transporter.sendMail(mailOptions)
      if (!response) {
        return res.status(500).send({ message: 'Internal Server Error' })
      }

       

      const passwordData = await ForgotPassword.findOneAndUpdate({ userId: data._id }, { emailId: data.emailId, type, otp }, { upsert: true, new: true })

      if (!passwordData) {
        return res.status(500).send({ message: 'Internal Server Error' })
      }

      return res.status(200).send({ message: 'OTP sent', userId: data._id })
    } else if (query === 'verifyOTP&Reset') {
      const otp = req.body.otp
      const password = req.body.password
      const userId = req.body.userId
      const hashedPassword = await hashPassword(password)
      const passData = await ForgotPassword.findOne({ userId })
      if (!passData) {
        return res.status(404).send({ message: 'Not Found' })
      }
      if (otp !== passData.otp) {
        return res.status(401).send({ message: 'Invalid OTP' })
      }
      await ForgotPassword.deleteOne({ _id: passData._id })

      data = await Students.findOneAndUpdate({ _id: userId }, { password: hashedPassword })
      

      if (!data || data === null) {
        return res.status(404).send({ message: 'Data Not Found' })
      }

      return res.status(200).send({ message: 'verified And Reset' })
    } else {
      return res.status(500).send({ message: 'Internal Server Error' })
    }
  } catch (e) {
    return res.status(500).send({ message: 'Internal Server Error' })
  }
}
