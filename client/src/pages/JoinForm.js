import { useState } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Logo2 from "../assets/images/logo.png";

import { useNavigate } from "react-router-dom";
import {useTranslation} from "react-i18next";
import {MdLanguage} from "react-icons/md";

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
    handleChange
  } = useAppContext();

  const navigate = useNavigate();


  let teacher_name = localStorage.getItem("teacher_name");
  let location = useLocation();
  let info = location.state;
  if (info.formName==="HealthyFutures:Tobacco"){
    info.formName="Healthy Futures: Tobacco/Nicotine/Vaping"
  }
  else if (info.formName=="HealthyFutures:Cannabis"){
    info.formName = "Healthy Futures: Cannabis"
  }
  else if (info.formName=="SmartTalk"){
    info.formName="Smart Talk: Cannabis Prevention & Education Awareness"
  }
  else if (info.formName=="VapeFree"){
      info.formName = "You and Me, Together Vape-Free"
  }
  else if (info.formName=="SafetyFirst"){
    info.formName = "Safety First"
  }
  const [form, setForm] = useState(info.formName??"default");
  const [grade, setGrade] = useState("default");
  const [when, setWhen] = useState(info.when ?? "default");
  const [school, setSchool] = useState("default");
  const [period, setPeriod] = useState("default");
  let grades = ["K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, "College or Above"];
  let periods = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let schools = null;


  if (!info["noCode"]){
    schools = info["schools"];
  }

  const { t, i18n } = useTranslation();

  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const currentLanguage = i18n.language;

    setCurrentLanguage(currentLanguage);
  });

  const MultipleSchools = () => {
    const actualSchools = schools.filter((school) => school["school"]);

    if (actualSchools.length > 1) {
      return (
        <div>
          <h4 className="form-title">
            t('school_name', 'School Name')
          </h4>
          <select
            name="school"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="form-select"
          >
            <option value="default" disabled>
              {t('choose_your_school', 'Choose your School')}
            </option>
            
            {actualSchools.map((school, index) => (
              <option key={index} value={school["school"]}>
                {school["school"]}
              </option>
            ))}
          </select>
        </div>
      );
    } else if (actualSchools.length === 1) {
      setSchool(actualSchools[0]["school"]); // Set the selected school name
    }
  
    return null; // Handle the case when there are no valid schools
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
              {t('choose_your_period', 'Choose your Period')}
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
    handleChange({name:"isLoading",value:false})
    let newForm = form; // Create a new variable to hold the updated form value
    if (form==="You and Me, Together Vape-Free" && (parseInt(grade)<6 || grade =="K")){
      newForm="You and Me, Together Vape-Free(elem)"
    }
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
              form: newForm, // Use the new variable here
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
        }, 2000);
      } else {
        displayAlert();
      }
    }
    else{
      if (form==="You and Me, Together Vape-Free" && (parseInt(grade)<8 || grade =="K")){
        newForm="You and Me, Together Vape-Free(elem)"
      }
      if (
        newForm !== "default" &&
        grade !== "default" &&
        when !== "default" &&
        school !== "default"
      ) {
        let teacher_id = localStorage.getItem("teacher_id")
        successAlert("Redirecting...");
        setTimeout(() => {
          navigate("/form", {
            state: {
              form: newForm, // Use the new variable here
              grade,
              when,
              school,
              period,
              teacher_id
            },
          });
        }, 2000);
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
          <h4>
            {`${t('you_have_joined', 'You have joined')} ${teacher_name}'s ${t('class', 'class')}`}
          </h4>}
          <div className="form">
            {info["noCode"]?null
            :
            <div>
            <MultipleSchools />
            <MultiplePeriods />
            </div>}
            <h4 className="form-title">{t('grade_level', 'Grade Level')}</h4>
            <select
              name="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="form-select"
            >
              <option value={"default"} disabled>
                {t('grade_level', 'Grade Level')}
              </option>
              {grades.map((grade, index) => {
                return (
                  <option key={index} value={grade}>
                    {grade}
                  </option>
                );
              })}
            </select>

            <h4 className="form-title">
              {t('form_type', 'Form Type')}</h4>
            <select
              name="type"
              value={form}
              onChange={(e) => setForm(e.target.value)}
              className="form-select"
            >
              <option value={"default"} disabled>
                {t('choose_your_form', 'Choose your Form')}
              </option>
              <option value={"You and Me, Together Vape-Free"}>
              {t('vape_title', 'You and Me, Together Vape-Free')}
              </option>
              <option
                value={"Smart Talk: Cannabis Prevention & Education Awareness"}
              >
                {t('cannabis_title', 'Smart Talk: Cannabis Prevention & Education Awareness')}
              </option>
              <option value={"Safety First"}>
                {t('safety_title', 'Safety First')}
              </option>
              {info["noCode"]?null:
              <option
                value={"Healthy Futures: Tobacco/Nicotine/Vaping"}
              >
                {t('healthy_tobacco_title', 'Healthy Futures: Tobacco/Nicotine/Vaping')}
              </option>
              }
              {info["noCode"]?null:
              <option
                value={"Healthy Futures: Cannabis"}
              >
                {t('healthy_cannabis_title', 'Healthy Futures: Cannabis')}
              </option>
              }
{/* } */}

            </select>

            <h4 className="form-title">
              {t('when_are_you_taking_this_form', 'When are you taking this form')}
            </h4>
            <select
              name="when"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              className="form-select"
            >
              <option value={"default"} disabled>
                {t('choose_when', 'Choose When')}
              </option>
              <option value={"before"}>
                {t('before_lesson', 'Before Lesson')}
              </option>
              <option value={"after"}>
                {t('after_lesson', 'After Lesson')}
              </option>
            </select>

            <button
              className="btn btn-block"
              type="submit"
              // disabled={isLoading}
              style={{ marginTop: "1.38rem" }}
            >
              {t('UP_submit', 'Submit')}
              {/* {isLoading ? "Please Wait..." : "submit"} */}
            </button>
          </div>
        </form>
        <div className="language-select-container">
          <MdLanguage className="language-select-icon"/>
          <select
            className="language-select"
            value={currentLanguage}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="zh">中文</option>
          </select>
        </div>
      </Wrapper>
      <img width="200" height="100" src={Logo2} className="corner-logo" />
    </div>
  );
};

export default JoinForm;
