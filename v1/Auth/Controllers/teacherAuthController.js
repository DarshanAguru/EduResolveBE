import { Teachers } from '../../../../server/Database/Teachers.js'
import { Users } from '../DataBase/Users.js'
import logger from '../utils/logger.js'


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
  const { phoneNumber, name, emailId, institution, age, gender, qualification, subjectExpertise , cognitoSub} = req.body

    try {
      const newTeacher = new Teachers({
        age,
        gender,
        institution,
        qualification,
        subjectExpertise
      })
  
      await newTeacher.save();

      const user = new Users({
        cognitoSub,
        phoneNumber,
        name,
        emailId,
        role: "teacher",
        profileRef: newTeacher._id,
      });
      await user.save();
    res.status(201).send({ message: 'Registered Successfully' })
  } catch (err) {
    logger.error('Error in registration:', err);
    res.status(500).send({ message: 'Internal Server Error' }) // Internal Server Error
  }
}

