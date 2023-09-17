import { Link } from 'react-router-dom'
import img from '../assets/images/not-found.svg'
import { useState,useEffect } from 'react'
import { Logo, FormRow, Alert } from "../components";
import Wrapper from '../assets/wrappers/ErrorPage'
import { useAppContext } from '../context/appContext';
import { useNavigate,useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';

const PendingLocation = () => {


    const {pendingSchool,handleChange, showAlert, displayAlert,alertText,user} = useAppContext();
    // useEffect(() => {
    //     verify2fa(_id);
    //   }, []); // Empty dependency arra
      
    const navigate = useNavigate();
    const anotherLocation=()=>{
        handleChange({ name: "pendingApproval", value: false });
        setTimeout(() => {
            navigate("/selectLoc", {
              state: { adminTeacher: false, selectSchool:false, fromProfile:true }
            });
            }, 2000)
    }
    return (
        <div>
        <p>Your custom location request for {pendingSchool} is currently under review. Please check back in 24 hours and contact sgerbert@stanford.edu if you have any questions</p>
        <button
                  onClick={anotherLocation}
                  className="btn btn-hero"
        >
            Select Another Location
        </button>
        </div>
      );
          
}

export default PendingLocation
