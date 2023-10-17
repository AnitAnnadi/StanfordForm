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

  const upperSchool = school.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const upperDistrict = district ? district.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperCity = city.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const upperCounty = county.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const upperState = state.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
 
  const userId= (req.user.userId)
  const locationExists = await Location.findOne({ state: upperState, county: upperCounty, city: upperCity, district: upperDistrict, name: upperSchool });

  if (locationExists) {
    if (locationExists.approved ==false){
      return res.status(StatusCodes.OK).json({ location: locationExists, msg: "This location is already pending approval" });
    }
    else{
      return res.status(StatusCodes.OK).json({ location: locationExists, msg: "This location has already been approved. Select from the select location page." });
    }
  }

  const location = await Location.create({ multiplePeriods, state: upperState, county: upperCounty, city: upperCity, district: upperDistrict, name: upperSchool, approved:user.role=="Stanford Staff", requestedUser: userId })
  if (user.role==="Stanford Staff"){
  const newSchool = await School.create({ teacher: location.requestedUser, multiplePeriods:location.multiplePeriods, state:location.state, county:location.county, city:location.city, district:location.district, school:location.name})
  }
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
  }
  console.log(req.query.approved)
  if (req.query.approved=='false'){
    queryObject.approved=false
  }
  else{
    queryObject.approved=true
  }
  console.log(queryObject)

  Object.keys(queryObject).forEach(key => queryObject[key] === undefined && delete queryObject[key])

  const locations = await Location.find(queryObject);
  let users=[]
  for (const location of locations) {
    const foundUser = await User.findOne({ _id: location.requestedUser });
    users.push(foundUser);
  }
  res.status(StatusCodes.OK).json({ locations, users });
}


export { createLocation, getLocations,approveLocation,declineLocation };