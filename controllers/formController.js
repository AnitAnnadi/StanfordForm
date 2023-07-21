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
    overall
  } = req.query;

  const school = await School.findOne({ _id: schoolId })
  const teacher = await User.findOne({ _id: teacherId })
  let responseQueryObject={}
  
  if (overall){
  responseQueryObject = {
    formCode: formCode,
    teacher: teacherId,
    // grade: grade,
    formType: formType,
    // when: when,
    // school: school.school,
  };}

  else{
    responseQueryObject = {
      formCode: formCode,
      teacher: teacherId,
      grade: grade,
      formType: formType,
      when: when,
      school: school.school,
    };}

  if (period && period !== 'undefined') {
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

export { getFormMetrics }