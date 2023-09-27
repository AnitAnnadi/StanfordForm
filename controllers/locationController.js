import {BadRequestError} from "../errors/index.js";
import User from "../models/User.js";
import Location from "../models/Location.js";
import attachCookie from "../utils/attachCookie.js";
import {StatusCodes} from "http-status-codes";
import School from "../models/School.js";

const createLocation = async(req, res) =>{
  try{
  const { multiplePeriods, state, county, city, district, school } = req.body;
  if (!state || !county || !city || !school) {
    throw new BadRequestError('All fields but district are required');
  }

  const user = await User.findOne({ _id: req.user.userId });
  // if (user.role !== 'Site Admin' && user.role !== 'Standford Staff' && user.role !== 'Teacher') {
  //   throw new BadRequestError('You do not have permission to create a location');
  // }

  const upperSchool = school.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const upperDistrict = district ? district.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperCity = city.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const upperCounty = county.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const upperState = state.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
 
  const userId= (req.user.userId)
  console.log(userId)
  const locationExists = await Location.findOne({ state: upperState, county: upperCounty, city: upperCity, district: upperDistrict, name: upperSchool });

  if (locationExists) {
    // return existing location
    return res.status(StatusCodes.OK).json({ location: locationExists });
  }

  const location = await Location.create({ multiplePeriods, state: upperState, county: upperCounty, city: upperCity, district: upperDistrict, name: upperSchool, approved:false, requestedUser: userId })

  const token = user.createJWT();
  attachCookie({ res, token });

  return res.status(StatusCodes.CREATED).json({ location });}
  catch(error){
    console.log(error)
  }
}

const approveLocation = async(req,res) =>{
  try{
  const {_id} = req.body
  const location = await Location.findOne({_id });
  console.log(_id)
  location.approved = true;
  const school = await School.create({ teacher: location.requestedUser, multiplePeriods:location.multiplePeriods, state:location.state, county:location.county, city:location.city, district:location.district, school:location.name})
  console.log(school)
  await location.save();
  return res.status(StatusCodes.CREATED).json({ school });
  }
  catch(error){
    console.log(error)
  }

}

const declineLocation = async(req,res) =>{
  try{
    const {_id} = req.body
    const location = await Location.findOne({_id });
    await location.remove();
    return res.status(200).send('The location has been removed ');    }
    catch(error){
      console.log(error)
    }

}
const getLocations = async(req, res) => {
  const { state, county, city, district, school, approved } = req.query;
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
    approved:false
  }

  Object.keys(queryObject).forEach(key => queryObject[key] === undefined && delete queryObject[key])

  const locations = await Location.find(queryObject);
  let users=[]
  for (const location of locations) {
    console.log(location.requestedUser)
    const foundUser = await User.findOne({ _id: location.requestedUser });
    users.push(foundUser);
  }
  console.log(users)
  res.status(StatusCodes.OK).json({ locations, users });
}


export { createLocation, getLocations,approveLocation,declineLocation };