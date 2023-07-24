import { useState } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { tobacco,postTobacco, cannabis, postCannabis, safety  } from "../utils/questions";


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
    successAlert,
  } = useAppContext();

  const navigate = useNavigate();
  let location = useLocation();
  let info = location.state;
  let selected = [];
  let names = [];

  // const handleOptionChange = (optionValue) => {
  //   if (selectedOptions.includes(optionValue)) {
  //     setSelectedOptions(selectedOptions.filter((option) => option !== optionValue));
  //   } else {
  //     setSelectedOptions([...selectedOptions, optionValue]);
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = [];
  
    names.forEach((name) => {
      const question = name;
      const answers = [];
  
      let checks = document.getElementsByName(name);
      for (var check of checks) {
        if (check.checked) {
          answers.push(check.value);
        }
      }
  
      formData.push({ question, answers });
    });
    let grade = info["grade"]
    let when = info["when"]
    let type = info["form"]
    let school = info["school"]
    // Rest of the code
    if (info["noCode"]){
      let state = info["state"]
      let city = info["city"]
      let county = info["county"]
      let district = info["district"]
      submitForm(
        formData,
        null,
        grade,
        when,
        type,
        school,
        null,
        state,
        city,
        county, 
        district

      )
    }
    else{
    let period = info["period"]
    let code  = localStorage.getItem("code")
    submitForm(
      formData,
      code,
      grade,
      when,
      type,
      school,
      period
    );}
    successAlert("Form Sucessfully Completed. Redirecting...");
    setTimeout(() => {
      navigate("/success", {});
    }, 3000);
  };

  const [usedForm, setUsedForm] = useState(() => {
    if (info["form"] === "You and Me, Together Vape-Free") {
      return info["when"] === "before" ? tobacco : tobacco.concat(postTobacco);
    } else if (info["form"] === "Smart Talk: Cannabis Prevention & Education Awareness") {
      return info["when"] === "before" ? cannabis : cannabis.concat(postCannabis);
    }
    else if (info["form"] === "Safety First"){
      return safety
    }
  });

  return (
    <Wrapper style={{ margin: "2rem auto",  maxWidth: "700px" }}>
      <form className="form" onSubmit={handleSubmit}>
        <h3>{`${info.form}`}</h3>
        {usedForm.map((element, index) => (
          <div key={index}>
            <div style={{ display: "flex", columnGap: "0.35rem" }}>
              <p>{names.push(element["question"])}.</p>
              <p>{element["question"]}</p>
            </div>
            {element["question"].includes("check all that apply") ? (
              element["answers"].map((answer, index) => (
                <label key={index} className="container">
                  <span>{answer}</span>
                  <input type="checkbox" name={element["question"]} value={answer} />
                  <span className="checkmark"></span>
                </label>
              ))
            ) : (
              element["answers"].map((answer, index) => (
                <label key={index} className="container">
                  <span>{answer}</span>
                  <input type="radio" value={answer} name={element["question"]} />
                  <span className="checkmark"></span>
                </label>
              ))
            )}
          </div>
        ))}

        {showAlert && <Alert />}
        <button
          className="btn btn-block"
          type="submit"
          onSubmit={(e) => handleSubmit(e.target.value)}
          style={{ marginTop: "1.38rem" }}
        >
          submit
        </button>
      </form>
    </Wrapper>
  );
};
export default Form; 
