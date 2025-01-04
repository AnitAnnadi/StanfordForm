import { useState, useRef } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  tobacco,
  postTobacco,
  cannabis,
  postCannabis,
  safety,
  healthy,
  tobaccoElem,
} from "../utils/questions23-24";
import {
  tobacco24,
  tobaccoElem24,
  cannabis24,
  cannabisElem24,
  healthy24,
  safety24,
  healthyCannabis24,
  healthyTobacco24,
} from "../utils/questions24-25";
import ProductsCannabis from "../components/ProductsCannabis";
import ProductsTobacco from "../components/ProdcuctsTobacco";

import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";

const Form = () => {
  const BlackBox = () => {
    return (
      <div
        style={{ backgroundColor: "black", width: "20px", height: "20px" }}
      ></div>
    );
  };
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
    altertText,
    nextPg,
    handleChange,
    productsCannabis,
    productsTobacco
  } = useAppContext();

  const navigate = useNavigate();
  let location = useLocation();
  let info = location.state;
  console.log(info);
  let selected = [];
  let names = [];
  const captchaRef = useRef(null);

  useEffect(() => {
    if (nextPg) {
      if (
        (info["form"] === "Healthy Futures: Tobacco/Nicotine/Vaping" ||
          info["form"] === "Healthy Futures: Cannabis") &&
        info["when"] === "after"
      ) {
        setTimeout(() => {
          navigate("/certificateinfo", { state: { info } });
          handleChange({ name: "isLoading", value: false });
        }, 2000);
      } else {
        setTimeout(() => {
          navigate("/success", {});
          handleChange({ name: "isLoading", value: false });
        }, 2000);
      }

      captchaRef.current.reset();
    }
  }, [nextPg]);

  const handleSubmit = (e) => {
    console.log(names)
    e.preventDefault();
    const captcha = captchaRef.current.getValue();
    const formData = [];

    names.forEach((name) => {
      const question = name;
      const answers = [];

      let checks = document.getElementsByName(name);
      console.log(document.getElementsByName(name))
      for (var check of checks) {
        if (check.checked) {
          answers.push(check.value);
        }
      }

      formData.push({ question, answers });
    });
    let grade = info["grade"];
    let when = info["when"];
    let type = info["form"];
    if (type == "Healthy Futures: Tobacco/Nicotine/Vaping") {
      {
        Object.entries(productsTobacco).map(([key, value]) =>
          formData.push({ question: key, answers: value })
        );
      }
    }
    if (type == "Healthy Futures: Cannabis") {
      {
        Object.entries(productsCannabis).map(([key, value]) =>
          formData.push({ question: key, answers: value })
        );
      }
    }
    if (type === "You and Me, Together Vape-Free") {
      type = "You and Me Vape Free (middle school and above)";
    }
    let school = info["school"];
    if (info["noCode"]) {
      let state = info["state"];
      let city = info["city"];
      let county = info["county"];
      let district = info["district"];
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
        district,
        captcha
      );
    } else {
      let period = info["period"];
      let code = localStorage.getItem("code");
      console.log(formData);
      submitForm(formData, code, grade, when, type, school, period, null, null, null, null, captcha);
    }
  };

  const [usedForm, setUsedForm] = useState(() => {
    if (info["form"] === "You and Me, Together Vape-Free") {
      return tobacco24;
      // return info["when"] === "before" ? tobacco : tobacco.concat(postTobacco);
    } else if (info["form"] === "You and Me, Together Vape-Free(elem)") {
      return tobaccoElem24;
      // return info["when"] === "before" ? tobaccoElem : tobaccoElem.concat(postTobacco);
    } else if (
      info["form"] === "Smart Talk: Cannabis Prevention & Education Awareness"
    ) {
      return cannabis24;
    } 
    else if (
      info["form"] === "Smart Talk: Cannabis Prevention & Education Awareness(elem)"
    ){
      return cannabisElem24;
    }else if (info["form"] === "Safety First") {
      return safety24;
    } else if (info["form"] === "Healthy Futures: Tobacco/Nicotine/Vaping") {
      return healthy24
    } else if (info["form"] === "Healthy Futures: Cannabis") {
      return healthy24
    }
  });

  const { t, i18n } = useTranslation();

  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    const currentLanguage = i18n.language;

    setCurrentLanguage(currentLanguage);
  });

  return (
    <Wrapper style={{ margin: "2rem auto", maxWidth: "90%", width: "700px" }}>
      <form className="form" onSubmit={handleSubmit}>
        <h3>{`${t(info.form, info.form)}`}</h3>
        <div className="language-select-container">
          <MdLanguage className="language-select-icon" />
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
        {usedForm.map((element, qindex) => (
          
          <div key={qindex}>
            <div style={{ display: "flex", columnGap: "0.35rem" }}>
              <p>{names.push(element["name"])}.</p>
              <p>{t(element["question"], element["question"])}</p>
            </div>
            {element["question"].includes("check all that apply")
              ? element["answers"].map((answer, index) => (
                  <label key={index} className="container">
                    <span>{t(answer.text, answer.text)}</span>
                    <input
                      type="checkbox"
                      name={element["name"]}
                      value={answer.code}
                    />
                    <span className="checkmark"></span>
                  </label>
                ))
              : element["answers"].map((answer, index) => {
                  let box = false;
                  let emoji = false;
                  if (
                    qindex == 8 &&
                    info.form === "You and Me, Together Vape-Free(elem)"
                  ) {
                    let emojis = ["🙁", "🙁", "🙂", "😊", "😁"];
                    emoji = emojis[index];
                  }
                  if (
                    qindex == 7 &&
                    info.form === "Smart Talk: Cannabis Prevention & Education Awareness(elem)"
                  ) {
                    let emojis = ["🙁", "🙁", "🙂", "😊", "😁"];
                    emoji = emojis[index];
                  }
                  if (index < 5) {
                    let blackBoxes = [];
                    let emojis = ["👍", "👎", "🤷"];
                    if (
                      (info.form == "You and Me, Together Vape-Free(elem)" || info.form =="Smart Talk: Cannabis Prevention & Education Awareness(elem)") &&
                      element["answers"].length === 6
                    ) {
                      box = true;
                      for (let i = 0; i < index + 1; i++) {
                        blackBoxes.push(<BlackBox key={i} />);
                      }
                    } else if (
                      (info.form == "You and Me, Together Vape-Free(elem)" || info.form =="Smart Talk: Cannabis Prevention & Education Awareness(elem)") &&
                      element["answers"].length === 3
                    ) {
                      emoji = emojis[index];
                    }
                    return (
                      <label key={index} className="container">
                        {emoji ? emoji : null}
                        {box ? (
                          blackBoxes.map((box, boxIndex) => (
                            <div
                              key={boxIndex}
                              style={{
                                display: "inline-block",
                                padding: "0.2rem",
                              }}
                            >
                              {box}
                            </div>
                          ))
                        ) : (
                          <span>{t(answer.text, answer.text)}</span>
                        )}
                        <input
                          type="radio"
                          value={answer.code}
                          name={element["name"]}
                        />
                        <span className="checkmark"></span>
                      </label>
                    );
                  } else {
                    return (
                      <label key={index} className="container">
                        <p style={{ fontSize: "15px" }}> 🤷(I don't know)</p>

                        <input
                          type="radio"
                          value={answer.code}
                          name={element["name"]}
                        />
                        <span className="checkmark"></span>
                      </label>
                    );
                  }
                })}
          </div>
        ))}{" "}
        {info["form"] === "Healthy Futures: Tobacco/Nicotine/Vaping" && (
          <ProductsTobacco />
        )}
        {info["form"] === "Healthy Futures: Cannabis" && <ProductsCannabis />}
        <ReCAPTCHA
          ref={captchaRef}
          sitekey={"6LerfqAnAAAAAB86YDhcCf0XanGHJXHQkvyxY6fJ"}
        />
        {showAlert && <Alert />}
        <button
          className="btn btn-block"
          type="submit"
          onSubmit={(e) => handleSubmit(e.target.value)}
          style={{ marginTop: "1.38rem" }}
          disabled={isLoading}
        >
          {t("UP_submit", "Submit")}
        </button>
      </form>
    </Wrapper>
  );
};
export default Form;
