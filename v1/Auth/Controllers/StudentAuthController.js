import { Students } from '../Database/Students.js'
import logger from '../utils/logger.js'
import { Users } from '../DataBase/Users.js';


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

export const getMe = async (req, res) => {
    try{
      const id = req.user?.cognitoSub;
      const user = await Users.findOne({cognitoSub: id}).populate('profileRef');
      if(!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      const dataToSend = {
        ...user._doc,
        profileRef: {...user.profileRef._doc, notifications: undefined, assignments: undefined, messages: undefined },
        created_at: undefined,
        updated_at: undefined,
        __v: undefined,
      };
      res.status(200).send(dataToSend);
    }
    catch(err)
    {
      logger.error("Error in getting user:", err);
      res.status(500).send({ message: 'Internal Server Error' });
    }
}

export const register = async (req, res) => {
  try {
    const { name, phoneNumber, emailId, grade, school, birthdate, gender, cognitoSub } = req.body;

    const newStudent = new Students({
      grade,
      school,
      birthdate,
      gender
    });
    
    await newStudent.save();

    const user = new Users({
      cognitoSub,
      phoneNumber,
      name,
      emailId,
      role: "student",
      profileRef: newStudent._id,
    });

    await user.save();
    res.status(201).send({ message: 'Registration completed' });
  } catch (err) {
    logger.error("Error in registration:", err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
