import { useState,useRef } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ProductsTobacco from "../components/ProductsTobacco";
import ProductsCannabis from "../components/ProductsCannabis";

//still using 23-24 safety
import {
  tobacco,
  postTobacco,
  cannabis,
  postCannabis,
  safety,
  healthy,
  tobaccoElem
} from "../utils/questions23-24";


import {
  tobacco24,
  tobaccoElem24,
  cannabis24,
  healthy24,
  // safety,
  healthyCannabis24,
  healthyTobacco24
} from "../utils/questions24-25";
import ReCAPTCHA from "react-google-recaptcha"
import {useTranslation} from "react-i18next";
import {MdLanguage} from "react-icons/md";

const Form = () => {
  const BlackBox = () => {
    return <div style={{ backgroundColor: 'black', width: '20px', height: '20px' }}></div>;
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
    recentResponse,
    productsTobacco,
    productsCannabis,
    nextPg,
    handleChange
  } = useAppContext();

  const navigate = useNavigate();
  let location = useLocation();
  let info = location.state;
  console.log(info)
  let selected = [];
  let names = [];
  const captchaRef = useRef(null)

  useEffect(() => {
    if (nextPg) {
      if (
        (info["form"] === "Healthy Futures: Tobacco/Nicotine/Vaping" || info["form"] === "Healthy Futures: Cannabis") &&
        info["when"] === "after"
      ) {
        setTimeout(() => {
          navigate("/certificateinfo", { state: { info } });
          handleChange({name:"isLoading",value:false})
        }, 2000);
      } else {
        setTimeout(() => {
          navigate("/success", {});
          handleChange({name:"isLoading",value:false})

        }, 2000);
      }
  
      captchaRef.current.reset();
    }
  }, [nextPg]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const captcha =  captchaRef.current.getValue();
    const formData = [];
    console.log('name')
    console.log(names)
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
    console.log('prints')
    console.log(formData)

    let grade = info["grade"];
    let when = info["when"];
    let type = info["form"];
    if (type == "Healthy Futures: Tobacco/Nicotine/Vaping"){
      {Object.entries(productsTobacco).map(([key, value]) => (
        formData.push({question:key,answers:value})
      ))}
  }
  if (type == "Healthy Futures: Cannabis"){
    {Object.entries(productsCannabis).map(([key, value]) => (
      formData.push({question:key,answers:value})
    ))}
}
  console.log(formData)

    if (type == "You and Me, Together Vape-Free"){
      type = "You and Me Vape Free (middle school and above)"
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
      submitForm(formData, code, grade, when, type, school, period, null, null, null, null, captcha);
      
    }

  };

  const [usedForm, setUsedForm] = useState(() => {
    console.log(recentResponse)
    if (info["form"] === "You and Me, Together Vape-Free") {
      // return info["when"] === "before" ? tobacco : tobacco.concat(postTobacco); //this was for 23-24
      return recentResponse?(info["when"] === "before" ? tobacco : tobacco.concat(postTobacco)):tobacco24;
    } 
    else if(info["form"] ==="You and Me, Together Vape-Free(elem)"){
      // return info["when"] === "before" ? tobaccoElem : tobaccoElem.concat(postTobacco);  //this was for 23-24
      return recentResponse?info["when"] === "before" ? tobaccoElem : tobaccoElem.concat(postTobacco):tobaccoElem24;
    }else if (
      info["form"] === "Smart Talk: Cannabis Prevention & Education Awareness"
    ) {
      // return info["when"] === "before"? cannabis: cannabis.concat(postCannabis); //this was for 23-24
      return recentResponse?info["when"] === "before"? cannabis: cannabis.concat(postCannabis):cannabis24
    } else if (info["form"] === "Safety First") {
      return safety;
    }
    else if (info["form"] === "Healthy Futures: Tobacco/Nicotine/Vaping") {
      return recentResponse?healthy:healthy24;
    }
    else if (info["form"] === "Healthy Futures: Cannabis") {
      return recentResponse?healthy:healthy24;
    }
  });

  const { t, i18n } = useTranslation();

  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const currentLanguage = i18n.language;

    setCurrentLanguage(currentLanguage);
  });

  return (
    <Wrapper
      style={{ margin: "2rem auto", maxWidth: "90%", width: "700px" }}
    >
      <form className="form" onSubmit={handleSubmit}>
        <h3>{`${t(info.form, info.form)}`}</h3>
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
  {usedForm.map((element, qindex) => (
    
  <div key={qindex}>
    {console.log(element)}
    <div style={{ display: "flex", columnGap: "0.35rem" }}>
      {/* {} */}
      <p>{names.push(info["form"]=="Safety First"||recentResponse||recentResponse?element["question"]:element["name"])}.</p>
      <p>{t(element["question"], element["question"])}</p>
    </div>
    {element["question"].includes("check all that apply")
      ? element["answers"].map((answer, index) => (
          <label key={index} className="container">
            <span>{info["form"]=="Safety First"||recentResponse?answer:answer.text}</span> 
            {/* temporarily removed translate */}
            <input
              type="checkbox"
              name={info["form"]=="Safety First"||recentResponse?element["question"]:element["name"]}
              value={info["form"]=="Safety First"||recentResponse?answer:answer.code}
            />
            <span className="checkmark"></span>
          </label>
        ))
      : element["answers"].map((answer, index) => {
        let box = false;
        let emoji = false;
          if (qindex==8 && info.form === "You and Me, Together Vape-Free(elem)" ){
            let emojis = ['🙁', '🙁', '🙂', '😊','😁'];
            emoji = emojis[index]
          }
          if (index < 5) {
            let blackBoxes = [];
            let emojis = ['👍', '👎', '🤷'];
            if (info.form === "You and Me, Together Vape-Free(elem)" && element["answers"].length === 6) {
              box = true
              for (let i = 0; i < index + 1; i++) {
                blackBoxes.push(<BlackBox key={i} />);
              }
            }
            else if (info.form === "You and Me, Together Vape-Free(elem)" && element["answers"].length===3 ){
              emoji = emojis[index];
            }
            return (
              <label key={index} className="container">
               {emoji?emoji:null}
                {box?
                blackBoxes.map((box, boxIndex) => (
                  <div key={boxIndex} style={{ display: "inline-block", padding: "0.2rem" }}>
                    {box}
                  </div>
                )):
                
                <span>{info["form"]=="Safety First"||recentResponse?answer:answer.text}</span>} 
                {console.log(answer.code)}
                
                <input
                  type="radio"
                  value={info["form"]=="Safety First"||recentResponse?answer:answer.code}                  
                                name={info["form"]=="Safety First"||recentResponse?element["question"]:element["name"]}

                />
                <span className="checkmark"></span>
              </label>
            );
          } else {
            return (
              <label key={index} className="container">
                {element["question"]!="What are your goals regarding vaping?"?
                <p style={{ fontSize: "15px" }}> 🤷(I don't know)</p>:
                <p>{answer.text}</p>}

                {/* <p>&#129335; I don't know</p> */}
                <input
                  type="radio"
                  value={info["form"]=="Safety First"||recentResponse?answer:answer.code}                  
                                name={info["form"]=="Safety First"||recentResponse?element["question"]:element["name"]}

                />
                <span className="checkmark"></span>
              </label>
            );
          }
        })}
        
  </div>
))}
    {info["form"] === "Healthy Futures: Tobacco/Nicotine/Vaping" &&!recentResponse?
    <ProductsTobacco/>:
    null}
    {info["form"] === "Healthy Futures: Cannabis" && !recentResponse?
    <ProductsCannabis/>:
    null}
        <ReCAPTCHA 
            ref={captchaRef}
            sitekey={"6LerfqAnAAAAAB86YDhcCf0XanGHJXHQkvyxY6fJ"} />
        {showAlert && <Alert />}
        <button
          className="btn btn-block"
          type="submit"
          onSubmit={(e) => handleSubmit(e.target.value)}
          style={{ marginTop: "1.38rem" }}
          disabled={isLoading}
        >
          {t('UP_submit', 'Submit')}
        </button>
      </form>
    </Wrapper>
  );
};
export default Form;
