import jwt from 'jsonwebtoken'
import { VerificationTag } from '../Database/VerificationTag.js'
import { checkACL } from './acl.js'

export async function verifyToken (req, res, next) {
  try {
    const token = req.headers['authorization'] // get the token from headers
    token = token && token.startsWith('Bearer ') ? token.split(' ')[1] : null // check if the token is in Bearer format
    const userIdReq = req.body.id
    if (!userIdReq) {
      return res.status(400).send({ message: 'Bad Request' }) // if no userId in request body
    }

    if (token === null) {
      return res.status(403).send({ message: 'Forbidden' }) // if no cookies
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY, { algorithms: ['HS256'] }) // verify and decode token

    const { userId } = decoded
    if (userId !== userIdReq) {
      return res.status(403).send({ message: 'Forbidden' })
    }
    const data = await VerificationTag.findOne({ userId }) // find if the userid is in verificationTag schema
    if (!data) {
      return res.status(403).send({ message: 'Forbidden' }) // forbidden access
    }

    if (data.token !== token) {
      return res.status(403).send({ message: 'Forbidden' }) // Forbidden access -- possible man in middle attack
    }
  
    const requestedURL = req.originalUrl // get the requested URL
    const requestedMethod = req.method // get the requested method
    if (checkACL(data.userType, requestedURL, requestedMethod) === false) {
      return res.status(403).send({ message: 'Forbidden' }) // forbidden access
    }
    next()
  } catch (err) {
    console.error(err)
    return res.status(401).send({ message: 'Not Authorized' }) // some Error -- Not disclosing the type of error
  }
}
