import {BadRequestError} from "../errors/index.js";
import User from "../models/User.js";
import Location from "../models/Location.js";
import attachCookie from "../utils/attachCookie.js";
import {StatusCodes} from "http-status-codes";
import School from "../models/School.js";

const createLocation = async(req, res) =>{
  try{
  const { multiplePeriods, state, country, county, city, district, school } = req.body;
  if (!country || !state || !school) {
    throw new BadRequestError('All fields but district, county, amd city are required');
  }

  const user = await User.findOne({ _id: req.user.userId });

  const upperSchool = school ? school.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperDistrict = district ? district.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperCity = city ? city.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperCounty = county ? county.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperState = state ? state.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperCountry = country ? country.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
 
  const userId= (req.user.userId)
  const locationExists = await Location.findOne({ country: upperCountry, state: upperState, county: upperCounty, city: upperCity, district: upperDistrict, name: upperSchool });

  if (locationExists) {
    // return existing location
    return res.status(StatusCodes.OK).json({ location: locationExists });
  }

  const location = await Location.create({ multiplePeriods, country: upperCountry, state: upperState, county: upperCounty, city: upperCity, district: upperDistrict, name: upperSchool, approved:user.role=="Stanford Staff", requestedUser: userId })
  if (user.role==="Stanford Staff"){
  const newSchool = await School.create({ teacher: location.requestedUser, multiplePeriods:location.multiplePeriods, country:location.country, state:location.state, county:location.county, city:location.city, district:location.district, school:location.name})
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
  const { country, state, county, city, district, school, approved } = req.query;
  const upperCountry = country ? country.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperSchool = school ? school.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperDistrict = district ? district.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperCity = city ? city.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperCounty = county ? county.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;
  const upperState = state ? state.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : undefined;

  const queryObject = {
    country: upperCountry,
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