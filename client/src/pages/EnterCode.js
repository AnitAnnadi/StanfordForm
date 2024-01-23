import { useState,useRef } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo2 from "../assets/images/logo.png";
import {useTranslation} from "react-i18next";
import {MdLanguage} from "react-icons/md";



const EnterCode = () => {
  const {
    user,
    showAlert,
    teacher,
    displayAlert,
    updateLocation,
    isLoading,
    enterCode,
    schools,
  } = useAppContext();
  useEffect(() => {
    // let teacher_info=(((teacher["teacher"])))

    if (teacher != "") {
      let teacher_name = teacher["name"];
      let teacher_id = teacher["_id"];
      let teacher_school = teacher["_id"];
      localStorage.setItem("teacher_name", teacher_name);
      localStorage.setItem("teacher_id", teacher_id);
      localStorage.setItem("teacher_school", teacher_school);
      {
        setTimeout(() => {
          navigate("/joinedForm", {
            state: {
              schools,
              noCode:false
            },
          });
        }, 2000);
      }
    }
  }, [teacher]);


  const navigate = useNavigate();

  const [code, setCode] = useState();

  const handleChange = (e) => {
    setCode(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    enterCode(code);
    localStorage.setItem("code", code);

    if (isLoading) {
    }
    if (teacher) {
    }
  };

  const { t, i18n } = useTranslation();

  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const currentLanguage = i18n.language;

    setCurrentLanguage(currentLanguage);
  });

  return (
    <div
      className="full-page"
      style={{ display: "grid", alignItems: "center", padding: "0 1.5rem" }}
    >
      <Wrapper style={{ paddingBottom: "1.75rem" }}>
        <form className="form" onSubmit={handleSubmit}>
          {showAlert && <Alert />}
          <div className="form">
            <h3>{t('enter_code', 'Enter Code')}</h3>
            <FormRow
              type="text"
              name="Teacher Code"
              handleChange={handleChange}
            />
            {/* <p>ji</p> */}


            <button
              type="submit"
              className="btn btn-block"
              disabled={isLoading}
              style={{ marginTop: "1.38rem" }}
            >
              {t('go_to_form', 'Go To Form')}
            </button>
            <p>
              {t('dont_have_teacher_code', "Don't have a teacher code?")}{" "}
              <a className="link" href="/selectStudentLoc">
                {t('click_here', 'Click here')}
              </a>
            </p>
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
          </div>
        </form>
      </Wrapper>
      <img width="200" height="100" src={Logo2} className="corner-logo" />
    </div>
  );
};

export default EnterCode;
