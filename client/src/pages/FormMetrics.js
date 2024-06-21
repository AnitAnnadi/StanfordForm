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
import { utils as XLSXUtils, writeFile as writeXLSXFile } from 'xlsx';
import { tobaccoElem, tobacco, postTobacco, cannabis, postCannabis, safety, healthy
} from "../utils/questions";
import { ThreeDots } from 'react-loader-spinner';
import {useTranslation} from "react-i18next";



ChartJS.register(ArcElement, Tooltip, Legend);

const FormMetrics = () => {
  const {
    responseGroups,
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
    exportData,
    getResponseGroups,
    shouldReload,
    currentSchoolIndex,
    exportLoading
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
  let reorderedQuestionsToAnswers = {};

  const { formCode } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  let data =[]
  let formTypeForName = null
  let whenForName = null

  useEffect(() => {
    if (exportClicked && exportData && exportData!=[]) {
      const worksheet = XLSXUtils.json_to_sheet(exportData);
      const workbook = XLSXUtils.book_new();
      XLSXUtils.book_append_sheet(workbook, worksheet, "Sheet1");
      writeXLSXFile(workbook, `data.xlsx`);
      handleChange(exportData,[])
      setExportClicked(false);
    }
  }, [exportData, exportClicked]);

  const createExcelSheet = async () => {
    
    setExportClicked(true)
    if (location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      formTypeForName = urlParams.get("formType");
      whenForName = urlParams.get("when");
      await getExport(location.search, formCode);
    } else {
      await getExport(false, null);
    }
  
  };


  // NOTE: old responses with older versions of the form will not have the same questions as the current form leading
  // to the results not rendering due to this funciton.
  const createQuestionsToAnswersMap = (array, questionsToAnswers) => {
    reorderedQuestionsToAnswers = {};
    array.forEach((question) => {
      if ((questionsToAnswers).hasOwnProperty(question.question)) {
        reorderedQuestionsToAnswers[question.question] = questionsToAnswers[question.question];
      }
    });
    console.log(reorderedQuestionsToAnswers)
    setQuestionsToAnswers(reorderedQuestionsToAnswers);
  };

  const formTimeType = (formType, when, data) => {
    console.log(formType === "You and Me, Together Vape-Free(elem)")
    if (formType === "You and Me Vape Free (middle school and above)") {
      return when === "before" ? createQuestionsToAnswersMap(tobacco, data) : createQuestionsToAnswersMap(tobacco.concat(postTobacco), data);
    } 
    else if(formType === "You and Me, Together Vape-Free(elem)") {
      return when === "before" ? createQuestionsToAnswersMap(tobaccoElem, data) : createQuestionsToAnswersMap(tobaccoElem.concat(postTobacco), data);
    } 
    else if (formType === "Smart Talk: Cannabis Prevention & Education Awareness") {
      return when === "before" ? createQuestionsToAnswersMap(cannabis, data) : createQuestionsToAnswersMap(cannabis.concat(postCannabis),data);
    }
    else if (formType === "Safety First"){
      return createQuestionsToAnswersMap(safety, data)
    }
    else if (formType === "Healthy Futures: Tobacco/Nicotine/Vaping"){
      return createQuestionsToAnswersMap(healthy, data)
    }
    else if (formType === "Healthy Futures: Cannabis"){
      return createQuestionsToAnswersMap(healthy, data)
    }
  };


  useEffect(()=>{
    if (isOverall){
      getResponseGroups(currentSchoolIndex,shouldReload, false, true);
    }
  },[isOverall])

  useEffect(() => {
    let combinedQuestionsToAnswers = {};
  
    const fetchDataForResponseGroups = () => {
      // getResponseGroups(currentSchoolIndex,shouldReload, false, true)
      return Promise.all(
        responseGroups.map((responseGroup) => {
          const { school, uniqueResponseType } = responseGroup;
          const queryParameters = new URLSearchParams({
            noCode: uniqueResponseType?.noCode,
            teacherId: school.teacher,
            schoolId: school?._id,
            period: uniqueResponseType.period,
            grade: uniqueResponseType.grade,
            formType: uniqueResponseType.formType,
            when: uniqueResponseType.when,
            school: school.school,
            state: school.state,
            city: school.city,
            county: school.county,
            district: school.district,
          });
  
          return fetch(`/api/v1/form/${uniqueResponseType.formCode}?${queryParameters.toString()}`)
            .then((res) => res.json());
        })
      );
    };
  
    if (!location.search) {
      console.log('1')
      setIsOverall(true);
      setIsLoading(true);
      
      fetchDataForResponseGroups()
        .then((responses) => {
          // console.log(responses)
          responses.forEach((data) => {
            const currentQuestionsToAnswers = data.questionsToAnswers;
            Object.keys(currentQuestionsToAnswers).forEach((question) => {
              if (!combinedQuestionsToAnswers[question]) {
                combinedQuestionsToAnswers[question] = currentQuestionsToAnswers[question];
              } else {
                // Add the counts of each answer from the current response to the combinedQuestionsToAnswers
                const currentAnswers = currentQuestionsToAnswers[question];
                const combinedAnswers = combinedQuestionsToAnswers[question];
                Object.keys(currentAnswers).forEach((answer) => {
                  combinedAnswers[answer] = (combinedAnswers[answer] || 0) + currentAnswers[answer];
                });
              }
            });
          });
          // Calculate the total number of responses
          const totalResponses = responses.reduce((total, data) => total + data.numberOfResponses, 0);
          setNumberOfResponses(totalResponses);
          formTimeType(searchType, searchBeforeAfter, combinedQuestionsToAnswers )
          // setQuestionsToAnswers(combinedQuestionsToAnswers);
          setIsLoading(false);
        })
        .catch((error) => console.error(error));
    } 
    
    else {
      setIsOverall(false);
      setIsLoading(true);
      const queryParameters = new URLSearchParams(location.search);

      const formType = queryParameters.get("formType");
      const when = queryParameters.get("when");
      fetch(`/api/v1/form/${formCode}?${queryParameters.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          setSchool(data.school);
          setTeacher(data.teacher);
          formTimeType(formType, when, data.questionsToAnswers)
          setNumberOfResponses(data.numberOfResponses);
          setResponseType(data.responseType);
        })
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false));
    }
  }, [location.search, formCode, responseGroups]);
      
  if (isLoading || overallLoading) return (
  <div>
    {isOverall?<p>
      {t('may_take_awhile_retrieving_data', 'This may take a while. We have to retrieve all your data')}
    </p>:null}
  <Loading center />
  </div>
  
  );

  return (
    <Wrapper style={{ maxWidth: "800px" }}>
      {isOverall ? (
        <>
          <header>
            <div className="info">
              <h3>
                {t('overall_form_metrics', 'Overall Form Metrics')}</h3>
            </div>
          </header>
          
          <div className="content">
          <button
            className="btn"
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            onClick={() => createExcelSheet()}
          >
            <span className="icon-css">
              <BiExport />
            </span>
            {exportLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                <p style={{ margin: 0 }}>{t('UP_exporting', "Exporting")}</p>
                <ThreeDots color="white" height={20} width={20} style={{ marginLeft: '10px' }} />
              </div>
            ) : (
              t('export_to_excel', "Export To Excel")
            )}
          </button>

            <div className="content-center">
              <ResponseGroupInfo
                icon={<AiOutlineNumber />}
                text={`${numberOfResponses} ${t('responses', 'responses')}`}
              />
              <div >
                <ResponseGroupInfo
                  icon={<FaLocationArrow />}
                  text={
                    searchState === "all" ? t('all_states', 'All states') + ',' : searchState + ","
                  }
                />
                <ResponseGroupInfo
                  text={
                    searchCounty === "all"
                      ? t('all_counties', 'All counties') + ","
                      : searchCounty + ","
                  }
                />
                <ResponseGroupInfo
                  text={
                    searchCity === "all" ? t('all_cities', 'All cities') + "," : (searchCity + ",")
                  }
                />
                <ResponseGroupInfo
                  text={
                    searchDistrict === "all"
                      ? t('all_districts', 'All districts') + ","
                      : searchDistrict + ","
                  }
                />
                <ResponseGroupInfo
                  text={searchSchool === "all" ? t('all_schools', 'All schools') : searchSchool}
                />
              </div>
              <ResponseGroupInfo
                icon={<FaChalkboardTeacher />}
                text={searchTeacher === "all" ? t('all_teachers', 'All teachers') : searchTeacher}
              />
              <ResponseGroupInfo
                icon={<TbListNumbers />}
                text={
                  searchPeriod === "all"
                    ? t('all_periods', 'All periods')
                    : t('period', 'Period') + " " + searchPeriod
                }
              />
              <ResponseGroupInfo
                icon={<TbNumbers />}
                text={
                  searchGrade === "all" ?
                  t('all_grades', 'All grades') :
                  t('grade', 'Grade') + " " + searchGrade
                }
              />
              <ResponseGroupInfo
                icon={<AiOutlineForm />}
                text={searchType === "all" ? t('all_types', 'All types') : searchType}
              />
              <ResponseGroupInfo
                icon={<FaRegCalendarAlt />}
                text={
                  searchBeforeAfter === "all"
                    ? t('before_and_after', 'Before and after')
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
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            onClick={() => createExcelSheet()}
          >
            <span className="icon-css">
              <BiExport />
            </span>
            {exportLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                <p style={{ margin: 0 }}>{t('UP_exporting', "Exporting")}</p>
                <ThreeDots color="white" height={20} width={20} style={{ marginLeft: '10px' }} />
              </div>
            ) : (
              t('export_to_excel',
              "Export To Excel")
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
              {/* {console.log(responseType)} */}
              <ResponseGroupInfo
                icon={<TbListNumbers />}
                text={
                  (responseType?.period) && (responseType?.period !== "No Period")
                    ? t('UP_period', 'Period') + " " + responseType.period
                    : t('no_specified_period', 'No specified period')
                }
              />
              <ResponseGroupInfo
                icon={<TbNumbers />}
                text={t('UP_grade', "Grade") + " " + responseType.grade}
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
      {responseGroups.length === 0 && isOverall ? (
        <h3>No responses yet</h3>
      ) : (
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
                ]

                const newBackgroundColors = []

                Object.keys(questionsToAnswers[question]).sort().forEach((answer, index) => {
                  newBackgroundColors.push(backgroundColors[index % backgroundColors.length])
                })

                return (
                  <div key={index}>
                    <h5 style={{ padding: "1rem 0" }}>{question}</h5>
                    <div className="chartCanvas" >
                      <Doughnut
                        data={{
                          labels: Object.keys(questionsToAnswers[question]),
                          datasets: [
                            {
                              label: t('how_many_gave_this_answer', 'How many gave this answer'),
                              data: Object.values(questionsToAnswers[question]),
                              backgroundColor: newBackgroundColors,
                              borderWidth: 1,
                            }
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {},
                        }}
                      />
                    </div>
                    {/*{Object.keys(questionsToAnswers[question]).map((answer, index) => (*/}
                    {/*  <div key={index}>*/}
                    {/*    <p>{`Answer: ${answer}`}</p>*/}
                    {/*    <p>{`How many gave this answer: ${questionsToAnswers[question][answer]}`}</p>*/}
                    {/*  </div>*/}
                    {/*))}*/}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      <footer>
        <button className="btn btn-block" onClick={() => navigate("/metrics")}>
          {t('go_back', 'Go Back')}
        </button>
      </footer>
    </Wrapper>
  );
};

export default FormMetrics;