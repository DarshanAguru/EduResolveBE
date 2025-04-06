import { LocalAdmins } from '../DataBase/LocalAdmin.js'
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
    const localAdmin = await LocalAdmins.findOne({ phoneNumber }) // getting the localAdmin details
    if (!localAdmin) {
        logger.info('Admin not found:', phoneNumber);
      return res.status(404).send({ message: 'Admin Not Found' }) // localAdmin not found
    }

    // if incorrect credentials
    if (!localAdmin.password || localAdmin.password.trim() === '') {
      return res.status(401).send({ message: 'Not authorized' })
    }

    if (!( await verifyPass(password, localAdmin.password))) { 
      return res.status(401).send({ message: 'Not authorized' })
    }

    const expTime = 60 * 60 * 24 // expiration time in seconds (1 day)

    // jwt token generation
    const token = jwt.sign(
      { userType: 'LocalAdmins', userId: localAdmin._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: expTime,
        algorithm: 'HS256'
      }
    )

    res.setHeader('Authorization', 'Bearer '+ token) // setting the token in the header

    const tag = await VerificationTag.findOneAndUpdate(
      { userId: localAdmin._id },
      {
        userType: 'LocalAdmins',
        token
      },
      { upsert: true, new: true }
    )

    if (!tag) {
      throw new Error('Failed to create verification tag');
    }

    const dataToSend = {
      ...localAdmin._doc,
      password: undefined,
      created_at: undefined,
      updated_at: undefined,
      __v: undefined,
    }

    logger.info('verified localAdmin and verification tag created');
    res.status(200).send(dataToSend) // retuning localAdmin details
  } catch (err) {
    logger.error('Error in login:', err);
    res.status(500).send({ message: 'Internal Server Error' }) // Not authorized
  }
}

export const register = async (req, res) => {
  const { phoneNumber, name, emailId, institution, password, age, gender, description, designation } = req.body
   const hashedPassword = await hashPassword(password)
 
   try {
     const newLocalAdmin = new LocalAdmins({
       phoneNumber,
       name,
       emailId,
       age,
       gender,
       password: hashedPassword,
       description,
       designation,
       institution
     })
 
     await newLocalAdmin.save();
     logger.info('New localAdmin registered:', phoneNumber);  
    res.status(201).send({ message: 'Registered' })
  } catch (err) {
    logger.error('Error in registration:', err);
    res.status(500).send({ message: 'Internal Server Error' }) // Internal Server Error
  }
}


export const forgotPassword = async (req, res) => {
  const query = req.body.query
  const email = req.body.email
  const phoneNo = req.body.phoneNo
  const type = 'localAdmin'
  try {
    let data
    if (query === 'generateOTP') {
        data = await LocalAdmins.findOne({ phoneNumber: phoneNo, emailId: email })
    

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
      logger.info('OTP sent successfully');
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

      data = await LocalAdmins.findOneAndUpdate({ _id: userId }, { password: hashedPassword })
      

      if (!data || data === null) {
        return res.status(404).send({ message: 'Data Not Found' })
      }
      logger.info('Password reset successfully for user:', data._id);

      return res.status(200).send({ message: 'verified And Reset' })
    } else {
      logger.error('Invalid query parameter:', query);
      return res.status(500).send({ message: 'Internal Server Error' })
    }
  } catch (e) {
    logger.error('Error in forgot password:', e);
    return res.status(500).send({ message: 'Internal Server Error' })
  }
}
