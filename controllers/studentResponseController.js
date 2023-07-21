import {BadRequestError} from "../errors/index.js";
import User from "../models/User.js";
import School from "../models/School.js";
import attachCookie from "../utils/attachCookie.js";
import {StatusCodes} from "http-status-codes";
import StudentResponse from "../models/StudentResponse.js";

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
    when
  } = req.query;

  const teacher = await User.findOne({ _id: teacherId })


  const queryObject = {
    school,
    teacher: teacherId,
    formType,
  };

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

export { getStudentResponses }