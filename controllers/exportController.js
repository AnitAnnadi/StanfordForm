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
  healthy,
  tobaccoElem
} from "../utils/questions.js";
import NoCode from "../models/NoCode.js";
let exportData = [];

const findResponse = (list, questions, obj) => {
  list.map((block) => {
    let foundQuestions = questions.filter((object) => object.Question === block.question);
    if (foundQuestions.length > 0) {
      obj[block.question] = foundQuestions.map((q) => q.Answer).join(", "); // Combine answers if there are multiple matches
    } else {
      obj[block.question] = "";
    }
  });
  exportData.push(obj);
};

const getExport = async (req, res) => {
  exportData = [];
  try {
    const { noCode, teacherId, schoolId, period, grade, formType, when,
      school: schoolName, state, city, county, district } = req.query;
    const { formCode } = req.params;

    let responseQueryObject={}



    let teacher;
    let studentResponses;
    let school = undefined;

    if (noCode === "false") {
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
      }
      else{
        responseQueryObject.period = null;
      }

      school = await School.findOne({ _id: schoolId });
      teacher = await User.findOne({ _id: teacherId });
      studentResponses = await StudentResponse.find(responseQueryObject);
      console.log(studentResponses)
    } else {
      responseQueryObject = {
        school: schoolName,
        state: state,
        city: city,
        county: county,
        district: district,
        grade: grade,
        // formType: formType,
        period: period,
        when: when,
      }


      studentResponses = await NoCode.find(responseQueryObject);

      teacher = {
        name: 'n/a',
      };

      school = {
        school: schoolName,
        state: state,
        county: county,
        district: district,
        city: city,
      }
    }


    const map = await Promise.all(
      studentResponses.map(async (studentResponse) => {
        const date = new Date(studentResponse.createdAt);
        const options = {
            timeZone: 'America/Los_Angeles',
        };

        const readableDate = date.toLocaleString('en-US', options);
        console.log(readableDate);


        let obj = {
          teacher: teacher?.name,
          school: school?.school,
          county: school.county === "custom" ? "n/a" : school.county,
          district: school.district === "custom" ? "n/a" : school.district,
          state:school.state,
          city: school.city,
          date: readableDate
        };
        obj.when = studentResponse.when;
        obj.grade = studentResponse.grade;
        obj.period =
          studentResponse.period === undefined || studentResponse.period === null? "n/a" : studentResponse.period;
          obj["form type"] = studentResponse.formType;

        let questions = await Question.find({
          StudentResponse: studentResponse._id,
        });
        if (studentResponse.formType === "You and Me Vape Free (middle school and above)") {
          if (studentResponse.when === "before") {
            findResponse(tobacco, questions, obj);
          } else {
            findResponse(tobacco.concat(postTobacco), questions, obj);
          }
        }
        else if (studentResponse.formType === "You and Me, Together Vape-Free(elem)") {
          if (studentResponse.when === "before") {
            findResponse(tobaccoElem, questions, obj);
          } else {
            findResponse(tobaccoElem.concat(postTobacco), questions, obj);
          }
        }
        else if (
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
        else if (studentResponse.formType === "Healthy Futures: Tobacco/Nicotine/Vaping") {
          findResponse(healthy, questions, obj);
        }
        else if (studentResponse.formType === "Healthy Futures: Cannabis") {
          findResponse(healthy, questions, obj);
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
