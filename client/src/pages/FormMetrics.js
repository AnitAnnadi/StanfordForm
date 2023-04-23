import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie, Doughnut } from "react-chartjs-2";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Loading } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import ResponseGroupInfo from "../components/ResponseGroupInfo";
import { FaChalkboardTeacher, FaRegCalendarAlt } from "react-icons/fa";
import { AiOutlineForm, AiOutlineNumber } from "react-icons/ai";
import { TbListNumbers, TbNumbers } from "react-icons/tb";

ChartJS.register(ArcElement, Tooltip, Legend);

const dynamicColors = () => {
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
};

const FormMetrics = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [school, setSchool] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [questionsToAnswers, setQuestionsToAnswers] = useState({});
  const [responseType, setResponseType] = useState({});

  const { formCode } = useParams();
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const queryParameters = new URLSearchParams(location.search);

    fetch(`/api/v1/form/${formCode}?${queryParameters.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setSchool(data.school);
        setTeacher(data.teacher);
        setQuestionsToAnswers(data.questionsToAnswers);
        setResponseType(data.responseType);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, [formCode, location.search]);

  if (isLoading) return <Loading center />;

  return (
    <Wrapper style={{ maxWidth: "800px" }}>
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
          <ResponseGroupInfo icon={<AiOutlineNumber />} text={formCode} />
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
      <div className="content">
        <div className="content-center">
          {Object.keys(questionsToAnswers).map((question, index) => (
            <div key={index}>
              <h5 style={{ padding: "1rem 0" }}>{question}</h5>
              <div className="chartCanvas">
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
                    plugins: {
                      legend: {
                        position: "right",
                      },
                    },
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
      <footer>
        <button className="btn btn-block" onClick={() => navigate(-1)}>
          Go back
        </button>
      </footer>
    </Wrapper>
  );
};

export default FormMetrics;
