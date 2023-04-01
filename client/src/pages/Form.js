import { useState } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Form = () => {
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
  let location = useLocation();
  let teacher_name = localStorage.getItem("teacher_name");
  let form = location.state;
  console.log(form);
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="full-page"
      style={{ display: "grid", alignItems: "center", padding: "0 1.5rem" }}
    >
      <Wrapper>
        <form className="form" onSubmit={handleSubmit}>
          {showAlert && <Alert />}
          <h2>{form["form"]}</h2>
          <div className="form">
            <p>form goes here</p>
          </div>
        </form>
      </Wrapper>
    </div>
  );
};
export default Form;
