import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie, Doughnut } from "react-chartjs-2";
import { BiExport } from "react-icons/bi";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Loading } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import ResponseGroupInfo from "../components/ResponseGroupInfo";
import {
  FaChalkboardTeacher,
  FaRegCalendarAlt,
  FaLocationArrow,
} from "react-icons/fa";
import { AiOutlineForm, AiOutlineNumber } from "react-icons/ai";
import { TbListNumbers, TbNumbers } from "react-icons/tb";
import { useAppContext } from "../context/appContext";
import { utils as XLSXUtils, writeFile as writeXLSXFile } from "xlsx";
import {
  tobaccoElem,
  tobacco,
  postTobacco,
  cannabis,
  postCannabis,
  safety,
  healthy,
} from "../utils/questions23-24";
import {
  tobacco24,
  tobaccoElem24,
  cannabis24,
  cannabisElem24,
  healthy24,
  safety24,
  healthyCannabis24,
  healthyTobacco24,
  nicQuitQuestion,
  canQuitQuestion
} from "../utils/questions24-25";
import { ThreeDots } from "react-loader-spinner";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend);

const FormMetrics = () => {
  const {
    searchSchoolData,
    exportData,
    overallLoading,
    handleChange,
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
    getExport,
    getResponseGroups,
    shouldReload,
    currentSchoolIndex,
    exportLoading,
    searchTeacherData

  } = useAppContext();

  const { t, i18n } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [exportClicked, setExportClicked] = useState(false);

  const [isOverall, setIsOverall] = useState(false);

  const [school, setSchool] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [questionsToAnswers, setQuestionsToAnswers] = useState({});
  const [responseType, setResponseType] = useState({});
  const [numberOfResponses, setNumberOfResponses] = useState(0);

  const { formCode } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const queryString = location.search
  const params = new URLSearchParams(queryString);
  const queryObject = {};
  params.forEach((value, key) => {
      queryObject[key] = value;
  });


  useEffect(() => {
    setResponseType(queryObject)
  }, [queryObject]);
  
  let formTypeForName = null;
  let whenForName = null;




  useEffect(() => {
    if (exportClicked && exportData && exportData != []) {
      const worksheet = XLSXUtils.json_to_sheet(exportData);
      const workbook = XLSXUtils.book_new();
      XLSXUtils.book_append_sheet(workbook, worksheet, "Sheet1");
      writeXLSXFile(workbook, `data.xlsx`);
      handleChange(exportData, []);
      setExportClicked(false);
    }
  }, [exportData, exportClicked]);

  const createExcelSheet = async () => {
    setExportClicked(true);
    if (location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      formTypeForName = urlParams.get("formType");
      whenForName = urlParams.get("when");
      await getExport(location.search, formCode);
    } else {
      await getExport(false, null);
    }
  };



  const createQuestionsToAnswersMap = (
    isNewForm,
    array,
    questionsToAnswers
  ) => {
    let reorderedQuestionsToAnswers = {};
    array.forEach((question) => {
      if (questionsToAnswers.hasOwnProperty(isNewForm?question.name:question.question)) {
        
        if (isNewForm) {
          // Find the current question object that matches by name
          const currentQuestion = array.find(
            (each) => each.name === question.name
          );
          if (currentQuestion) {
            const answerCodes = Object.keys(
              questionsToAnswers[question.name]
            );

            answerCodes.forEach((code) => {
              // Check if the current question has the matching code
              const matchingAnswer = currentQuestion.answers.find(
                (answer) => answer.code.toString() === code
              );

              if (matchingAnswer) {
                // Map the matching code's data to the current question
                if (!reorderedQuestionsToAnswers[currentQuestion.question]) {
                  reorderedQuestionsToAnswers[currentQuestion.question] = {};
                }
                
                reorderedQuestionsToAnswers[currentQuestion.question][
                  matchingAnswer.text
                ] = questionsToAnswers[question.name][code];
              }
            });
          }
        } else {
          // For older forms, simply map questions directly
          reorderedQuestionsToAnswers[question.question] =
            questionsToAnswers[question.question];
        }
      }
    });
    setQuestionsToAnswers(reorderedQuestionsToAnswers);
    
    setIsLoading(false)
  };




  const formTimeType = (formType, when, data) => {
    const isInt = (value) => {
      return Number.isInteger(Number(value));
    };

    let formAnswers = Object.values(data);
    let isNewForm = isInt(Object.keys(formAnswers[0])[0]);

    if (formType === "You and Me Vape Free (middle school and above)") {
      return isNewForm
        ? createQuestionsToAnswersMap(isNewForm, tobacco24, data)
        : when === "before"
        ? createQuestionsToAnswersMap(isNewForm, tobacco, data)
        : createQuestionsToAnswersMap(
            isNewForm,
            tobacco.concat(postTobacco),
            data
          );
    } else if (formType === "You and Me, Together Vape-Free(elem)") {
      return isNewForm
        ? createQuestionsToAnswersMap(isNewForm, tobaccoElem24, data)
        : when === "before"
        ? createQuestionsToAnswersMap(isNewForm, tobaccoElem, data)
        : createQuestionsToAnswersMap(
            isNewForm,
            tobaccoElem.concat(postTobacco),
            data
          );
    } else if (
      formType === "Smart Talk: Cannabis Prevention & Education Awareness"
    ) {
      return isNewForm
        ? createQuestionsToAnswersMap(isNewForm, cannabis24, data)
        : when === "before"
        ? createQuestionsToAnswersMap(isNewForm, cannabis, data)
        : createQuestionsToAnswersMap(
            isNewForm,
            cannabis.concat(postCannabis),
            data
          );
    }
    else if (
      formType === "Smart Talk: Cannabis Prevention & Education Awareness(elem)"
    ) {
      return isNewForm
        ? createQuestionsToAnswersMap(isNewForm, cannabisElem24, data)
        : when === "before"
        ? createQuestionsToAnswersMap(isNewForm, cannabis, data)
        : createQuestionsToAnswersMap(
            isNewForm,
            cannabis.concat(postCannabis),
            data
          );
    } else if (formType === "Safety First") {
      return isNewForm
        ? createQuestionsToAnswersMap(isNewForm, safety24, data)
        : createQuestionsToAnswersMap(isNewForm, safety, data);
    } else if (formType === "Healthy Futures: Tobacco/Nicotine/Vaping") {
      return isNewForm
        ? createQuestionsToAnswersMap(
            isNewForm,
            healthy24.concat(nicQuitQuestion).concat(healthyTobacco24),
            data
          )
        : createQuestionsToAnswersMap(isNewForm, healthy, data);
    } else if (formType === "Healthy Futures: Cannabis") {
      return isNewForm
        ? createQuestionsToAnswersMap(
            isNewForm,
            healthy24.concat(canQuitQuestion).concat(healthyCannabis24),
            data
          )
        : createQuestionsToAnswersMap(isNewForm, healthy, data);
    }
  };




  let metadata_keys = new Set(["teacher", "school", "county", "district", "state", 'city', 'curriculum', 'date', 'grade', 'period', 'pre_post'])
  
  useEffect(() => {
    if (isOverall) {
      getResponseGroups(currentSchoolIndex, shouldReload, true, true);
    }
    else{getExport(location.search, formCode)}
  }, [isOverall]);


  useEffect(() => {
    let structuredData = {}
    if (!location.search) {
      setIsOverall(true);
      exportData?.map((response=>{
        for (const [question, answer] of Object.entries(response)) {
          if (!metadata_keys.has(question)) { // Exclude metadata fields
              if (!structuredData[question]) {
                  structuredData[question] = {}; // Initialize dictionary for responses
              }
              structuredData[question][answer] = (structuredData[question][answer] || 0) + 1; // Count responses
          }
      }
      }))
      if (exportData){
        setNumberOfResponses(exportData.length)
        formTimeType(
          searchType,
          searchBeforeAfter,
          structuredData
        );
      }
    }
    if (location.search) {
      exportData?.map((response=>{
        for (const [question, answer] of Object.entries(response)) {
          if (!metadata_keys.has(question)) { // Exclude metadata fields
              if (!structuredData[question]) {
                  structuredData[question] = {}; // Initialize dictionary for responses
              }
              structuredData[question][answer] = (structuredData[question][answer] || 0) + 1; // Count responses
          }
      }
      }))
      if (Object.keys(structuredData).length > 0){
        setNumberOfResponses(exportData.length)
        setSchool(searchSchoolData)
        setTeacher(searchTeacherData)
        formTimeType(
          searchType,
          searchBeforeAfter,
          structuredData
        );
      }
    }
  }, [exportData]);

  if (isLoading || overallLoading)
    return (
      <div>
        {isOverall ? (
          <p>
            {t(
              "may_take_awhile_retrieving_data",
              "This may take a while. We have to retrieve all your data"
            )}
          </p>
        ) : null}
        <Loading center />
      </div>
    );
  return (
    <Wrapper style={{ maxWidth: "800px" }}>
      {isOverall ? (
        <>
          <header>
            <div className="info">
              <h3>{t("overall_form_metrics", "Overall Form Metrics")}</h3>
            </div>
          </header>

          <div className="content">
            <button
              className="btn"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => createExcelSheet()}
            >
              <span className="icon-css">
                <BiExport />
              </span>
              {exportLoading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "10px",
                  }}
                >
                  <p style={{ margin: 0 }}>{t("UP_exporting", "Exporting")}</p>
                  <ThreeDots
                    color="white"
                    height={20}
                    width={20}
                    style={{ marginLeft: "10px" }}
                  />
                </div>
              ) : (
                t("export_to_excel", "Export To Excel")
              )}
            </button>

            <div className="content-center">
              <ResponseGroupInfo
                icon={<AiOutlineNumber />}
                text={`${numberOfResponses} ${t("responses", "responses")}`}
              />
              <div>
                <ResponseGroupInfo
                  icon={<FaLocationArrow />}
                  text={
                    searchState === "all"
                      ? t("all_states", "All states") + ","
                      : searchState + ","
                  }
                />
                <ResponseGroupInfo
                  text={
                    searchCounty === "all"
                      ? t("all_counties", "All counties") + ","
                      : searchCounty + ","
                  }
                />
                <ResponseGroupInfo
                  text={
                    searchCity === "all"
                      ? t("all_cities", "All cities") + ","
                      : searchCity + ","
                  }
                />
                <ResponseGroupInfo
                  text={
                    searchDistrict === "all"
                      ? t("all_districts", "All districts") + ","
                      : searchDistrict + ","
                  }
                />
                <ResponseGroupInfo
                  text={
                    searchSchool === "all"
                      ? t("all_schools", "All schools")
                      : searchSchool
                  }
                />
              </div>
              <ResponseGroupInfo
                icon={<FaChalkboardTeacher />}
                text={
                  searchTeacher === "all"
                    ? t("all_teachers", "All teachers")
                    : searchTeacher
                }
              />
              <ResponseGroupInfo
                icon={<TbListNumbers />}
                text={
                  searchPeriod === "all"
                    ? t("all_periods", "All periods")
                    : t("period", "Period") + " " + searchPeriod
                }
              />
              <ResponseGroupInfo
                icon={<TbNumbers />}
                text={
                  searchGrade === "all"
                    ? t("all_grades", "All grades")
                    : t("grade", "Grade") + " " + searchGrade
                }
              />
              <ResponseGroupInfo
                icon={<AiOutlineForm />}
                text={
                  searchType === "all"
                    ? t("all_types", "All types")
                    : searchType
                }
              />
              <ResponseGroupInfo
                icon={<FaRegCalendarAlt />}
                text={
                  searchBeforeAfter === "all"
                    ? t("before_and_after", "Before and after")
                    : searchBeforeAfter
                }
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <header>
            <div className="info">
              <h3>{school.school}</h3>
              <h4>
                {school.city}, {school.state}
              </h4>
            </div>
          </header>
          <div className="content">
            <div className="content-center">
              <button
                className="btn"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => createExcelSheet()}
              >
                <span className="icon-css">
                  <BiExport />
                </span>
                {exportLoading ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "10px",
                    }}
                  >
                    <p style={{ margin: 0 }}>
                      {t("UP_exporting", "Exporting")}
                    </p>
                    <ThreeDots
                      color="white"
                      height={20}
                      width={20}
                      style={{ marginLeft: "10px" }}
                    />
                  </div>
                ) : (
                  t("export_to_excel", "Export To Excel")
                )}
              </button>
              <ResponseGroupInfo
                icon={<FaChalkboardTeacher />}
                text={teacher.name}
              />
              <ResponseGroupInfo
                icon={<AiOutlineNumber />}
                text={`${numberOfResponses} response(s)`}
              />
              <ResponseGroupInfo
                icon={<TbListNumbers />}
                text={
                  responseType?.period && responseType?.period !== "No Period"
                    ? t("UP_period", "Period") + " " + responseType.period
                    : t("no_specified_period", "No specified period")
                }
              />
              <ResponseGroupInfo
                icon={<TbNumbers />}
                text={t("UP_grade", "Grade") + " " + responseType.grade}
              />
              <ResponseGroupInfo
                icon={<AiOutlineForm />}
                text={responseType.formType}
              />
              <ResponseGroupInfo
                icon={<FaRegCalendarAlt />}
                text={responseType.when}
              />
            </div>
          </div>
        </>
      )}
      {exportData?.length === 0 && isOverall ? (
        <h3>No responses yet</h3>
      ) :
      (
        
        
        <>
          <div className="content">
            <div className="content-center">
              {Object.keys(questionsToAnswers).map((question, index) => {
                const backgroundColors = [
                  "#3be320",
                  "#99e018",
                  "#e4ee1b",
                  "#ecb533",
                  "#e56a16",
                  "#e7420e",
                ];

                const newBackgroundColors = [];

                Object.keys(questionsToAnswers[question])
                  .sort()
                  .forEach((answer, index) => {
                    newBackgroundColors.push(
                      backgroundColors[index % backgroundColors.length]
                    );
                  });

                return (
                  <div key={index}>
                    <h5 style={{ padding: "1rem 0" }}>{question}</h5>
                    <div className="chartCanvas">
                      <Doughnut
                        data={{
                          labels: Object.keys(questionsToAnswers[question]),
                          datasets: [
                            {
                              label: t(
                                "how_many_gave_this_answer",
                                "How many gave this answer"
                              ),
                              data: Object.values(questionsToAnswers[question]),
                              backgroundColor: newBackgroundColors,
                              borderWidth: 1,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {},
                        }}
                      />
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      <footer>
        <button className="btn btn-block" onClick={() => navigate("/metrics")}>
          {t("go_back", "Go Back")}
        </button>
      </footer>
    </Wrapper>
  );
};

export default FormMetrics;
