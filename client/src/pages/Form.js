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
    successAlert,
  } = useAppContext();
  let tobacco = [
    {
      question:
        "How much do people risk harming themselves physically, and in other ways, when they use vape products occasionally?",
      answers: ["no risk of harm", "slight", "moderate", "great risk of harm"],
    },
    {
      question:
        "How much do people risk harming themselves physically, and in other ways, when they use vape products several times a day (100 puffs or more)?",
      answers: ["not at all", "a little", "a moderate amount", "a lot"],
    },
    {
      question:
        "How hard would it be for you to refuse, or say “no” to, a friend who offered you a cigarette to smoke?",
      answers: [
        "very easy",
        "easy",
        "neither hard or easy",
        "hard",
        "very hard",
      ],
    },
    {
      question:
        "How hard would it be for you to refuse, or say “no” to, a friend who offered you a vape?",
      answers: [
        "very easy",
        "easy",
        "neither hard or easy",
        "hard",
        "very hard",
      ],
    },
    {
      question:
        "How much do you believe that tobacco and vaping (e-cigarette) companies target the youth?",
      answers: ["not at all", "a little", "a moderate amount", "a lot"],
    },
    {
      question:
        "How much do you believe that tobacco and vaping (e-cigarette) companies target the adults?",
      answers: ["not at all", "a little", "a moderate amount", "a lot"],
    },
    {
      question:
        "How much do you believe that tobacco and vaping (e-cigarette) companies target the brown and black communities?",
      answers: ["not at all", "a little", "a moderate amount", "a lot"],
    },
    {
      question:
        "How much do you believe that tobacco and vaping (e-cigarette) companies target the LGBTQI+ communities?",
      answers: ["not at all", "a little", "a moderate amount", "a lot"],
    },
    {
      question:
        "How much waste/garbage do you believe tobacco/vaping products produce?",
      answers: ["not at all", "a little", "a moderate amount", "a lot"],
    },
  ];
  let cannabis = [
    {
      question:
        "How much do people risk harming themselves physically, and in other ways, when they do they use cannabis products occasionally (smoke, vape, eat, or drink)?",
      answers: ["no risk of harm", "slight", "moderate", "great risk of harm"],
    },
    {
      question:
        "How much do people risk harming themselves physically, and in other ways, when they do they use cannabis products daily?",
      answers: ["no risk of harm", "slight", "moderate", "great risk of harm"],
    },
    {
      question:
        "How hard would it be for you to refuse, or say “no” to, a friend who offered you cannabis to smoke or vape?",
      answers: [
        "very easy",
        "easy",
        "neither hard or easy",
        "hard",
        "very hard",
      ],
    },
    {
      question:
        "How hard would it be for you to refuse, or say “no” to, a friend who offered you a cannabis edible?",
      answers: [
        "very easy",
        "easy",
        "neither hard or easy",
        "hard",
        "very hard",
      ],
    },
    {
      question:
        "How much waste/garbage do you believe cannabis products produce?",
      answers: ["not at all", "a little", "a moderate amount", "a lot"],
    },
    {
      question:
        "Are “disposable” (single use) cannabis vaping products harmful to the environment?",
      answers: [
        "not at all",
        "a little",
        "a moderate amount",
        "a lot, because they contain both e-waste and toxins",
      ],
    },
    {
      question: "The “vapor” that comes out of cannabis vaping devices is:",
      answers: [
        "harmless water vapor",
        "mostly water vapor with a few aerosolized chemicals in it",
        "an equal amount of water vapor with aerosolized and harmful chemicals",
        "mostly aerosolized and harmful chemicals with a little water vapor",
        "just aerosolized chemicals (no water vapor)",
      ],
    },
    {
      question: "How harmful is cannabis smoke/vapor to your lungs?",
      answers: ["no risk of harm", "slight", "moderate", "great risk of harm"],
    },
    {
      question:
        "How harmful is cannabis (any type) to the brain development of someone under the age of 21?",
      answers: ["no risk of harm", "slight", "moderate", "great risk of harm"],
    },
  ];
  const navigate = useNavigate();
  let location = useLocation();
  let info = location.state;
  let selected = [];
  let names = [];
  const handleSubmit = (e) => {
    e.preventDefault();
    names.map((name) => {
      let checks = document.getElementsByName(name);
      for (var check of checks) {
        if (check.checked) {
          selected.push(check.value);
        }
      }
    });
    submitForm(
      names,
      selected,
      localStorage.getItem("code"),
      info["grade"],
      info["when"],
      info["form"],
      info["school"],
      info["period"]
    );
    successAlert("Form Sucessfully Completed. Redirecting...");
    setTimeout(() => {
      navigate("/success", {});
    }, 3000);
  };

  const [usedForm, setUsedForm] = useState(
    info["form"] === "You and Me, Together Vape-Free" ? tobacco : cannabis
  );

  return (
    <Wrapper style={{ margin: "2rem auto", width: "90%", maxWidth: "700px" }}>
      <form className="form" onSubmit={handleSubmit}>
        <h3>{`${info.form}`}</h3>
        {usedForm.map((element, index) => (
          <div key={index}>
            <div style={{ display: "flex", columnGap: "0.35rem" }}>
              <p>{names.push(element["question"])}.</p>
              <p>{element["question"]}</p>
            </div>
            {element["answers"].map((answer, index) => {
              return (
                <label key={index} className="container">
                  <span>{answer}</span>
                  <input
                    type="radio"
                    value={answer}
                    name={element["question"]}
                  />
                  <span className="checkmark"></span>
                </label>
              );
            })}
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
