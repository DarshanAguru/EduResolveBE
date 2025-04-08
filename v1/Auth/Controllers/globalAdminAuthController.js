import { GlobalAdmins } from '../DataBase/GlobalAdmins.js'
import logger from '../utils/logger.js'
import { Users } from '../DataBase/Users.js'


export const getMe = async (req, res) => {
  try {
    const id = req.user?.cognitoSub // getting the user id from the token
    const user = await Users.findOne({cognitoSub: id}).populate('profileRef');
    if(!user) {
      return res.status(404).send({ message: 'User not found' });
      }

    const dataToSend = {
      ...user._doc,
      created_at: undefined,
      updated_at: undefined,
      __v: undefined,
    };
    res.status(200).send(dataToSend);
  } catch (err) {
    logger.error("Error in getting user:", err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}

export const register = async (req, res) => {
 const { phoneNumber, name, emailId, age, gender, cognitoSub } = req.body
 
   try {
     const newGlobalAdmin = new GlobalAdmins({
       age,
       gender,
     })
 
     await newGlobalAdmin.save()
 

    const user = new Users({
      cognitoSub,
      phoneNumber,
      name,
      emailId,
      role: "globalAdmin",
      profileRef: newGlobalAdmin._id,
    })
    await user.save();
    res.status(201).send({ message: 'Registered' })
  } catch (err) {
    logger.error('Error in registration:', err);
    res.status(500).send({ message: 'Internal Server Error' }) // Internal Server Error
  }
}

