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


    const {getLocations,pendingLocations,handleChange, userLocations,showAlert, displayAlert,alertText,user, su} = useAppContext();
    // useEffect(() => {
    //     verify2fa(_id);
    //   }, []); // Empty dependency arra
    useEffect(()=>{
        getLocations({user})
        },[])
      
    const navigate = useNavigate();
    const anotherLocation=()=>{
        handleChange({ name: "pendingApproval", value: false });
        setTimeout(() => {
            navigate("/selectLoc", {
              state: { adminTeacher: false, selectSchool:false, fromProfile:true }
            });
            }, 2000)
    }
    const home=()=>{
        handleChange({ name: "pendingApproval", value: false });
        setTimeout(() => {
            navigate("/", {
            });
            }, 2000)
    }
    console.log(pendingLocations)
    return (
        <div>
        {showAlert && <Alert/>}
        <p>
            Your custom location request for (
            {pendingLocations.map((location) => (
                location.name
            ))}
            ) is currently under review. Please check back in 24 hours and contact
            sgerbert@stanford.edu if you have any questions
        </p>

        <button
                  onClick={anotherLocation}
                  className="btn btn-hero"
        >
            Select Another Location
        </button>
        {userLocations.length>0 && user.role!=="Site Admin"?
        <button
        onClick={home}
        className="btn btn-hero"
        >Go to Dashboard</button>:
        null
        }
        </div>
      );
          
}

export default PendingLocation
