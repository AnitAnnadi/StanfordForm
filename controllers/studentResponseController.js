import {BadRequestError} from "../errors/index.js";
import User from "../models/User.js";
import School from "../models/School.js";
import attachCookie from "../utils/attachCookie.js";
import {StatusCodes} from "http-status-codes";
import StudentResponse from "../models/StudentResponse.js";
import NoCodeSchema from "../models/NoCode.js";

const getStudentResponses = async(req, res) => {
  const user = await User.findOne({ _id: req.user.userId });
  
  const token = user.createJWT();
  attachCookie({ res, token });

  const {
    school,
    teacherId,
    grade,
    period,
    formType,
    when,
    all,
    overallBreakdown
  } = req.query;
  let form = all=='true' ? 'all' : formType
  const teacher = await User.findOne({ _id: teacherId })


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

  const studentResponses = await StudentResponse.find(queryObject)
  res.status(StatusCodes.OK).json({ teacherName: teacher.name, studentResponses });
}

const getNoCodeStudentResponses = async(req, res) => {
  const user = await User.findOne({ _id: req.user.userId });

  const token = user.createJWT();
  attachCookie({ res, token });

  const {
    school,
    state,
    city,
    county,
    district,
    grade,
    period,
    formType,
    when,
    all,
  } = req.query;
  let form = all == 'true' ? 'all' : formType

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

  const studentResponses = await NoCodeSchema.find(queryObject)
  res.status(StatusCodes.OK).json({ studentResponses });
}

export { getStudentResponses, getNoCodeStudentResponses };