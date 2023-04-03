import { useState } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Tobacco = (info) => {

    const {submitForm,Alert,showAlert}=useAppContext()
    console.log(info)
    const navigate = useNavigate();
    let selected=[]
    const handleSubmit = (e) => {
        e.preventDefault();
        let names=["I know that the cannabis that comes out of a vaping device is:","Waste/Garbage"]
        names.map((name)=>{
            let checks=document.getElementsByName(name)
            for (var check of checks)
            {
            if (check.checked) {
                selected.push(check.value)
            }
            }
        })
        submitForm(names,selected,localStorage.getItem('code'),info["grade"],info["when"])

        navigate("/success", {
          });
        
      };

  return (
    <div
      className="full-page"
      style={{ display: "flex", alignItems: "center", padding: "0 1.5rem" }}
    >
      <Wrapper>
        <form className="form" onSubmit={handleSubmit}>
            <h4>{info["form"]}</h4>
          {showAlert && <Alert />}
          {/* <h4>You have joined {teacher_name}'s class</h4> */}
          <div className="form">
            <h4>I know that the Tobacco that comes out of a vaping device is:</h4>
            <input type="radio" value={"mostly harmless water"} name={"I know that the cannabis that comes out of a vaping device is:"} /> mostly harmless water <br/>
            <input type="radio" value={"some aerosolized chemicals"} name={"I know that the cannabis that comes out of a vaping device is:"} /> some aerosolized chemicals <br/>
            <input type="radio" value={"mosstly aerosolized chemicals"} name={"I know that the cannabis that comes out of a vaping device is:I know that the cannabis that comes out of a vaping device is:"} /> mosstly aerosolized chemicals <br/>

            <h4 className="form-title">How Much Waste/Garbage Do You Believe Tobacco Products Produce?</h4>
            <input type="radio" value={"not at all"} name={"Waste/Garbage"} /> not at all <br/>
            <input type="radio" value={"a little"} name={"Waste/Garbage"} />  a little <br/>
            <input type="radio" value={"a moderate amount"} name={"Waste/Garbage"} />  a moderate amount <br/>
            <input type="radio" value={"a lot"} name={"Waste/Garbage"} />  a lot <br/>
            <button
              className="btn btn-block"
              type="submit"
              onSubmit={(e) => handleSubmit(e.target.value)}
              style={{ marginTop: "1.38rem" }}
            >
              submit
              {/* {isLoading ? "Please Wait..." : "submit"} */}
            </button>
          </div>
        </form>
      </Wrapper>
    </div>
  );
};

export default Tobacco;
