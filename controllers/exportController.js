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
  safetyFent24,
  LGBTQ24
} from "../utils/questions24-25.js";
import NoCode from "../models/NoCode.js";
let exportData = [];

const findResponse = (list, questions, obj, isNewForm) => {
  console.log('in find')
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
        id: studentResponse._id,
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
      let isNewForm = isInt(relatedQuestions[0]?.Answer);

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
        "Safety First(Fentanyl)": {
          always: safetyFent24,
        },
        "LGBTQ+ Curriculum": {
          always: LGBTQ24,
        },
      };

      // Simplify the logic using the mapping
      if (formTypeMapping[studentResponse.formType]) {
        const dataKey = studentResponse.when === "before" ? "before" : "after";
        const data =
          formTypeMapping[studentResponse.formType][dataKey] ||
          formTypeMapping[studentResponse.formType].always;
        if (data) findResponse(data, relatedQuestions, obj, isNewForm);
        console.log('202')
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
    const {
      allResponseGroups,
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
      includeNoCode,
    } = req.body;

    if (!allResponseGroups || allResponseGroups.length === 0) {
      return res.status(400).json({ error: "No response groups provided." });
    }

    const responseQueries = allResponseGroups.map((group) => {
      const { school, uniqueResponseType } = group;
      const base = uniqueResponseType || group;

      return {
        noCode: base?.noCode === "true",
        teacher: base?.teacher || "n/a",
        formCode: base?.formCode,
        grade: base?.grade,
        period: base?.period,
        formType: base?.formType,
        when: base?.when,
        school: school?.school || base?.school,
        state: school?.state || base?.state,
        city: school?.city || base?.city,
        county: school?.county || base?.county,
        district: school?.district || base?.district,
      };
    });

    // === Build query conditions ===
    const queryConditions = responseQueries
      .filter((q) => q.formCode)
      .map((q) => {
        const condition = {
          formCode: q.formCode,
          grade: q.grade,
          formType: q.formType,
          when: q.when,
          school: q.school,
        };
        if (q.period && q.period !== "null") condition.period = q.period;
        if (q.teacher !== "n/a") condition.teacher = q.teacher;
        return condition;
      });

    let studentResponses = [];
    if (queryConditions.length > 0) {
      studentResponses = await StudentResponse.find({ $or: queryConditions })
        .lean()
        .populate("teacher", "name");
    }

    let noCodeStudentData = [];
    if (includeNoCode) {
      noCodeStudentData = await getNoCodeStudentData({
        grade,
        period,
        formType: "all",
        when,
        state,
        city,
        county,
        district,
        school,
        checkedYears,
      });
    }

    studentResponses.push(...noCodeStudentData);

    // === Fetch related questions ===
    const studentResponseIds = studentResponses.map((sr) => sr._id);
    const questions = await Question.find({
      StudentResponse: { $in: studentResponseIds },
    }).lean();

    // === Build response map for faster lookup ===
    const questionsMap = {};
    for (const q of questions) {
      const id = q.StudentResponse.toString();
      if (!questionsMap[id]) questionsMap[id] = [];
      questionsMap[id].push(q);
    }

    // === Build export data ===
    const queryMap = responseQueries.reduce((acc, query) => {
      const key = `${query.formCode}_${query.teacher || "n/a"}`;
      acc[key] = query;
      return acc;
    }, {});

    const studentExportData = studentResponses.map((sr) => {
      const key = `${sr.formCode}_${sr.teacher?._id || "n/a"}`;
      const matchedQuery = queryMap[key];

      const date = new Date(sr.createdAt).toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
      });

      const obj = {
        id: sr._id,
        teacher: sr.teacher?.name || "n/a",
        school: matchedQuery?.school || sr.school || "n/a",
        county: matchedQuery?.county || sr.county || "n/a",
        district: matchedQuery?.district || sr.district || "n/a",
        state: matchedQuery?.state || sr.state || "n/a",
        city: matchedQuery?.city || sr.city || "n/a",
        date,
        pre_post: sr.when,
        grade: sr.grade,
        period: sr.period || "n/a",
        curriculum: sr.formType,
      };
      console.log(obj)

      const relatedQuestions = questionsMap[sr._id?.toString()] || [];
      const isNewForm =
        relatedQuestions.length > 0 && isInt(relatedQuestions[0].Answer);

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
        "Safety First(Fentanyl)": {
          always: safetyFent24,
        },
        "LGBTQ+ Curriculum": {
          always: LGBTQ24,
        },
      };

      const dataKey = sr.when === "before" ? "before" : "after";
      const data =
        formTypeMapping[sr.formType]?.[dataKey] ||
        formTypeMapping[sr.formType]?.always;

      if (data) findResponse(data, relatedQuestions, obj, isNewForm);

      return obj;
    });

    res.status(200).json({ exportData: studentExportData });
  } catch (error) {
    console.error("❌ Bulk Export Error:", error.message);
    res.status(500).json({
      error: "Failed to export bulk data.",
      details: error.message,
    });
  }
};


// export default getExportBulk;


export { getExport, getExportBulk };
