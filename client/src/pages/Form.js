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
    submitForm,
  } = useAppContext();
  let tobacco = [
    {
      question: "I know that the “vapor” that comes out of a vaping device is",
      answers: [
        "mostly harmless water",
        "some aerosolized chemicals",
        "mosstly aerosolized chemicals",
      ],
    },
    {
      question:
        "How much waste/garbage do you believe tobacco/vaping products produce? ",
      answers: ["not at all", "a little", "a moderate amount", "a lot"],
    },
  ];
  let cannabis = [
    {
      question:
        "I know that the “vapor” that comes out of a cannabis device is",
      answers: [
        "mostly harmless water",
        "some aerosolized chemicals",
        "mosstly aerosolized chemicals",
      ],
    },
    {
      question:
        "How much waste/garbage do you believe cannabis products produce? ",
      answers: ["not at all", "a little", "a moderate amount", "a lot"],
    },
  ];
  const navigate = useNavigate();
  let location = useLocation();
  let info = location.state;
  let selected = [];
  let names = [];
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(names);
    names.map((name) => {
      let checks = document.getElementsByName(name);
      for (var check of checks) {
        if (check.checked) {
          selected.push(check.value);
        }
      }
    });
    console.log(selected);
    submitForm(
      names,
      selected,
      localStorage.getItem("code"),
      info["grade"],
      info["when"],
      info["form"]
    );

    navigate("/success", {});
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {showAlert && <Alert />}
      <h3>{info["form"]}</h3>
      {eval(info["form"]).map((element, index) => (
        <div>
          <div style={{ display: "flex", columnGap: "0.35rem" }}>
            <p>{names.push(element["question"])}.</p>
            <p>{element["question"]}</p>
          </div>
          {element["answers"].map((answer) => {
            return (
              <label class="container">
                <span>{answer}</span>
                <input type="radio" value={answer} name={element["question"]} />
                <span class="checkmark"></span>
              </label>
            );
          })}
        </div>
      ))}
      <button
        className="btn btn-block"
        type="submit"
        onSubmit={(e) => handleSubmit(e.target.value)}
        style={{ marginTop: "1.38rem" }}
      >
        submit
      </button>
    </form>
  );
};
export default Form;
