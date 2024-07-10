import User from "../models/User.js";
import School from "../models/School.js";
import { StatusCodes } from "http-status-codes";

const getAllUsers = async (req, res) => {
  try {
    const userData = await User.find();
    const users = [];

    for (const user of userData) {
      const { _id, name, email, role, code } = user;

      // Fetch school data for the current user
      const schools = await School.find({ teacher: _id });

      // Prepare an array of school details for the user
      const userSchools = schools.map(school => ({
        school: school.school,
        state: school.state,
        county: school.county,
        city: school.city,
        district: school.district
      }));

      // Add each school directly to the user details
      for (const school of userSchools) {
        const userDetails = {
          id: _id,
          name,
          email,
          role,
          code,
          ...school  // Spread school details into userDetails
        };
        users.push(userDetails);
      }
    }
    console.log(users)
    // Return users array as JSON response
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Server error" });
  }
};

export { getAllUsers };
