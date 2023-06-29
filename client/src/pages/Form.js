import { useState } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const tobacco = [
  {
    question:
      "Imagine you vape nicotine occasionally. How harmful would this be for your health?",
    answers: [
      "Not at all harmful",
      "Slightly harmful",
      "Moderately harmful",
      "Very harmful",
      "Extremely harmful"
    ],
  },
  {
    question:
      "Imagine you vape nicotine daily. How harmful would this be for your health?",
    answers: [
      "Not at all harmful",
      "Slightly harmful",
      "Moderately harmful",
      "Very harmful",
      "Extremely harmful"
    ],
  },
  {
    question:
      "Nicotine vapes are safer than cigarettes.",
    answers: [
      "Strongly agree",
      "Disagree",
      "Neither disagree nor agree",
      "Agree",
      "Strongly agree"
    ],
  },
  {
    question:
      "Imagine you vape nicotine occasionally: How likely are you to become addicted?",
    answers: [
      "Not at all likely to become addicted",
      "Slightly likely to become addicted",
      "Moderately likely to become addicted",
      "Very likely to become addicted",
      "Extremely likely to become addicted"
    ],
  },
  {
    question:
      "Imagine you vape nicotine daily: How likely are you to become addicted?",
    answers: [
      "Not at all likely to become addicted",
      "Slightly likely to become addicted",
      "Moderately likely to become addicted",
      "Very likely to become addicted",
      "Extremely likely to become addicted"
    ],
  },
  {
    question:
      "How hard would it be for you to refuse, or say “no” to, a friend who offered you a cigarette to smoke?",
    answers: [
      "Very easy",
      "Easy",
      "Neither hard nor easy",
      "Hard",
      "Very hard"
    ],
  },
  {
    question:
      "How hard would it be for you to refuse, or say “no” to, a friend who offered you an e-cigarette/vape?",
    answers: [
      "Very easy",
      "Easy",
      "Neither hard nor easy",
      "Hard",
      "Very hard"
    ],
  },
  {
    question:
      "How much do you believe that tobacco and vaping (e-cigarette) companies target the youth?",
    answers: ["Not at all", "A little", "A moderate amount", "A lot"],
  },
  {
    question:
      "How much do you believe that tobacco and vaping (e-cigarette) companies target the adults?",
    answers: ["Not at all", "A little", "A moderate amount", "A lot"],
  },
  {
    question:
      "How much do you believe that tobacco and vaping (e-cigarette) companies target the brown and black communities?",
    answers: ["Not at all", "A little", "A moderate amount", "A lot"],
  },
  {
    question:
      "How much do you believe that tobacco and vaping (e-cigarette) companies target the LGBTQI+ communities?",
    answers: ["Not at all", "A little", "A moderate amount", "A lot"],
  },
  {
    question:
      "How much do you believe that tobacco and vaping (e-cigarette) companies target current cigarette smokers?",
    answers: ["Not at all", "A little", "A moderate amount", "A lot"],
  },
  {
    question:
      "How harmful are e-cigarettes to the environment?",
    answers: [
      "Not at all harmful",
      "Slightly harmful",
      "Moderately harmful",
      "Very harmful",
      "Extremely harmful"
    ],
  },
  {
    question:
      "The 'vapor' that comes out of a vaping device is:",
    answers: [
      "Harmless water vapor",
      "Mostly water vapor with a few aerosolized chemicals in it",
      "An equal amount of water vapor with aerosolized and harmful chemicals",
      "Mostly aerosolized and harmful chemicals with a little water vapor",
      "Just aerosolized chemicals (no water vapor)"
    ],
  },
  {
    question:
      "What are your goals regarding vaping?",
    answers: [
      "I want to never use",
      "I want to cut back my vaping",
      "I want to quit completely",
      "I want to change what I vape",
      "I have not decided yet"
    ],
  }
];

const postTobacco = [
  {
    question:
      "I want to stay tobacco/vape-free, cut back, or quit my tobacco/vaping use.",
    answers: [
      "Strongly agree",
      "Agree",
      "Neither agree or disagree",
      "Disagree",
      "Strongly disagree"
    ]
  }
]


const cannabis = [
  {
    question:
      "Imagine you use cannabis products (smoke, vape, eat, or drink) occasionally. How harmful would this be for your health?",
    answers: [
      "Not at all harmful",
      "Slightly harmful",
      "Moderately harmful",
      "Very harmful",
      "Extremely harmful"
    ],
  },
  {
    question:
      "Imagine you use cannabis products (smoke, vape, eat, or drink) daily. How harmful would this be for your health?",
    answers: [
      "Not at all harmful",
      "Slightly harmful",
      "Moderately harmful",
      "Very harmful",
      "Extremely harmful"
    ],
  },
  {
    question:
      "How hard would it be for you to refuse, or say “no” to, a friend who offered you cannabis to smoke or vape?",
    answers: [
      "Very easy",
      "Easy",
      "Neither hard nor easy",
      "Hard",
      "Very hard"
    ],
  },
  {
    question:
      "How hard would it be for you to refuse, or say “no” to, a friend who offered you a cannabis edible?",
    answers: [
      "Very easy",
      "Easy",
      "Neither hard nor easy",
      "Hard",
      "Very hard"
    ],
  },
  {
    question:
      "How harmful are 'disposable' (single use) cannabis vaping products to the environment?",
    answers: [
      "Not at all harmful",
      "Slightly harmful",
      "Moderately harmful",
      "Very harmful",
      "Extremely harmful"
    ],
  },
  {
    question:
      "The 'vapor' that comes out of cannabis vaping devices is:",
    answers: [
      "Harmless water vapor",
      "Mostly water vapor with a few aerosolized chemicals in it",
      "An equal amount of water vapor with aerosolized and harmful chemicals",
      "Mostly aerosolized and harmful chemicals with a little water vapor",
      "Just aerosolized chemicals (no water vapor)"
    ],
  },
  {
    question: "Cannabis smoke/vapor is harmful to your lungs?",
    answers: [
      "Strongly agree",
      "Agree",
      "Neither agree nor disagree",
      "Disagree",
      "Strongly disagree"
    ],
  },
  {
    question: "Cannabis (any type) is harmful to the brain development of someone under the age of 21?",
    answers: [
      "Strongly agree",
      "Agree",
      "Neither agree nor disagree",
      "Disagree",
      "Strongly disagree"
    ],
  },
];

const postCannabis = [
  {
    question:
      "I want to stay cannabis-free, cut back, or quit my use.",
    answers: [
      "Strongly agree",
      "Agree",
      "Neither agree or disagree",
      "Disagree",
      "Strongly disagree"
    ]
  }
]


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

  const [usedForm, setUsedForm] = useState(() => {
    if (info["form"] === "You and Me, Together Vape-Free") {
      return info["when"] === "before" ? tobacco : tobacco.concat(postTobacco);
    } else if (info["form"] === "Smart Talk: Cannabis Prevention & Education Awareness") {
      return info["when"] === "before" ? cannabis : cannabis.concat(postCannabis);
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
            {element["answers"].map((answer, index) => {
              return (
                <label key={index} className="container">
                  <span >{answer}</span>
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
