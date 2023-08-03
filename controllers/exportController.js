import { BadRequestError } from "../errors/index.js";
import User from "../models/User.js";
import School from "../models/School.js";
import StudentResponse from "../models/StudentResponse.js";
import Question from "../models/Question.js";
import attachCookie from "../utils/attachCookie.js";
import { StatusCodes } from "http-status-codes";
import {
  tobacco,
  postTobacco,
  cannabis,
  postCannabis,
  safety,
} from "../questions.js";
let exportData = [];

const findResponse = (list, questions, obj) => {
  list.map((block) => {
    let foundQuestions = questions.filter((object) => object.Question === block.question);
    if (foundQuestions.length > 0) {
      obj[block.question] = foundQuestions.map((q) => q.Answer).join(", "); // Combine answers if there are multiple matches
    } else {
      obj[block.question] = "n/a";
    }
  });
  exportData.push(obj);
};

const getExport = async (req, res) => {
  exportData = [];
  try {
    const { teacherId, schoolId, period, grade, formType, when } = req.query;
    const { formCode } = req.params;
    const school = await School.findOne({ _id: schoolId });
    const teacher = await User.findOne({ _id: teacherId });

    let responseQueryObject = {
      formCode: formCode,
      teacher: teacherId,
      grade: grade,
      formType: formType,
      when: when,
      school: school.school,
    };

    if (period && period !== "undefined") {
      responseQueryObject.period = period;
    }

    const studentResponses = await StudentResponse.find(responseQueryObject);
    const map = await Promise.all(
      studentResponses.map(async (studentResponse) => {
        let obj = {
          teacher: teacher.name,
          county: school.county,
          district: school.district,
          city: school.city,
        };
        obj.when = studentResponse.when;
        obj.grade = studentResponse.grade;
        obj.period =
          studentResponse.period === undefined ? "n/a" : studentResponse.period;
        obj["form type"] = studentResponse.formType;

        let questions = await Question.find({
          StudentResponse: studentResponse._id,
        });
        if (studentResponse.formType === "You and Me, Together Vape-Free") {
          if (studentResponse.when === "before") {
            findResponse(tobacco, questions, obj);
          } else {
            findResponse(tobacco.concat(postTobacco), questions, obj);
          }
        } else if (
          studentResponse.formType ===
          "Smart Talk: Cannabis Prevention & Education Awareness"
        ) {
          if (studentResponse.when === "before") {
            findResponse(cannabis, questions, obj);
          } else {
            findResponse(cannabis.concat(postCannabis), questions, obj);
          }
        } else if (studentResponse.formType === "Safety First") {
          findResponse(safety, questions, obj);
        }
      })
    );
    console.log(exportData)

    res.status(StatusCodes.OK).json({ exportData });
  } catch (error) {
    console.error("Error exporting exportData:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to export exportData." });
  }
};

export { getExport };
