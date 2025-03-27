import NoCodeSchema from "../models/NoCode.js";

const getNoCodeStudentData = async ({
  school,
  state,
  city,
  county,
  district,
  grade,
  period,
  formType,
  when,
  all,
  checkedYears,
}) => {
  const queryObject = {};

  if (school && school !== "all") queryObject.school = school;
  if (formType && formType !== "all") {
    queryObject.formType = all === "true" ? "all" : formType;
  }
  if (grade && grade !== "all") queryObject.grade = grade;
  if (period && period !== "all") queryObject.period = period;
  if (when && when !== "all") queryObject.when = when;
  if (state && state !== "all") queryObject.state = state;
  if (city && city !== "all") queryObject.city = city;
  if (county && county !== "all") queryObject.county = county;
  if (district && district !== "all") queryObject.district = district;

  // Create an array to store $or conditions for checked years
  const orConditions = [];

  if (checkedYears && typeof checkedYears === "object") {
    for (const [year, isChecked] of Object.entries(checkedYears)) {
      if (isChecked === "true") {
        let startDate, endDate;

        if (year === "2023-2024") {
          startDate = new Date("2023-07-01T00:00:00.000Z");
          endDate = new Date("2024-06-30T23:59:59.999Z");
        } else if (year === "2024 (August–December)") {
          startDate = new Date("2024-08-01T00:00:00.000Z");
          endDate = new Date("2024-12-31T23:59:59.999Z");
        } else if (year === "2025(Jan 6 - )") {
          startDate = new Date("2025-01-04T00:00:00.000Z");
          endDate = new Date("2025-12-31T23:59:59.999Z");
        }

        orConditions.push({
          createdAt: { $gte: startDate, $lt: endDate },
        });
      }
    }
  }

  if (orConditions.length > 0) {
    queryObject.$or = orConditions;
  }

  // Apply regex for text matching
  const regexFields = ["school", "state", "city", "county", "district"];
  regexFields.forEach((field) => {
    if (queryObject[field]) {
      queryObject[field] = {
        $regex: queryObject[field],
        $options: "i",
      };
    }
  });

  return await NoCodeSchema.find(queryObject);
};

export default getNoCodeStudentData