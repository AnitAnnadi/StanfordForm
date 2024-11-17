import {BadRequestError} from "../errors/index.js";
import User from "../models/User.js";
import School from "../models/School.js";
import attachCookie from "../utils/attachCookie.js";
import {StatusCodes} from "http-status-codes";
import Location from "../models/Location.js";

const createSchool = async(req, res) =>{
  let { multiplePeriods, state, county, city, district, school, requesterId } = req.body;
  try{
  if (!state) {
    throw new BadRequestError('State is required');
  }
  let user;
  if (requesterId){
    const loc = await Location.findOne({_id:requesterId})
    user = await User.findOne({ _id: loc.requestedUser });
    multiplePeriods = loc.multiplePeriods

  }
  else{
    user = await User.findOne({ _id: req.user.userId });
  }
  // ignore case
  const userLocations = await School.find({ teacher: user._id, state, county, city, district, school})
  let location;
  let exists = false;
  if (userLocations.length===0){
  location = await School.create({ teacher: user._id, multiplePeriods, state, county, city, district, school })
  if (requesterId){
    const location = await Location.findOne({_id:requesterId });
    await location.remove();
  }
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


const getUserSchools = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const userLocations = await School.find({ teacher: user._id });

  const token = user.createJWT();
  attachCookie({ res, token });

  res.status(StatusCodes.OK).json({ user, userLocations });
}

const getSchools = async (req, res) => {
  try {
    // Fetch user data
    const user = await User.findOne({ _id: req.user.userId });

    // Generate and attach JWT
    const token = user.createJWT();
    attachCookie({ res, token });

    // Destructure search query parameters
    const {
      searchState,
      searchCounty,
      searchCity,
      searchDistrict,
      searchSchool,
      searchTeacher,
    } = req.query;

    // console.log("Search District:", searchDistrict);

    // Create query object
    const queryObject = {};

    // Function to apply case-insensitive regex
    const applyCaseInsensitive = (value) => {
      return new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    };

    // Add conditions to queryObject based on the provided search criteria
    if (searchState && searchState !== 'all') {
      queryObject.state = applyCaseInsensitive(searchState);
    }
    if (searchCounty && searchCounty !== 'all') {
      queryObject.county = applyCaseInsensitive(searchCounty);
    }
    if (searchCity && searchCity !== 'all') {
      queryObject.city = applyCaseInsensitive(searchCity);
    }
    if (searchDistrict && searchDistrict !== 'all') {
      queryObject.district = applyCaseInsensitive(searchDistrict);
    }
    if (searchSchool && searchSchool !== 'all') {
      queryObject.school = applyCaseInsensitive(searchSchool);
    }
    if (searchTeacher && searchTeacher !== 'all') {
      queryObject.teacher = user._id; // Assuming user._id is the ObjectId
    }

    // console.log("Query Object:", queryObject);

    // Fetch schools from the database
    const schools = await School.find(queryObject);

    // console.log("Schools found:", schools);

    // Send the response
    res.status(StatusCodes.OK).json({ schools });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error fetching schools" });
  }
};



export { createSchool, getUserSchools, getSchools }