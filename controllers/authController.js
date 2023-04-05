import User from '../models/User.js';
import StudentReponse from '../models/StudentReponse.js';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js';
import attachCookie from '../utils/attachCookie.js';
import { v4 as uuid } from 'uuid';
import Question from '../models/Question.js';


const enterCode=async(req,res)=>{
  const {code} = req.body
  if (code==''){
    throw new BadRequestError('Please Enter a Code');
  }
  console.log(code)
  const user = await User.findOne({ code });
  if (user){
    res.status(StatusCodes.OK).json({ user });
    console.log('hi')
  }
  else{
    throw new BadRequestError('Inavalid Code. Try Again or Ask Teacher for Code');
  }
}

const register = async (req, res) => {
  const { name, email, password, role, state, county, city, district, school } = req.body;
  console.log(name)
  if (!name || !email || !password  ) {
    throw new BadRequestError('please provide all values');
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError('Email already in use');
  }
  const unique_id = uuid();
  const code = unique_id.slice(0,8) 
  const user = await User.create({ name, email, password, role, state, county, city, district, school, code });

  const token = user.createJWT();
  attachCookie({ res, token });
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      state: user.state,
      county: user.county,
      city: user.city,
      district: user.district,
      school: user.school,
      name: user.name,
      role:user.role,
      password:user.password,
      code: user.code
    },

    state: user.state,
  });
};
const login = async (req, res) => {
  console.log(req.body)
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

  res.status(StatusCodes.OK).json({ user, state:user.state });
};
const updateUser = async (req, res) => {
  const { email, name, state, county, city, district, school } = req.body;
  if (!email || !name || !state || !county || !city || !district || !school) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.state = state;
  user.county = county;
  user.city = city;
  user.district = district;
  user.school = school;

  await user.save();

  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user, state: user.location });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  res.status(StatusCodes.OK).json({ user, location: user.location });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const createLocation = async(req,res) =>{
  const { state, county, city, district, school } = req.body;
  if ( !state || !county || !city || !district || !school) {
    throw new BadRequestError('Please provide all values');
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.state = state;
  user.county = county;
  user.city = city;
  user.district = district;
  user.school = school;

  await user.save();

  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user, state: user.location });
}

const submitForm = async(req,res) =>{
  const {names,answer,code,grade,when}=req.body;
  console.log(code,grade,when)
  if (answer.length<names.length){
    console.log('hi')
    throw new BadRequestError('Please answer all questions');
  }
  const StudentResponseData= await StudentReponse.create({formCode:code,grade:grade,When:when})
  let _id=(StudentResponseData["_id"])
  
  for (var i=0;i<names.length;i++){
    console.log(_id,names[i],answer[i])
    const question=await Question.create({StudentResponse:_id,Question:names[i],Answer:answer[i]})
  }
  
   
}
export { register, login, updateUser, getCurrentUser, logout, createLocation,enterCode,submitForm };
