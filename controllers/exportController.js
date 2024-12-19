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
  tobaccoElem,
} from "../utils/questions.js";
import {
  tobacco24,
  tobaccoElem24,
  cannabis24,
  healthy24,
  safety24,
  healthyCannabis24,
  healthyTobacco24,
} from "../utils/questions24-25.js";
import NoCode from "../models/NoCode.js";
let exportData = [];

const findResponse = (list, questions, obj, isNewForm) => {
  list.map((block) => {
    let foundQuestions = questions.filter(
      (object) => isNewForm?(object.Question === block.name):(object.Question === block.question)
    );
    if (foundQuestions.length > 0) {
      console.log(foundQuestions)
      if (isNewForm){
        obj[block.name] = foundQuestions.map((q) => q.Answer).join(", "); // Combine answers if there are multiple matches
      }
      else{
        obj[block.question] = foundQuestions.map((q) => q.Answer).join(", "); // Combine answers if there are multiple matches
      }
      
    } else {
      if (isNewForm){
        obj[block.name] = " "
      }
      else{
        obj[block.question] = " "
      }
    }
  });
  exportData.push(obj);
};

const isInt = (value) => {
  return Number.isInteger(Number(value));
};

const getExport = async (req, res) => {
  exportData = [];
  try {
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
    const { formCode } = req.params;

    let responseQueryObject = {};

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
      };
      if (period && period !== "undefined" && period !== "null") {
        responseQueryObject.period = period;
      } else {
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
      };

      studentResponses = await NoCode.find(responseQueryObject);

      teacher = {
        name: "n/a",
      };

      school = {
        school: schoolName,
        state: state,
        county: county,
        district: district,
        city: city,
      };
    }

    const responseIds = studentResponses.map((sr) => sr._id);
    const questions = await Question.find({
      StudentResponse: { $in: responseIds },
    });
    const exportData = studentResponses.map((studentResponse) => {
      const date = new Date(studentResponse.createdAt).toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
      });

      const obj = {
        teacher: teacher?.name,
        school: school?.school,
        county: school.county === "custom" ? "n/a" : school.county,
        district: school.district === "custom" ? "n/a" : school.district,
        state: school.state,
        city: school.city,
        date: date,
        when: studentResponse.when,
        grade: studentResponse.grade,
        period: studentResponse.period || "n/a",
        "form type": studentResponse.formType,
      };

      // Filter questions related to this response
      const relatedQuestions = questions.filter(
        (q) => q.StudentResponse.toString() === studentResponse._id.toString()
      );
      let isNewForm = isInt(relatedQuestions[0].Answer);

      // Define a mapping for form types and their respective data
      const formTypeMapping = {
        "You and Me Vape Free (middle school and above)": {
          before: isNewForm ? tobacco24 : tobacco,
          after: isNewForm ? tobacco24 : [...tobacco, ...postTobacco],
        },
        "You and Me, Together Vape-Free(elem)": {
          before: isNewForm ? tobaccoElem24 : tobaccoElem,
          after: isNewForm ? tobaccoElem24 : [...tobaccoElem, ...postTobacco],
        },
        "Smart Talk: Cannabis Prevention & Education Awareness": {
          before: isNewForm ? cannabis24 : cannabis,
          after: isNewForm ? cannabis24 : [...cannabis, ...postCannabis],
        },
        "Safety First": {
          always: isNewForm ? safety24 : safety,
        },
        "Healthy Futures: Tobacco/Nicotine/Vaping": {
          always: isNewForm ? healthy24.concat(healthyTobacco24) : healthy,
        },
        "Healthy Futures: Cannabis": {
          always: isNewForm ? healthy24.concat(healthyCannabis24) : healthy,
        },
      };

      // Simplify the logic using the mapping
      if (formTypeMapping[studentResponse.formType]) {
        const dataKey = studentResponse.when === "before" ? "before" : "after";
        const data =
          formTypeMapping[studentResponse.formType][dataKey] ||
          formTypeMapping[studentResponse.formType].always;
        if (data) findResponse(data, relatedQuestions, obj, isNewForm);
      }
      return obj; // Add the processed object to exportData
    });

    res.status(StatusCodes.OK).json({ exportData });
  } catch (error) {
    console.error("Error exporting exportData:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to export exportData." });
  }
};

const getExportBulk = async (req, res) => {
  try {
    const { allResponseGroups } = req.body; // Accept all responseGroups as input

    if (!allResponseGroups || allResponseGroups.length === 0) {
      return res.status(400).json({ error: "No response groups provided." });
    }

    // Prepare queries for all response groups
    const responseQueries = allResponseGroups.map((group) => {
      const { school, uniqueResponseType } = group;

      return {
        noCode: uniqueResponseType?.noCode === "true",
        teacher: school.teacher,
        formCode: uniqueResponseType.formCode,
        grade: uniqueResponseType.grade,
        period: uniqueResponseType.period,
        formType: uniqueResponseType.formType,
        when: uniqueResponseType.when,
        school: school.school,
        state: school.state,
        city: school.city,
        county: school.county,
        district: school.district,
      };
    });

    // Prepare combined query
    const queryConditions = responseQueries.map((q) => {
      const condition = {
        formCode: q.formCode,
        teacher: q.teacher,
        grade: q.grade,
        formType: q.formType,
        when: q.when,
        school: q.school,
      };
      if (q.period && q.period !== "null") condition.period = q.period;
      return condition;
    });

    // Fetch all student responses in one go
    const studentResponses = await StudentResponse.find({
      $or: queryConditions,
    }).populate("teacher", "name");

    // Fetch related questions for all responses
    const responseIds = studentResponses.map((sr) => sr._id);
    const questions = await Question.find({
      StudentResponse: { $in: responseIds },
    });

    const queryMap = responseQueries.reduce((acc, query) => {
      const key = `${query.formCode}_${query.teacher}`;
      acc[key] = query;
      return acc;
    }, {});

    // Process all responses
    const exportData = studentResponses.map((studentResponse) => {
      const key = `${studentResponse.formCode}_${studentResponse.teacher?._id}`;
      const matchedQuery = queryMap[key];

      const date = new Date(studentResponse.createdAt).toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
      });
      const obj = {
        teacher: studentResponse.teacher?.name || "n/a",
        school: matchedQuery?.school,
        county: matchedQuery?.county || "n/a",
        district: matchedQuery?.district || "n/a",
        state: matchedQuery?.state,
        city: matchedQuery?.city,
        date: date,
        when: studentResponse.when,
        grade: studentResponse.grade,
        period: studentResponse.period || "n/a",
        "form type": studentResponse.formType,
      };

      // Find related questions
      const relatedQuestions = questions.filter(
        (q) => q.StudentResponse.toString() === studentResponse._id.toString()
      );

      // Define a mapping for form types and their respective data
      const formTypeMapping = {
        "You and Me Vape Free (middle school and above)": {
          before: tobacco,
          after: [...tobacco, ...postTobacco],
        },
        "You and Me, Together Vape-Free(elem)": {
          before: tobaccoElem,
          after: [...tobaccoElem, ...postTobacco],
        },
        "Smart Talk: Cannabis Prevention & Education Awareness": {
          before: cannabis,
          after: [...cannabis, ...postCannabis],
        },
        "Safety First": {
          always: safety,
        },
        "Healthy Futures: Tobacco/Nicotine/Vaping": {
          always: healthy,
        },
        "Healthy Futures: Cannabis": {
          always: healthy,
        },
      };

      // Simplify the logic using the mapping
      if (formTypeMapping[studentResponse.formType]) {
        const dataKey = studentResponse.when === "before" ? "before" : "after";
        const data =
          formTypeMapping[studentResponse.formType][dataKey] ||
          formTypeMapping[studentResponse.formType].always;
        if (data) findResponse(data, relatedQuestions, obj);
      }

      return obj;
    });

    // Send the consolidated export data
    res.status(200).json({ exportData });
  } catch (error) {
    console.error("Error exporting bulk data:", error);
    res.status(500).json({ error: "Failed to export bulk data." });
  }
};

export { getExport, getExportBulk };
