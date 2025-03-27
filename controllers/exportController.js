import { BadRequestError } from "../errors/index.js";
import User from "../models/User.js";
import School from "../models/School.js";
import StudentResponse from "../models/StudentResponse.js";
import Question from "../models/Question.js";
import attachCookie from "../utils/attachCookie.js";
import { StatusCodes } from "http-status-codes";
import getNoCodeStudentData from "./noCodeHelper.js";
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
  cannabisElem24,
  healthy24,
  safety24,
  healthyCannabis24,
  healthyTobacco24,
} from "../utils/questions24-25.js";
import NoCode from "../models/NoCode.js";
let exportData = [];

const findResponse = (list, questions, obj, isNewForm) => {
  list.map((block) => {
    let foundQuestions = questions.filter((object) =>
      isNewForm
        ? object.Question === block.name
        : object.Question === block.question
    );
    if (foundQuestions.length > 0) {
      if (isNewForm) {
        obj[block.name] = foundQuestions.map((q) => q.Answer).join(", "); // Combine answers if there are multiple matches
      } else {
        obj[block.question] = foundQuestions.map((q) => q.Answer).join(", "); // Combine answers if there are multiple matches
      }
    } else {
      if (isNewForm) {
        obj[block.name] = " ";
      } else {
        obj[block.question] = " ";
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

    const responseIds = studentResponses?.map((sr) => sr._id);
    const questions = await Question.find({
      StudentResponse: { $in: responseIds },
    });
    const exportData = studentResponses?.map((studentResponse) => {
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
        curriculum: studentResponse.formType,
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
        "Smart Talk: Cannabis Prevention & Education Awareness(elem)": {
          before: isNewForm ? cannabisElem24 : cannabis,
          after: isNewForm ? cannabisElem24 : [...cannabis, ...postCannabis],
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

    res.status(StatusCodes.OK).json({ exportData, school, teacher });
  } catch (error) {
    console.error("Error exporting exportData:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to export exportData." });
  }
};

const getExportBulk = async (req, res) => {
  try {
    const { allResponseGroups, user, grade, period, formType, when, state, city, county, district, school, checkedYears } = req.body;
    

    if (!allResponseGroups || allResponseGroups.length === 0) {
      return res.status(400).json({ error: "No response groups provided." });
    }

    // Prepare queries for all response groups
    const responseQueries = allResponseGroups.map((group) => {
      const { school, uniqueResponseType } = group;
      if (uniqueResponseType?.teacher){

      return {
        noCode: uniqueResponseType?.noCode === "true",
        teacher: uniqueResponseType?.teacher || "n/a",
        formCode: uniqueResponseType.formCode,
        grade: uniqueResponseType.grade,
        period: uniqueResponseType.period,
        formType: uniqueResponseType.formType,
        when: uniqueResponseType.when,
        school: school?.school || uniqueResponseType.school,
        state: school?.state || uniqueResponseType.state,
        city: school?.city || uniqueResponseType.city,
        county: school?.county || uniqueResponseType.county,
        district: school?.district || uniqueResponseType.district,
      };
      }
      else{
        return group
      }
    });

    // Prepare queries for StudentResponse and NoCode collections
    const queryConditions = [];
    responseQueries.forEach((q) => {
      if (!q.formCode) return;
      let condition = {
        formCode: q.formCode,
        grade: q.grade,
        formType: q.formType,
        when: q.when,
        school: q.school,
      };


      if (q.period && q.period !== "null") condition.period = q.period;

      if (q.teacher !== "n/a") {
        condition.teacher = q.teacher;
        queryConditions.push(condition);
      } 
    });

    // Fetch StudentResponse data
    let studentResponses = [];


    if (queryConditions?.length > 0) {
      studentResponses = await StudentResponse.find({
        $or: queryConditions,
      }).populate("teacher", "name");
    }

    console.log(      
      grade,
      period,
      formType,
      when,
      state,
      city,
      county,
      district,
      school,
      checkedYears,)
    const noCodeStudentData = await getNoCodeStudentData({
      grade,
      period,
      formType,
      when,
      state,
      city,
      county,
      district,
      school,
      checkedYears,
    });
    
    studentResponses.push(...noCodeStudentData)


    // Fetch related questions for both StudentResponse and NoCode
    const studentResponseIds = studentResponses?.map((sr) => sr._id);

    const questionIds = [
      ...(studentResponseIds?.length > 0 ? studentResponseIds : []),
    ];

    const questions = await Question.find({
      StudentResponse: { $in: questionIds },
    });
    // Create query map for quick lookup
    const queryMap = responseQueries.reduce((acc, query) => {
      const key = `${query.formCode}_${
        query.teacher !== "n/a" ? query.teacher : "n/a"
      }`;
      acc[key] = query;
      return acc;
    }, {});

    // **Process all StudentResponse data**
    let studentExportData = studentResponses?.map((studentResponse) => {
      const key = `${studentResponse.formCode}_${
        studentResponse.teacher?._id || "n/a"
      }`;
      const matchedQuery = queryMap[key];

      const date = new Date(studentResponse.createdAt).toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
      });
      console.log(matchedQuery, studentResponse)

      const obj = {
        teacher: studentResponse.teacher?.name || "n/a",
        school: matchedQuery?.school || studentResponse?.school || "n/a",
        county: matchedQuery?.county || studentResponse?.county || "n/a", 
        district: matchedQuery?.district || studentResponse?.district || "n/a",
        state: matchedQuery?.state || studentResponse?.state || "n/a",
        city: matchedQuery?.city || studentResponse?.city || "n/a",
        date: date,
        pre_post: studentResponse.when,
        grade: studentResponse.grade,
        period: studentResponse.period || "n/a",
        curriculum: studentResponse.formType,
      };

      // Find related questions
      const relatedQuestions = questions.filter(
        (q) => q.StudentResponse.toString() === studentResponse._id.toString()
      );

      let isNewForm;
      if (relatedQuestions.length > 0) {
        isNewForm = isInt(relatedQuestions[0].Answer);
      }

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
        "Smart Talk: Cannabis Prevention & Education Awareness(elem)": {
          before: isNewForm ? cannabisElem24 : cannabis,
          after: isNewForm ? cannabisElem24 : [...cannabis, ...postCannabis],
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

      if (formTypeMapping[studentResponse.formType]) {
        const dataKey = studentResponse.when === "before" ? "before" : "after";
        const data =
          formTypeMapping[studentResponse.formType][dataKey] ||
          formTypeMapping[studentResponse.formType].always;
        if (data) findResponse(data, relatedQuestions, obj, isNewForm);
      }

      return obj;
    });


    studentExportData = Array.isArray(studentExportData)
      ? studentExportData
      : [];

    exportData = [...studentExportData];

    // Send the consolidated export data
    res.status(200).json({ exportData });
  } catch (error) {
    console.error("❌ Error exporting bulk data:", error);
    res
      .status(500)
      .json({ error: "Failed to export bulk data.", details: error.message });
  }
};

export { getExport, getExportBulk };
