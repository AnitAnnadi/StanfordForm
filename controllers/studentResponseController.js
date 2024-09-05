import {BadRequestError} from "../errors/index.js";
import User from "../models/User.js";
import School from "../models/School.js";
import attachCookie from "../utils/attachCookie.js";
import {StatusCodes} from "http-status-codes";
import StudentResponse from "../models/StudentResponse.js";
import NoCodeSchema from "../models/NoCode.js";

import Certificates from "../models/Certificates.js";
const getStudentResponses = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    const token = user.createJWT();
    attachCookie({ res, token });

    const { school, teacherId, grade, period, formType, when, all, selectedYear } = req.query;
    let form = all === 'true' ? 'all' : formType;

    const teacher = await User.findOne({ _id: teacherId });

    // Prepare the query object
    const queryObject = {
      school,
      teacher: teacherId,
    };

    if (form && form !== 'all') {
      queryObject.formType = form;
    }

    if (grade && grade !== 'all') {
      queryObject.grade = grade;
    }
    if (period && period !== 'all') {
      queryObject.period = period;
    }
    if (when && when !== 'all') {
      queryObject.when = when;
    }

    // Create an array to store the $or conditions based on selectedYear
    const orConditions = [];
    console.log(selectedYear)
    if (selectedYear!=null && selectedYear !==undefined ){
      const [startYear, endYear] = selectedYear.split('-');
      const startDate = new Date(`${startYear}-07-01T00:00:00.000Z`);
      const endDate = new Date(`${endYear}-06-30T23:59:59.999Z`);
      orConditions.push({
        createdAt: {
          $gte: startDate,
          $lt: endDate,
        },
      });
    }
    
  
    if (orConditions.length > 0) {
      queryObject.$or = orConditions;
    }
    // Query the database
    const studentResponses = await StudentResponse.find(queryObject);
    // console.log(studentResponses)
    res.status(StatusCodes.OK).json({ teacherName: teacher?.name, studentResponses });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
  }
};


const getNoCodeStudentResponses = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    const token = user.createJWT();
    attachCookie({ res, token });

    const { school, state, city, county, district, grade, period, formType, when, all, selectedYear } = req.query;
    let form = all === 'true' ? 'all' : formType;

    // Prepare the query object
    const queryObject = {};

    if (school && school !== 'all') {
      queryObject.school = school;
    }
    if (form && form !== 'all') {
      queryObject.formType = form;
    }
    if (grade && grade !== 'all') {
      queryObject.grade = grade;
    }
    if (period && period !== 'all') {
      queryObject.period = period;
    }
    if (when && when !== 'all') {
      queryObject.when = when;
    }
    if (state && state !== 'all') {
      queryObject.state = state;
    }
    if (city && city !== 'all') {
      queryObject.city = city;
    }
    if (county && county !== 'all') {
      queryObject.county = county;
    }
    if (district && district !== 'all') {
      queryObject.district = district;
    }

    // Create an array to store the $or conditions based on selectedYear
    const orConditions = [];
    if (selectedYear!=[] && selectedYear !==undefined ){
      for (const [year, isChecked] of Object.entries(selectedYear)) {
      if (isChecked === 'true') {
        // Parse the year to create date ranges
        const [startYear, endYear] = year.split('-');
        const startDate = new Date(`${startYear}-07-01T00:00:00.000Z`);
        const endDate = new Date(`${endYear}-06-30T23:59:59.999Z`);

        orConditions.push({
          createdAt: {
            $gte: startDate,
            $lt: endDate,
          },
        });
      }
    }
  }
    if (orConditions.length > 0) {
      queryObject.$or = orConditions;
    }

    // Query the database
    const studentResponses = await NoCodeSchema.find(queryObject);
    
    res.status(StatusCodes.OK).json({ studentResponses });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred' });
  }
};


const getHealthyFutures = async(req,res) =>{
  const {teacherId} = req.query
  const responses = await Certificates.find({teacherId:teacherId})
  const responsesByCannabis = responses.filter(response => response.formType === 'Healthy Futures: Cannabis');
  const responsesByTobacco = responses.filter(response => response.formType === 'Healthy Futures: Tobacco/Nicotine/Vaping');

  res.status(StatusCodes.OK).json({ responsesByCannabis,responsesByTobacco });


}

export { getStudentResponses, getHealthyFutures, getNoCodeStudentResponses };