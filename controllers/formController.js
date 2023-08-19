import {BadRequestError} from "../errors/index.js";
import User from "../models/User.js";
import School from "../models/School.js";
import StudentResponse from "../models/StudentResponse.js";
import Question from "../models/Question.js";
import attachCookie from "../utils/attachCookie.js";
import {StatusCodes} from "http-status-codes";

const getFormMetrics = async(req,res) => {
  const user = await User.findOne({ _id: req.user.userId });
  const token = user.createJWT();
  attachCookie({ res, token });

  const { formCode } = req.params;
  const {
    teacherId,
    schoolId,
    period,
    grade,
    formType,
    when,
  } = req.query;

  const school = await School.findOne({ _id: schoolId })
  const teacher = await User.findOne({ _id: teacherId })
  let responseQueryObject={}
  
  responseQueryObject = {
    formCode: formCode,
      teacher: teacherId,
      grade: grade,
      formType: formType,
      when: when,
      school: school.school,
  }

  if (period && period !== 'null') {
    responseQueryObject.period = period;
  }
  

  const studentResponses = await StudentResponse.find(responseQueryObject);

  const questionsToAnswers = {};

  const questionsToAnswersPromises = studentResponses.map( async (response) => {
    const studentsQuestionsToAnswers = await Question.find({ StudentResponse: response._id });

    studentsQuestionsToAnswers.forEach((question) => {
      if (questionsToAnswers[question.Question]) {
        if (questionsToAnswers[question.Question][question.Answer]) {
          // If its included add 1 to the value
          questionsToAnswers[question.Question][question.Answer] += 1;
        } else {
          // If its not included add answer to array with value of 1
          questionsToAnswers[question.Question][question.Answer] = 1;
        }
      } else {
        // If the question is not included add it to the object with the answer and value of 1
        questionsToAnswers[question.Question] = {
          [question.Answer]: 1,
        };
      }
    });
  });

  await Promise.all(questionsToAnswersPromises);

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