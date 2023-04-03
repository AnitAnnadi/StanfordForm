import { useState } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect } from "react";

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
  const [form, setForm] = useState("cannabis");
  const [grade, setGrade] = useState("K");
  const [when, setWhen] = useState("before");
  let grades = ["K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form, grade,when);


    navigate("/form", {
      state: {
        form: form,
        grade:grade,
        when:when
      },
    });
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
            <h4>Form Type</h4>
            <select
              name="aliasChoice"
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

            <h4>When are you taking this form</h4>
            <select
              name="when"
              value={form}
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
              disabled={isLoading}
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
