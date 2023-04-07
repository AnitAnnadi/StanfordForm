import {BadRequestError} from "../errors/index.js";
import User from "../models/User.js";
import School from "../models/School.js";
import attachCookie from "../utils/attachCookie.js";
import {StatusCodes} from "http-status-codes";

const createLocation = async(req,res) =>{
  const { multiplePeriods, state, county, city, district, school } = req.body;
  if ( typeof multiplePeriods == 'undefined' || !state || !county || !city || !district || !school) {
    throw new BadRequestError('Please provide all values');
  }

  const user = await User.findOne({ _id: req.user.userId });

  const location = await School.create({ teacher: user._id, multiplePeriods, state, county, city, district, school })

  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.CREATED).json({ user, location });
}

const getLocations = async(req,res) =>{
  const user = await User.findOne({ _id: req.user.userId });
  const locations = await School.find({ teacher: user._id });

  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user, locations });
}

export { createLocation, getLocations }