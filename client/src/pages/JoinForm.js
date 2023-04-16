import { useState } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
  } = useAppContext();

  const navigate = useNavigate();

  let teacher_name = localStorage.getItem("teacher_name");
  const [form, setForm] = useState("default");
  const [grade, setGrade] = useState("default");
  const [when, setWhen] = useState("default");
  const [school, setSchool] = useState("default");
  const [period, setPeriod] = useState();
  let location = useLocation();
  let schools = location.state;
  let grades = ["K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let periods = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  schools = schools["schools"];
  function MultipleSchools() {
    if (schools.length > 1) {
      return (
        <div>
          <h4 className="form-title">School Name</h4>
          <select
            name="school"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            selected
            className="form-select"
          >
            <option value={"default"} disabled selected>
              Choose your School
            </option>
            {schools.map((school) => {
              return (
                <option value={school["school"]}>{school["school"]}</option>
              );
            })}
          </select>
        </div>
      );
    } else {
      // console.log(schools[0]["school"])
      setSchool(schools[0]["school"]);
    }
  }
  let current = "";
  function MultiplePeriods() {
    schools.map((each) => {
      if (each["school"] === school) {
        current = each;
      }
    });
    if (current["multiplePeriods"]) {
      // console.log('here')
      return (
        <div>
          <h4 className="form-title">Period</h4>
          <select
            name="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            selected
            className="form-select"
          >
            <option value={"default"} disabled selected>
              Choose your Period
            </option>
            {periods.map((period) => {
              return <option value={period}>{period}</option>;
            })}
          </select>
        </div>
      );
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      form != "default" &&
      grade != "default" &&
      when != "default" &&
      school != "default"
    ) {
      navigate("/form", {
        state: {
          form,
          grade,
          when,
          school,
          period,
        },
      });
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
          <h4>You have joined {teacher_name}'s class</h4>
          <div className="form">
            <MultipleSchools />
            <MultiplePeriods />
            <h4 className="form-title">Grade Level</h4>
            <select
              name="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              defaultValue
              className="form-select"
            >
              <option value={"default"} disabled selected>
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
              selected
              className="form-select"
            >
              <option value={"default"} disabled selected>
                Choose your Form
              </option>
              <option value={"tobacco"}>Tobacco</option>
              <option value={"cannabis"} selected>
                Cannabis
              </option>
            </select>

            <h4 className="form-title">When are you taking this form</h4>
            <select
              name="when"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              selected
              className="form-select"
            >
              <option value={"default"} disabled selected>
                Choose When
              </option>
              <option value={"before"}>Before Lesson</option>
              <option value={"after"} selected>
                After Lesson
              </option>
            </select>

            <button
              className="btn btn-block"
              type="submit"
              // disabled={isLoading}
              onSubmit={(e) => handleSubmit(e.target.value)}
              style={{ marginTop: "1.38rem" }}
            >
              submit
              {/* {isLoading ? "Please Wait..." : "submit"} */}
            </button>
          </div>
        </form>
      </Wrapper>
    </div>
  );
};

export default JoinForm;
