import { useState } from "react";
import { FormRow, Alert } from ".";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from '@mui/material/Slider';

const Answers = ({form,answerset,question})=>{
    const {
        user,
        showAlert,
        teacher,
        displayAlert,
        updateLocation,
        isLoading,
        enterCode,
      } = useAppContext();
    //   let answerlist=(answerset["answerset"])
    
  
    // <form className="form" onSubmit={handleSubmit}>
    //     <h2>{form["form"]}</h2>
     return(
        <form>
            <h1>{form["form"]}</h1>
        <h4>{question}</h4>
        {(answerset.map((answer)=>{
            return(
            <div>
                <input type="radio" value={answer} name={question} /> {answer}            
            </div>
        )
        }))}

        <button type="submit">Submit</button>
        </form>
     )
}

export default Answers;

