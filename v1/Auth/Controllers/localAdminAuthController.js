import { LocalAdmins } from '../DataBase/LocalAdmins.js'
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
  const { phoneNumber, name, emailId, institution, age, gender, description, designation, cognitoSub } = req.body
   try {
     const newLocalAdmin = new LocalAdmins({
       age,
       gender,
       description,
       designation,
       institution
     })
 
     await newLocalAdmin.save();

    const user = new Users({
      cognitoSub,
      phoneNumber,
      name,
      emailId,
      role: "localAdmin",
      profileRef: newLocalAdmin._id,
    })
    await user.save();
    res.status(201).send({ message: 'Registered' })
  } catch (err) {
    logger.error('Error in registration:', err);
    res.status(500).send({ message: 'Internal Server Error' }) // Internal Server Error
  }
}


export const storeToken = async (req, res) =>{
  try{
    const { token } = req.body;

    res.cookie('authToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    }
    );
    res.status(200).send({ message: 'Token stored successfully' });
  }
  catch(err){
    logger.error("Error in storing token:", err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}