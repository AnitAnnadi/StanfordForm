import {BadRequestError} from "../errors/index.js";
import User from "../models/User.js";
import School from "../models/School.js";
import StudentResponse from "../models/StudentResponse.js";
import Question from "../models/Question.js";
import attachCookie from "../utils/attachCookie.js";
import {StatusCodes} from "http-status-codes";
import NoCode from "../models/NoCode.js";

const getFormMetrics = async(req,res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const token = user.createJWT();
  attachCookie({ res, token });

  const { formCode } = req.params;
  const {
    noCode,
    teacherId,
    schoolId,
    period,
    grade,
    formType,
    when,
    school: schoolName,
    state,
    city,
    county,
    district,
  } = req.query;

  let teacher;
  let studentResponses;

  let responseQueryObject={}
 
  let school = undefined;

  if (noCode === "false" || noCode === undefined || noCode === "undefined") {
    responseQueryObject = {
      formCode: formCode,
      teacher: teacherId,
      grade: grade,
      formType: formType,
      when: when,
      school: schoolName,
    }
    if (period && period !== 'undefined' && period !== 'null') {
      responseQueryObject.period = period;
      // console.log(responseQueryObject.period)
    }
    // console.log(responseQueryObject)
    teacher = await User.findOne({ _id: teacherId });
    studentResponses = await StudentResponse.find(responseQueryObject);
    school = await School.findOne({ _id: schoolId });
  } else {
    responseQueryObject = {
      school: schoolName,
      state: state,
      city: city,
      county: county,
      district: district,
      grade: grade,
      formType: formType,
      period: period,
      when: when,
    }

    studentResponses = await NoCode.find(responseQueryObject);

    teacher = {
      name: 'No Teacher',
    };

    school = {
      school: schoolName,
      state: state,
      county: county,
      district: district,
      city: city,
    }
  }

  const questionsToAnswers = {};

  const questionsToAnswersPromises = studentResponses.map( async (response) => {
    const studentsQuestionsToAnswers = await Question.find({ StudentResponse: response._id });

    studentsQuestionsToAnswers.forEach((question) => {
      if (questionsToAnswers[question.Question]) {
        if (questionsToAnswers[question.Question][question.Answer]) {
          questionsToAnswers[question.Question][question.Answer] += 1;
        } else {
          questionsToAnswers[question.Question][question.Answer] = 1;
        }
      } else {
        questionsToAnswers[question.Question] = {
          [question.Answer]: 1,
        };
      }
    });
  });

  await Promise.all(questionsToAnswersPromises);
  // console.log(questionsToAnswers)
  res.status(StatusCodes.OK).json({ questionsToAnswers, school, teacher, responseType: responseQueryObject , numberOfResponses: studentResponses.length});

}

const getTotal=async(req,res)=>{
  const {code}=req.body
  const result=StudentResponse.find({formCode:code})
  const total = await result;
  let totalResponses=total.length
  res.status(StatusCodes.OK).json({ totalResponses });

  
}


export { getFormMetrics, getTotal }