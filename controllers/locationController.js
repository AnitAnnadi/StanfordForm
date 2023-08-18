import {BadRequestError} from "../errors/index.js";
import User from "../models/User.js";
import Location from "../models/Location.js";
import attachCookie from "../utils/attachCookie.js";
import {StatusCodes} from "http-status-codes";

const createLocation = async(req, res) =>{
  const { state, county, city, district, school } = req.body;
  if (!state || !county || !city || !school) {
    throw new BadRequestError('All fields but district are required');
  }

  const upperSchool = school.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const upperDistrict = district ? district.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperCity = city.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const upperCounty = county.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const upperState = state.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const locationExists = await Location.findOne({ state: upperState, county: upperCounty, city: upperCity, district: upperDistrict, name: upperSchool });

  if (locationExists) {
    throw new BadRequestError('Location already exists');
  }

  const location = await Location.create({ state: upperState, county: upperCounty, city: upperCity, district: upperDistrict, name: upperSchool })

  const user = await User.findOne({ _id: req.user.userId });
  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.CREATED).json({ location });
}

const getLocations = async(req, res) => {
  const { state, county, city, district, school } = req.query;

  console.log(req.query)

  const upperSchool = school ? school.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperDistrict = district ? district.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperCity = city ? city.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperCounty = county ? county.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperState = state ? state.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;

  const queryObject = {
    state: upperState,
    county: upperCounty,
    city: upperCity,
    district: upperDistrict,
    name: upperSchool,
  }

  Object.keys(queryObject).forEach(key => queryObject[key] === undefined && delete queryObject[key])

  const locations = await Location.find(queryObject);

  res.status(StatusCodes.OK).json({ locations });
}


export { createLocation, getLocations };