import User from '../models/User.js';
import School from "../models/School.js";
import StudentResponse from '../models/StudentResponse.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';
import attachCookie from '../utils/attachCookie.js';
import { v4 as uuid } from 'uuid';
import Question from '../models/Question.js';
import NoCode from '../models/NoCode.js';
import axios from 'axios';


const enterCode=async(req,res)=>{
  const {code} = req.body


  if (code==null){

    throw new BadRequestError('Please Enter a Code');
  }

  const user = await User.findOne({ code });
  // if (user)

  if (user){
    let teacher=user["_id"]
    const schools=await School.find({teacher})
    res.status(StatusCodes.OK).json({ user,schools });
  }
  else{
    throw new BadRequestError('Invalid Code. Try Again or Ask Teacher for Code');
  }
}

const register = async (req, res) => {
  const { currentUser,captcha} = req.body;
  const {name, email, password, role} = currentUser
  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.REACT_APP_SECRET_KEY}&response=${captcha}`
  );
  if (!response.data.success){
    throw new BadRequestError('Please complete the reCaptcha. ');
  }
  if (!name || !email || !password  ) {
    throw new BadRequestError('please provide all values');
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use');
  }
  const unique_id = uuid();
  const code = unique_id.slice(0,8)
  const user = await User.create({ name, email, password, role, code });

  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      name: user.name,
      role:user.role,
      password:user.password,
      code: user.code,
      _id: user._id
    }
  });
};
const login = async (req, res) => {
  const { currentUser,captcha} = req.body;
  const {name, email, password, role} = currentUser
  if (!email || !password) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError('Invalid Credentials');
  }
  const token = user.createJWT();
  attachCookie({ res, token });
  user.password = undefined;

  const userLocations = await School.find({ teacher: user._id });

  let hasLocation = userLocations.length > 0;


  res.status(StatusCodes.OK).json({ user,hasLocation, userLocations });
};
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name ) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;

  await user.save();

  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user });
};

const getCurrentUser = async (req, res) => {

};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const submitForm = async(req,res) =>{
  const {formData,code,grade,when,type,school,period,state, city, county, district, captcha}=req.body;
  const response = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.REACT_APP_SECRET_KEY}&response=${captcha}`
  );
  if (!response.data.success){
    throw new BadRequestError('Please complete the reCaptcha. ');
  }
  if (code) {
    console.log(code)
    const teacher = await User.findOne({ code });
    if (!teacher) {
      throw new BadRequestError('Invalid Code. Try Again or Ask Teacher for Code');
    }

    let StudentResponseData=''
    if (period!=="default"){
      StudentResponseData= await StudentResponse.create({formCode:code,teacher:teacher._id,grade:grade,when:when,formType:type,school:school,period:period})

    }
    if (period==="default"){

      StudentResponseData= await StudentResponse.create({formCode:code,teacher:teacher._id,grade:grade,when:when,formType:type,school:school})

    }

    let _id=(StudentResponseData["_id"])

    formData.forEach(async (item) => {
      const { question, answers } = item;

      for (const answer of answers) {
        await Question.create({ StudentResponse: _id, Question: question, Answer: answer });
      }
    });

    res.status(StatusCodes.OK).json({ msg: 'Form Sucessfully Completed. Redirecting...' });
  }

  else{
    let NoCodeData=''
    try{
    NoCodeData = await NoCode.create({grade: grade, when:when, formType:type, school:school, state:state, city:city, county:county, district:district })
    let _id=(NoCodeData["_id"])
    formData.forEach(async (item) => {
      const { question, answers } = item;

      for (const answer of answers) {
        await Question.create({ StudentResponse: _id, Question: question, Answer: answer });
      }

    })
    res.status(StatusCodes.OK).json({ msg: 'Form Sucessfully Completed. Redirecting...' })
  }
    catch(error){
      console.log(error)
    }
  }
}

const createCertificate =async(req,res)=>{
  const {name,info} = req.body
  console.log(req.body)
  try{
  await Certificates.create({name:name, formType:info["form"], teacherId:info["teacher_id"] })
  return res.status(StatusCodes.OK).json({ msg: 'Certificate Created' });

}
  catch(error){
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Certificate creation failed.' });
  }
}

const verifyToken = async (req, res) => {
  const {token} = req.body
  try {
    const reset = await ResetPassword.findOne({ token });


    if (reset) {
      console.log('Token verified');
      return res.status(StatusCodes.OK).json({ msg: 'verified' });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Your reset password link has expired.' });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Token verification failed' });
  }

};

const resetPassword = async(req,res) =>{
  try{
  console.log('hi')
  const {password,token} = req.body
  const reset = await ResetPassword.find({token})
  const userId = reset[0].userId
  const user = await User.findOne(userId)
  if (user){
    user.password = password
    await user.save();
    await reset[0].remove()
    return res.status(StatusCodes.OK).json({ msg: 'verified' });
  }}
  catch(error){
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: error });

  }
}

const forgotPassword=async(req,res)=>{
  const {email} = req.body
  console.log(email)


  if (email==null){

    throw new BadRequestError('Please Enter an email');
  }
  const user = await User.findOne({ email });
  console.log(user)
  if (user){
    const token = crypto.randomBytes(20).toString('hex');
    const userId = user._id
    const reset = await ResetPassword.create({userId, email,token})
    console.log(reset)
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // e.g., 'Gmail', 'SendGrid'
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    console.log(process.env.EMAIL,process.env.EMAIL_PASSWORD)
    const mailOptions = {
      from: process.env.EMAIL,
      to:email,
      subject:'Reset Data Dashboard Password',
      text:`To Reset your password access this link - https://datadashboard.stanfordreachlab.com/resetpassword/${token}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send('Email sent');
      }
    });

  }
  if (!user){
    console.log('hi')
    throw new BadRequestError('Invalid email');
  }
}

export { createCertificate, resetPassword, verifyToken, register, login, updateUser, forgotPassword, logout , enterCode, submitForm, getCurrentUser };
