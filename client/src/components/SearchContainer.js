import { FormRow, FormRowSelect } from ".";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/SearchContainer";
import { useState, useMemo, useEffect } from "react";
import {
  narrowCities,
  narrowCounties,
  narrowDistricts,
  narrowSchools,
} from "../utils/schoolDataFetch";
import { Link } from "react-router-dom";
import SchoolYearCheckboxes from "./SchoolYearCheckboxes";
import { utils as XLSXUtils, writeFile as writeXLSXFile } from "xlsx";
import {
  tobacco,
  postTobacco,
  cannabis,
  postCannabis,
  safety,
  healthy,
} from "../utils/questions23-24";
import { ThreeDots } from "react-loader-spinner";
import {useTranslation} from "react-i18next";

const SearchContainer = ({ startReload }) => {
  const {
    user,
    handleChange,
    isLoading,
    searchState,
    searchCounty,
    searchDistrict,
    searchCity,
    searchSchool,
    searchGrade,
    searchPeriod,
    searchType,
    searchTeacher,
    searchBeforeAfter,
    stateOptions,
    countyOptions,
    districtOptions,
    cityOptions,
    schoolOptions,
    periodOptions,
    gradeOptions,
    teacherOptions,
    typeOptions,
    beforeAfterOptions,
    handleChanges,
    getResponseGroups,
    userLocations,
    currentSchoolIndex,
    shouldReload,
    getUsers,
    getExport,
    setToNarrowSchools,
    exportData,
    allUsers,
    exportLoading,
    userExportLoading
  } = useAppContext();
  const [exportClicked, setExportClicked] = useState(false);
  const [questionsToAnswers, setQuestionsToAnswers] = useState({});
  const [usersSheetCreated, setUsersSheetCreated] = useState(false);
  const [schoolYearsList, setSchoolYearsList] = useState([]);

  let reorderedQuestionsToAnswers = {};
  const vape = [];
  const vapeElem = []; 
  const cannabis = [];
  const safety = [];
  const healthyTobacco = [];
  const healthyCannabis = [];
  const startYear = 2023
  let currentYear = new Date().getFullYear() 
  



  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (exportClicked && exportData) {
      exportData.forEach((obj) => {
        const formtype = obj["form type"];
        if (formtype === "You and Me Vape Free (middle school and above)") {
          vape.push(obj);
        }
        else if (formtype === "You and Me, Together Vape-Free(elem)") {
          vapeElem.push(obj);
        }  
        else if (
          formtype === "Smart Talk: Cannabis Prevention & Education Awareness"
        ) {
          cannabis.push(obj);
        } else if (formtype === "Safety First") {
          safety.push(obj);
        } else if (formtype === "Healthy Futures: Tobacco/Nicotine/Vaping") {
          healthyTobacco.push(obj);
        } else if (formtype === "Healthy Futures: Cannabis") {
          healthyCannabis.push(obj);
        }

      });

      const vapeSheet = XLSXUtils.json_to_sheet(vape);
      const vapeElemSheet = XLSXUtils.json_to_sheet(vapeElem);
      const cannabisSheet = XLSXUtils.json_to_sheet(cannabis);
      const safetySheet = XLSXUtils.json_to_sheet(safety);
      const healthyTobaccoSheet = XLSXUtils.json_to_sheet(healthyTobacco);
      const healthyCannabisSheet = XLSXUtils.json_to_sheet(healthyCannabis);

      const workbook = XLSXUtils.book_new();
      XLSXUtils.book_append_sheet(workbook, vapeSheet, "Vape-Free");
      XLSXUtils.book_append_sheet(workbook, vapeElemSheet, "Vape-Free(elem)");
      XLSXUtils.book_append_sheet(workbook, cannabisSheet, "Smart Talk");
      XLSXUtils.book_append_sheet(workbook, safetySheet, "Safety First");
      XLSXUtils.book_append_sheet(
        workbook,
        healthyTobaccoSheet,
        "Healthy Futures - Tobacco"
      );
      XLSXUtils.book_append_sheet(
        workbook,
        healthyCannabisSheet,
        "Healthy Futures - Cannabis"
      );
      writeXLSXFile(workbook, `data.xlsx`);
      handleChange(exportData, []);
      setExportClicked(false);
    }
  }, [exportData, exportClicked]);

  useEffect(() => {
    if (allUsers && !usersSheetCreated) {
      
      const usersSheet = XLSXUtils.json_to_sheet(allUsers);
      const workbook = XLSXUtils.book_new();
      XLSXUtils.book_append_sheet(workbook, usersSheet, "All Users");
      writeXLSXFile(workbook, `users.xlsx`);
      // Set a flag to indicate that the sheet has been created
      setUsersSheetCreated(true);
      handleChange({ name: "userExportLoading", value: false });

    }
  }, [allUsers, usersSheetCreated]);

  useEffect(() => {
    const fetchSchoolYears = async () => {
      const years = await schoolYears(startYear, currentYear);
      setSchoolYearsList(years);
    };
    fetchSchoolYears();
  }, [startYear, currentYear]);


  const createExcelSheet = async () => {
    await getResponseGroups(currentSchoolIndex, shouldReload, true);
    setExportClicked(true);
  };

  const createUserSheet = async(e) =>{
    e.preventDefault()
    await getUsers();

  }

  const schoolYears = async (startYear, endYear) => {
    if (startYear >= endYear) {
        return [];
    }

    const schoolYearList = [];
    for (let year = startYear; year <= endYear; year++) {
        const nextYear = year + 1;
        schoolYearList.push(`${year}-${nextYear}`);
    }

    return schoolYearList;
};

 

  const createQuestionsToAnswersMap = (array, questionsToAnswers) => {
    reorderedQuestionsToAnswers = {};
    array.forEach((question) => {
      if (questionsToAnswers.hasOwnProperty(question.question)) {
        reorderedQuestionsToAnswers[question.question] =
          questionsToAnswers[question.question];
      }
    });
    setQuestionsToAnswers(reorderedQuestionsToAnswers);
  };

  const formTimeType = (formType, when, data) => {
    if (formType === "You and Me Vape Free (middle school and above)") {
      return when === "before"
        ? createQuestionsToAnswersMap(tobacco, data)
        : createQuestionsToAnswersMap(tobacco.concat(postTobacco), data);
    } else if (
      formType === "Smart Talk: Cannabis Prevention & Education Awareness"
    ) {
      return when === "before"
        ? createQuestionsToAnswersMap(cannabis, data)
        : createQuestionsToAnswersMap(cannabis.concat(postCannabis), data);
    } else if (formType === "Healthy Futures") {
      return createQuestionsToAnswersMap(healthy, data);
    } else if (formType === "Safety First") {
      return createQuestionsToAnswersMap(safety, data);
    }
  };

  const narrowAllowedOptions = (searchType, searchValues) => {
    let values;

    if (user.role === "Teacher") {
      const allowedValues = userLocations.map(
        (location) => location[searchType].toUpperCase()
      );
      values = searchValues.filter((value) => allowedValues.includes(value.toUpperCase()));
    }  else if (user.role === "Stanford Staff") {
      values = searchValues;
    } else {
      if (userLocations[0][searchType] === null) {
        values = searchValues;
      } else {
        values = searchValues.filter(
          (value) => value.toUpperCase() === userLocations[0][searchType].toUpperCase()
        );
      }
    }

    if (values.length === 0) {
      values = ["all"];
    } else {
      values = ["all", ...values];
    }

    return values;
  };


const resetFields = (fields) => {
  const resetState = fields.reduce((acc, field) => {
    acc[field] = "all";
    return acc;
  }, {});
  handleChanges(resetState);
};

const handleLocalChange = (e) => {
  const { name, value } = e.target;

  switch (name) {
    case "searchState":
      resetFields([
        "searchCounty",
        "searchCity",
        "searchDistrict",
        "searchSchool",
        "searchTeacher",
      ]);

      handleChanges({
        [name]: value,
        countyOptions: narrowAllowedOptions(
          "county",
          narrowCounties({ state: value })
        ),
        cityOptions: narrowAllowedOptions(
          "city",
          narrowCities({ state: value })
        ),
        districtOptions: narrowAllowedOptions(
          "district",
          narrowDistricts({ state: value })
        ),
      });

      setToNarrowSchools({
        reactState: "schoolOptions",
        allowed: false,
        state: value,
      });
      break;

    case "searchCounty":
      resetFields(["searchCity", "searchDistrict", "searchSchool", "searchTeacher"]);

      handleChanges({
        [name]: value,
        cityOptions: narrowAllowedOptions(
          "city",
          narrowCities({ county: value })
        ),
        districtOptions: narrowAllowedOptions(
          "district",
          narrowDistricts({ county: value, state: searchState })
        ),
      });

      setToNarrowSchools({
        reactState: "schoolOptions",
        allowed: false,
        county: value,
      });
      break;

    case "searchCity":
      resetFields(["searchDistrict", "searchSchool", "searchTeacher"]);

      handleChanges({
        [name]: value,
        districtOptions: narrowAllowedOptions(
          "district",
          narrowDistricts({
            city: value === "all" ? undefined : value,
            county: searchCounty === "all" ? undefined : searchCounty,
            state: searchState === "all" ? undefined : searchState,
          })
        ),
      });

      setToNarrowSchools({
        reactState: "schoolOptions",
        allowed: false,
        city: value,
        county: searchCounty,
        state: searchState,
      });
      break;

    case "searchDistrict":
      resetFields(["searchSchool", "searchTeacher"]);

      handleChanges({
        [name]: value,
      });

      setToNarrowSchools({
        reactState: "schoolOptions",
        allowed: false,
        district: value,
        county: searchCounty,
        state: searchState,
        city: searchCity,
      });
      break;

    case "searchSchool":
      resetFields(["searchTeacher"]);

      handleChanges({
        [name]: value,
      });
      break;

    case "searchTeacher":
      if (value === "all") {
        handleChanges({ [name]: "all" });
      } else {
        const selectedTeacher = teacherOptions.find(
          (teacher) => teacher[0] === value
        );
        handleChanges({
          [name]: selectedTeacher || "all",
        });
      }
      break;

    default:
      handleChanges({ [name]: value });
      break;
  }
};
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const timeout = setTimeout(() => {
      startReload();
    }, 1000);

    return () => clearTimeout(timeout);
  };

  return (
    <Wrapper>
      <form className="form">
        <h4>
          {t('search_form', 'Search Form')}
        </h4>
        <div className="form-center">
          {/* search by state */}
          <FormRowSelect
            labelText="state"
            name="searchState"
            value={searchState}
            handleChange={handleLocalChange}
            list={stateOptions}
          />
          {/* search by county */}
          <FormRowSelect
            labelText="county"
            name="searchCounty"
            value={searchCounty}
            handleChange={handleLocalChange}
            list={countyOptions}
          />
          {/* search by city */}
          {user.role !== "District Admin" && (
            <FormRowSelect
              labelText="city"
              name="searchCity"
              value={searchCity}
              handleChange={handleLocalChange}
              list={cityOptions}
            />
          )}
          {/* search by district */}
          <FormRowSelect
            labelText="district"
            name="searchDistrict"
            value={searchDistrict}
            handleChange={handleLocalChange}
            list={districtOptions}
          />
          {/* search by school */}
          <FormRowSelect
            labelText="school"
            name="searchSchool"
            value={searchSchool}
            handleChange={handleLocalChange}
            list={["all", ...schoolOptions]}
          />
          {/* search by teacher */}
          <FormRowSelect
            labelText="teacher"
            name="searchTeacher"
            value={
              user.role === "Teacher"
                ? user.name
                : searchTeacher === "all"
                ? "all"
                : searchTeacher[0]
            }
            handleChange={handleLocalChange}
            list={
              user.role === "Teacher"
                ? [user.name]
                : ["all", ...teacherOptions.map((teacher) => teacher[0])]
            }
          />
          {/* search by grade */}
          <FormRowSelect
            labelText="grade"
            name="searchGrade"
            value={searchGrade}
            handleChange={handleLocalChange}
            list={gradeOptions}
          />
          {/* search by period */}
          <FormRowSelect
            labelText="period"
            name="searchPeriod"
            value={searchPeriod}
            handleChange={handleLocalChange}
            list={periodOptions}
          />
          {/* search by type */}
          <FormRowSelect
            labelText="form type"
            name="searchType"
            value={searchType}
            handleChange={handleLocalChange}
            list={typeOptions}
          />
          {/* search by before/after */}
          <FormRowSelect
            labelText="before or after"
            name="searchBeforeAfter"
            value={searchBeforeAfter}
            handleChange={handleLocalChange}
            list={beforeAfterOptions}
          />
          <button
            className="btn btn-block btn-apply"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {t('search_forms', 'search forms')}
          </button>
           {/* Render school years checkboxes */}
          <div>
          <label>{t("Select School Year(s)")}</label>
          <SchoolYearCheckboxes schoolYears={schoolYearsList} />
        </div>
          <button
            className="btn btn-block btn-apply"
            disabled={isLoading}
            onClick={createExcelSheet}
            style={{
              display: "flex",
              justifyContent: "center",
              placeItems: "center",
            }}
          >
            {exportLoading ? (
              <>
                {t('exporting_data', 'Exporting Data')}
                <ThreeDots color="green" height={20} width={20} />
              </>
            ) : (
              t('export_all_data', 'Export All Data')
            )}
          </button>
          {user.role === "Stanford Staff"?
          <button
            className="btn btn-block btn-apply"
            disabled={isLoading}
            onClick={createUserSheet}
            style={{
              display: "flex",
              justifyContent: "center",
              placeItems: "center",
            }}
          >
            {userExportLoading ? (
              <>
                {t('exporting_data', 'Exporting Data')}
                <ThreeDots color="green" height={20} width={20} />
              </>
            ) : (
              t('export_user_data', 'Export User Data')
            )}
          </button>:null}

          <Link
            className="btn btn-block btn-obreak"
            disabled={isLoading}
            to={isLoading ? "#" : `/api/v1/form/`}
          >
            {t('overall_breakdown', 'Overall Breakdown')}
          </Link>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
