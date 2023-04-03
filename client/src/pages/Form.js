import { useState } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Questions from "../components/Questions";
import Tobacco from "../components/TobaccoHCoded";
import Cannabis from "../components/Cannabis";
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
  let info = location.state;
  console.log(info);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(document.getElementById("question"))
  };
  // function EventListener(){
  //   if (form["form"]=='cannabis'){
  //     console.log('hi')
  //   }
  //   else(
  //     return(<Tobacco/>)
  //   )
  // }
  let tobaccoBank=["I know that the “vapor” that comes out of a vaping device is","How much waste/garbage do you believe tobacco/vaping products produce? "]
  let tobaccoAnswers=[["mostly harmless water", "some aerosolized chemicals", "mosstly aerosolized chemicals"],["not at all", "a little", "a moderate amount, a lot"]]
//   // Fix this later to make code less "hardcoded". 
//   return(tobaccoBank.map((question, index) => {
//     // console.log( tobaccoAnswers[index])
//     return(
//         <div>
//         <Answers  answerset={tobaccoAnswers[index]} question={question}/>
//         </div>
//     )
//  }, []))

  if (info["form"]=='cannabis'){
    return(<Cannabis {...info}/>)
  }
  else{
    return(<Tobacco {...info}/>)
  }
};
export default Form;
