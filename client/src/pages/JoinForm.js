import { useState } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Logo2 from "../assets/images/logo.png";

import { useNavigate } from "react-router-dom";

const JoinForm = () => {
  const {
    user,
    showAlert,
    teacher,
    displayAlert,
    updateLocation,
    isLoading,
    enterCode,
    successAlert,
  } = useAppContext();

  const navigate = useNavigate();


  let teacher_name = localStorage.getItem("teacher_name");
  const [form, setForm] = useState("default");
  const [grade, setGrade] = useState("default");
  const [when, setWhen] = useState("default");
  const [school, setSchool] = useState("default");
  const [period, setPeriod] = useState("default");
  let location = useLocation();
  let info = location.state;
  let grades = ["K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let periods = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let schools = null;

  if (!info["noCode"]){
    schools = info["schools"];
  }

  const MultipleSchools = () => {
    if (schools.length > 1) {
      return (
        <div>
          <h4 className="form-title">School Name</h4>
          <select
            name="school"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="form-select"
          >
            <option value={"default"} disabled>
              Choose your School
            </option>
            {schools.map((school, index) => {
              return (
                <option key={index} value={school["school"]}>
                  {school["school"]}
                </option>
              );
            })}
          </select>
        </div>
      );
    } else {
      setSchool(schools[0]["school"]);
    }
  };
  let current = "";
  const MultiplePeriods = () => {
    schools.map((each) => {
      if (each["school"] === school) {
        current = each;
      }
    });
    if (current["multiplePeriods"]) {
      return (
        <div>
          <h4 className="form-title">Period</h4>
          <select
            name="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="form-select"
          >
            <option value={"default"} disabled>
              Choose your Period
            </option>
            {periods.map((period, index) => {
              return (
                <option key={index} value={period}>
                  {period}
                </option>
              );
            })}
          </select>
        </div>
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (info["noCode"]){
      if (
        form !== "default" &&
        grade !== "default" &&
        when !== "default" 
      ) {
        let county = info["county"]
        let school = info["school"]
        let district = info["district"]
        let state = info["state"]
        let city = info["city"]
        let noCode= info["noCode"]
        successAlert("Redirecting...");
        setTimeout(() => {
          navigate("/form", {
            state: {
              form,
              grade,
              when,
              school,
              state,
              county,
              district,
              city,
              noCode
            },
          });
        }, 3000);
      } else {
        displayAlert();
      }
    }
    else{
    if (
      form !== "default" &&
      grade !== "default" &&
      when !== "default" &&
      school !== "default"
    ) {
      successAlert("Redirecting...");
      setTimeout(() => {
        navigate("/form", {
          state: {
            form,
            grade,
            when,
            school,
            period,
          },
        });
      }, 3000);
    } else {
      displayAlert();
    }
  }
  };
  return (
    <div
      className="full-page"
      style={{ display: "flex", alignItems: "center", padding: "0 1.5rem" }}
    >
      <Wrapper>
        <form className="form" onSubmit={handleSubmit}>
          {showAlert && <Alert />}
          {info["noCode"]?null:
          <h4>You have joined {teacher_name}'s class</h4>}
          <div className="form">
            {info["noCode"]?null
            :
            <div>
            <MultipleSchools />
            <MultiplePeriods />
            </div>}
            <h4 className="form-title">Grade Level</h4>
            <select
              name="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="form-select"
            >
              <option value={"default"} disabled>
                Grade Level
              </option>
              {grades.map((grade, index) => {
                return (
                  <option key={index} value={grade}>
                    {grade}
                  </option>
                );
              })}
            </select>

            <h4 className="form-title">Form Type</h4>
            <select
              name="type"
              value={form}
              onChange={(e) => setForm(e.target.value)}
              className="form-select"
            >
              <option value={"default"} disabled>
                Choose your Form
              </option>
              <option value={"You and Me, Together Vape-Free"}>
                You and Me, Together Vape-Free
              </option>
              <option
                value={"Smart Talk: Cannabis Prevention & Education Awareness"}
              >
                Smart Talk: Cannabis Prevention & Education Awareness
              </option>
              <option value={"Safety First"}>
                Safety First
              </option>
              {!info["noCode"]?null:
              <div>
              <option
                value={"Healthy Futures: Tabacco/Nicotine/Vaping"}
              >
                Healthy Futures: Tabacco/Nicotine/Vaping
              </option>
              <option
                value={"Healthy Futures: Cannabis"}
              >
                Healthy Futures: Cannabis
              </option>
              </div>
}

            </select>

            <h4 className="form-title">When are you taking this form</h4>
            <select
              name="when"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className="form-select"
            >
              <option value={"default"} disabled>
                Choose When
              </option>
              <option value={"before"}>Before Lesson</option>
              <option value={"after"}>After Lesson</option>
            </select>

            <button
              className="btn btn-block"
              type="submit"
              // disabled={isLoading}
              style={{ marginTop: "1.38rem" }}
            >
              submit
              {/* {isLoading ? "Please Wait..." : "submit"} */}
            </button>
          </div>
        </form>
      </Wrapper>
      <img width="200" height="100" src={Logo2} className="corner-logo" />
    </div>
  );
};

export default JoinForm;
