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
import { tobacco, postTobacco, cannabis, postCannabis, safety, healthy
} from "../utils/questions";


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

  

  const createQuestionsToAnswersMap = (array, questionsToAnswers) => {
    reorderedQuestionsToAnswers = {};
    array.forEach((question) => {
      if ((questionsToAnswers).hasOwnProperty(question.question)) {
        reorderedQuestionsToAnswers[question.question] = questionsToAnswers[question.question];
      }
    });
    setQuestionsToAnswers(reorderedQuestionsToAnswers);
  };

  const formTimeType = (formType, when, data) => {
    if (formType === "You and Me, Together Vape-Free") {
      return when === "before" ? createQuestionsToAnswersMap(tobacco, data) : createQuestionsToAnswersMap(tobacco.concat(postTobacco), data);
    } else if (formType === "Smart Talk: Cannabis Prevention & Education Awareness") {
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
            teacherId: school.teacher,
            schoolId: school._id,
            period: uniqueResponseType.period,
            grade: uniqueResponseType.grade,
            formType: uniqueResponseType.formType,
            when: uniqueResponseType.when,
            overallBreakdown:true
          });
  
          return fetch(`/api/v1/form/${uniqueResponseType.formCode}?${queryParameters.toString()}`)
            .then((res) => res.json());
        })
      );
    };
  
    if (!location.search) {
      setIsOverall(true);
      setIsLoading(true);
      
      fetchDataForResponseGroups()
        .then((responses) => {
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
    {isOverall?<p >This may take a while. We have to retrieve all your data</p>:null}
  <Loading center />
  </div>
  
  );

  return (
    <Wrapper style={{ maxWidth: "800px" }}>
      {isOverall ? (
        <>
          <header>
            <div className="info">
              <h3>Overall Form Metrics</h3>
            </div>
          </header>
          
          <div className="content">
          <button
              className="btn"
              style={{ display: "flex" }}
              onClick={() => createExcelSheet()}
            >
              <span className="icon-css">
                <BiExport />
              </span>
              {exportLoading?"Exporting...":"Export To Excel"}
            </button>
            <div className="content-center">
              <ResponseGroupInfo
                icon={<AiOutlineNumber />}
                text={`${numberOfResponses} response(s)`}
              />
              <div >
                <ResponseGroupInfo
                  icon={<FaLocationArrow />}
                  text={
                    searchState === "all" ? "All states," : searchState + ","
                  }
                />
                <ResponseGroupInfo
                  text={
                    searchCounty === "all"
                      ? "All counties,"
                      : searchCounty + ","
                  }
                />
                <ResponseGroupInfo
                  text={
                    searchCity === "all" ? "All cities," : (searchCity + ",")
                  }
                />
                <ResponseGroupInfo
                  text={
                    searchDistrict === "all"
                      ? "All districts,"
                      : searchDistrict + ","
                  }
                />
                <ResponseGroupInfo
                  text={searchSchool === "all" ? "All schools" : searchSchool}
                />
              </div>
              <ResponseGroupInfo
                icon={<FaChalkboardTeacher />}
                text={searchTeacher === "all" ? "All teachers" : searchTeacher}
              />
              <ResponseGroupInfo
                icon={<TbListNumbers />}
                text={
                  searchPeriod === "all"
                    ? "All periods"
                    : "Period " + searchPeriod
                }
              />
              <ResponseGroupInfo
                icon={<TbNumbers />}
                text={
                  searchGrade === "all" ? "All grades" : "Grade " + searchGrade
                }
              />
              <ResponseGroupInfo
                icon={<AiOutlineForm />}
                text={searchType === "all" ? "All types" : searchType}
              />
              <ResponseGroupInfo
                icon={<FaRegCalendarAlt />}
                text={
                  searchBeforeAfter === "all"
                    ? "Before and after"
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
              style={{ display: "flex" }}
              onClick={() => createExcelSheet()}
            >
              <span className="icon-css">
                <BiExport />
              </span>
              {exportLoading?"Exporting...":"Export To Excel"}
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
                  responseType?.period
                    ? "Period " + responseType.period
                    : "No specified period"
                }
              />
              <ResponseGroupInfo
                icon={<TbNumbers />}
                text={"Grade " + responseType.grade}
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
              {Object.keys(questionsToAnswers).map((question, index) => (
                
                <div key={index}>
                  <h5 style={{ padding: "1rem 0" }}>{question}</h5>
                  <div className="chartCanvas" >
                    <Doughnut
                      data={{
                        labels: Object.keys(questionsToAnswers[question]),
                        datasets: [
                          {
                            label: "How many gave this answer",
                            data: Object.values(questionsToAnswers[question]),
                            // backgroundColor: Object.keys(
                            //   questionsToAnswers[question]
                            // ).map(() => dynamicColors()),
                            backgroundColor: [
                              "#d0203f",
                              "#A2C3DB",
                              "#8871A0",
                              "#8AAF22",
                              "#DCB12D",
                              "#3F9F9F",
                            ],
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
                  {/*{Object.keys(questionsToAnswers[question]).map((answer, index) => (*/}
                  {/*  <div key={index}>*/}
                  {/*    <p>{`Answer: ${answer}`}</p>*/}
                  {/*    <p>{`How many gave this answer: ${questionsToAnswers[question][answer]}`}</p>*/}
                  {/*  </div>*/}
                  {/*))}*/}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      <footer>
        <button className="btn btn-block" onClick={() => navigate("/metrics")}>
          Go back
        </button>
      </footer>
    </Wrapper>
  );
};

export default FormMetrics;