import User from '../models/User.js';
import School from "../models/School.js";
import StudentResponse from '../models/StudentResponse.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';
import attachCookie from '../utils/attachCookie.js';
import { v4 as uuid } from 'uuid';
import Question from '../models/Question.js';


const enterCode=async(req,res)=>{
  const {code} = req.body
  if (code==null){
    throw new BadRequestError('Please Enter a Code');
  }
  const user = await User.findOne({ code });
  let teacher=user["_id"]
  const schools=await School.find({teacher})
  if (user){
    res.status(StatusCodes.OK).json({ user,schools });
  }
  else{
    throw new BadRequestError('Invalid Code. Try Again or Ask Teacher for Code');
  }
}

const register = async (req, res) => {
  const { name, email, password, role} = req.body;
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
  const { email, password } = req.body;
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

  // console.log(hasLocation)
  // console.log({userLocations})

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
  const {names,answer,code,grade,when,type,school,period}=req.body;
  if (answer.length<names.length){
    throw new BadRequestError('Please answer all questions');
  }

  const teacher = await User.findOne({ code });

  if (!teacher){
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
  
  for (var i=0;i<names.length;i++){
    const question=await Question.create({StudentResponse:_id,Question:names[i],Answer:answer[i]})
  }
  
   
}
export { register, login, updateUser, getCurrentUser, logout , enterCode, submitForm };
