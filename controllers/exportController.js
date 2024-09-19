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
import {
  tobacco24,
  tobaccoElem24,
  cannabis24,
  healthy24,
  // safety,
  healthyCannabis24,
  healthyTobacco24
} from "../utils/questions24-25.js";
import NoCode from "../models/NoCode.js";
let exportData = [];

const findResponse = (list, questions, obj, selectedYear) => {
  console.log(selectedYear)
  list.map((block) => {
    let foundQuestions = questions.filter((object) => 
    object.Question === block[selectedYear === "2024-2025" ? 'name' : 'question']);    console.log(foundQuestions)
    
    if (foundQuestions.length > 0) {
      obj[block[selectedYear === "2024-2025" ? 'name' : 'question']] = foundQuestions.map((q) => q.Answer).join(", "); // Combine answers if there are multiple matches
    } else {
      obj[block[selectedYear === "2024-2025" ? 'name' : 'question']] = "";
    }
  });
  exportData.push(obj);
};

const getExport = async (req, res) => {
  exportData = [];
  try {
    const { noCode, teacherId, schoolId, period, grade, formType, when,
      school: schoolName, state, city, county, district } = req.query;
    const { formCode, selectedYear } = req.params;
    console.log(selectedYear)

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
        console.log(selectedYear, "2024-2025")
        if (studentResponse.formType === "You and Me Vape Free (middle school and above)") {
          if (studentResponse.when === "before") {
            findResponse(selectedYear=="2024-2025"?tobacco24:tobacco, questions, obj, selectedYear);
          } else {
            findResponse(selectedYear=="2024-2025"?tobacco24:tobacco.concat(postTobacco), questions, obj, selectedYear);
          }
        }
        else if (studentResponse.formType === "You and Me, Together Vape-Free(elem)") {
          if (studentResponse.when === "before") {
            findResponse(selectedYear=="2024-2025"?tobaccoElem24:tobaccoElem, questions, obj, selectedYear);
          } else {
            findResponse(selectedYear=="2024-2025"?tobaccoElem24:tobaccoElem.concat(postTobacco), questions, obj, selectedYear);
          }
        }
        else if (
          studentResponse.formType ===
          "Smart Talk: Cannabis Prevention & Education Awareness"
        ) {
          if (studentResponse.when === "before") {
            findResponse(selectedYear=="2024-2025"?cannabis24:cannabis, questions, obj, selectedYear);
          } else {
            findResponse(selectedYear=="2024-2025"?cannabis24:cannabis.concat(postCannabis), questions, obj, selectedYear);
          }
        } else if (studentResponse.formType === "Safety First") {
          findResponse(safety, questions, obj, selectedYear);
        }
        else if (studentResponse.formType === "Healthy Futures: Tobacco/Nicotine/Vaping") {
          findResponse(selectedYear=="2024-2025"?healthy24.concat(healthyTobacco24):healthy, questions, obj, selectedYear);
        }
        else if (studentResponse.formType === "Healthy Futures: Cannabis") {
          findResponse(selectedYear=="2024-2025"?healthy24.concat(healthyCannabis24):healthy, questions, obj, selectedYear);
        }
      })
    );

    res.status(StatusCodes.OK).json({ exportData });
  } catch (error) {
    console.error("Error exporting exportData:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to export exportData." });
  }
};

export { getExport };
