import User from "../models/User.js";
import School from "../models/School.js";
import { StatusCodes } from "http-status-codes";
const getAllUsers = async (req, res) => {
  try {
    const userData = await User.find();


    // Parallelize school fetching per user
    const userWithSchoolsPromises = userData.map(async (user) => {
      const { _id, name, email, role, code } = user;

      // Get all schools for this user
      const schools = await School.find({ teacher: _id });

      // Prepare user details for each school
      return schools.map((school) => ({
        id: _id,
        name,
        email,
        role,
        code,
        school: school.school,
        country:
        !school.country || school.country.toLowerCase() === "country"
          ? "United States"
          : school.country,
        state: school.state,
        county: school.county,
        city: school.city,
        district: school.district,}));
      
      
    });

    // Wait for all school fetching to complete
    const userSchoolsArray = await Promise.all(userWithSchoolsPromises);
    

    // Flatten the nested arrays into one array
    const users = userSchoolsArray.flat();


    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Server error" });
  }
};


export { getAllUsers };
