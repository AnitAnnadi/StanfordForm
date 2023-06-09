import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie, Doughnut } from "react-chartjs-2";
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

ChartJS.register(ArcElement, Tooltip, Legend);

const FormMetrics = () => {
  const {
    responseGroups,
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
  } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);

  const [isOverall, setIsOverall] = useState(false);

  const [school, setSchool] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [questionsToAnswers, setQuestionsToAnswers] = useState({});
  const [responseType, setResponseType] = useState({});
  const [numberOfResponses, setNumberOfResponses] = useState(0);

  const { formCode } = useParams();
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    if (!location.search) {
      console.log("No location search");
      setIsOverall(true);

      responseGroups.forEach((responseGroup) => {
        const { school, uniqueResponseType } = responseGroup;

        const queryParameters = new URLSearchParams({
          teacherId: school.teacher,
          schoolId: school._id,
          period: uniqueResponseType.period,
          grade: uniqueResponseType.grade,
          formType: uniqueResponseType.formType,
          when: uniqueResponseType.when,
        });

        fetch(
          `/api/v1/form/${
            uniqueResponseType.formCode
          }?${queryParameters.toString()}`
        )
          .then((res) => res.json())
          .then((data) => {
            setQuestionsToAnswers(data.questionsToAnswers);
            setNumberOfResponses(data.numberOfResponses);
          })
          .catch((error) => console.error(error));
      });

      setIsLoading(false);
    } else {
      console.log("No location search");
      setIsOverall(false);

      const queryParameters = new URLSearchParams(location.search);

      fetch(`/api/v1/form/${formCode}?${queryParameters.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          setSchool(data.school);
          setTeacher(data.teacher);
          setQuestionsToAnswers(data.questionsToAnswers);
          setNumberOfResponses(data.numberOfResponses);
          setResponseType(data.responseType);
          setIsLoading(false);
        })
        .catch((error) => console.error(error));
    }
  }, [formCode, location.search, responseGroups]);

  if (isLoading) return <Loading center />;

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
