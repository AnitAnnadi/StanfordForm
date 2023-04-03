import { useState } from "react";
import { FormRow, Alert } from ".";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Answers from "./Answers";

const Questions = ()=>{
    const {
        user,
        showAlert,
        teacher,
        displayAlert,
        updateLocation,
        isLoading,
        enterCode,
      } = useAppContext();
      let tobaccoBank=["I know that the “vapor” that comes out of a vaping device is","How much waste/garbage do you believe tobacco/vaping products produce? "]
      let tobaccoAnswers=[["mostly harmless water", "some aerosolized chemicals", "mosstly aerosolized chemicals"],["not at all", "a little", "a moderate amount, a lot"]]
    //   let zip = (a1, a2) => a1.map((x, i) => [x, a2[i]]); 
      return(tobaccoBank.map((question, index) => {
        // console.log( tobaccoAnswers[index])
        return(
            <div>
            <h4>{question}</h4>
            <Answers  answerset={tobaccoAnswers[index]} question={question}/>
            </div>
        )
     }, []))
}

export default Questions;
