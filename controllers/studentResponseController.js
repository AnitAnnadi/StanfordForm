import {BadRequestError} from "../errors/index.js";
import User from "../models/User.js";
import School from "../models/School.js";
import attachCookie from "../utils/attachCookie.js";
import {StatusCodes} from "http-status-codes";
import StudentResponse from "../models/StudentResponse.js";
import Certificates from "../models/Certificates.js";
const getStudentResponses = async(req, res) => {
  try{
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
  res.status(StatusCodes.OK).json({ teacherName: teacher?.name, studentResponses });
}
catch(error){
  console.log(error)
}
}

const getHealthyFutures = async(req,res) =>{
  const {teacherId} = req.query
  console.log(teacherId)
  const responses = await Certificates.find({teacherId:teacherId})
  const responsesByCannabis = responses.filter(response => response.formType === 'Healthy Futures: Cannabis');
  const responsesByTobacco = responses.filter(response => response.formType === 'Healthy Futures: Tobacco/Nicotine/Vaping');

  res.status(StatusCodes.OK).json({ responsesByCannabis,responsesByTobacco });
  

}

export { getStudentResponses, getHealthyFutures }