import {BadRequestError} from "../errors/index.js";
import User from "../models/User.js";
import School from "../models/School.js";
import attachCookie from "../utils/attachCookie.js";
import {StatusCodes} from "http-status-codes";

const createLocation = async(req,res) =>{
  const { multiplePeriods, state, county, city, district, school } = req.body;
  if (!state) {
    throw new BadRequestError('State is required');
  }

  const user = await User.findOne({ _id: req.user.userId });
  const userLocations = await School.find({ teacher: user._id, multiplePeriods, state, county, city, district, school});
  let location;
  console.log(userLocations)
  if (userLocations.length===0){
    console.log('hi')
  location = await School.create({ teacher: user._id, multiplePeriods, state, county, city, district, school })
  }
  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.CREATED).json({ user, location });
}

const getUserLocations = async(req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userLocations = await School.find({ teacher: user._id });

  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user, userLocations });
}

const getLocations = async(req, res) =>{
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

export { createLocation, getUserLocations, getLocations }