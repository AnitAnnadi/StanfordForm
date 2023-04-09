import { useState } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EnterCode = () => {
  const {
    user,
    showAlert,
    teacher,
    displayAlert,
    updateLocation,
    isLoading,
    enterCode,
    schools
  } = useAppContext();
  useEffect(() => {
    // let teacher_info=(((teacher["teacher"])))

    if (teacher != "") {
      console.log(teacher)
      let teacher_name = teacher["name"];
      let teacher_id = teacher["_id"];
      let teacher_school = teacher["_id"];
      localStorage.setItem("teacher_name", teacher_name);
      localStorage.setItem("teacher_id", teacher_id);
      localStorage.setItem("teacher_school", teacher_school);
      {
        setTimeout(() => {
          navigate("/joinedForm",{state:
          {
            schools
          }});
        }, 1000);
      }
    }
  }, [teacher]);

  const navigate = useNavigate();

  const [code, setCode] = useState();

  const handleChange = (e) => {
    setCode(e.target.value);
    console.log(code);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(code);
    enterCode(code);
    localStorage.setItem("code",code)

    if (isLoading) {
      console.log("loading");
    }
    if (teacher) {
      console.log(teacher);
    }
  };

  return (
    <div
      className="full-page"
      style={{ display: "grid", alignItems: "center", padding: "0 1.5rem" }}
    >
      <Wrapper>
        <form className="form" onSubmit={handleSubmit}>
          {showAlert && <Alert />}
          <div className="form">
            <h3>Enter Code</h3>
            <FormRow type="text" name="Form Code" handleChange={handleChange} />

            <button
              type="submit"
              className="btn btn-block"
              disabled={isLoading}
              style={{ marginTop: "1.38rem" }}
            >
              Go To Form
            </button>
          </div>
        </form>
      </Wrapper>
    </div>
  );
};

export default EnterCode;
