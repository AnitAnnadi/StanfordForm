import {BadRequestError} from "../errors/index.js";
import User from "../models/User.js";
import School from "../models/School.js";
import attachCookie from "../utils/attachCookie.js";
import {StatusCodes} from "http-status-codes";

const createSchool = async(req, res) =>{
  const { multiplePeriods, state, county, city, district, school } = req.body;
  try{
  if (!state) {
    throw new BadRequestError('State is required');
  }

  const user = await User.findOne({ _id: req.user.userId });
  // ignore case
  const userLocations = await School.find({ teacher: user._id, state, county, city, district, school})
  let location;
  let exists = false;
  if (userLocations.length===0){
  location = await School.create({ teacher: user._id, multiplePeriods, state, county, city, district, school })
  const token = user.createJWT();
  attachCookie({ res, token });
  }
  else{
    exists = true
  }
  res.status(StatusCodes.CREATED).json({ user, location, exists });
}
catch(error){
  console.log(error)
}
  

  
}

const getUserSchools = async(req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userLocations = await School.find({ teacher: user._id });

  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user, userLocations });
}

const getSchools = async(req, res) =>{
  const user = await User.findOne({ _id: req.user.userId });

  const token = user.createJWT();
  attachCookie({ res, token });

  const {
    searchState,
    searchCounty,
    searchCity,
    searchDistrict,
    searchSchool,
    searchTeacher,
  } = req.query;

  const queryObject = {};

  if (searchState && searchState !== 'all') {
    queryObject.state = searchState;
  }
  if (searchCounty && searchCounty !== 'all') {
    queryObject.county = searchCounty;
  }
  if (searchCity && searchCity !== 'all') {
    queryObject.city = searchCity;
  }
  if (searchDistrict && searchDistrict !== 'all') {
    queryObject.district = searchDistrict;
  }
  if (searchSchool && searchSchool !== 'all') {
    queryObject.school = searchSchool;
  }
  if (searchTeacher && searchTeacher !== 'all') {
    queryObject.teacher = searchTeacher;
  }

  const schools = await School.find(queryObject)

  res.status(StatusCodes.OK).json({ schools });
}

export { createSchool, getUserSchools, getSchools }