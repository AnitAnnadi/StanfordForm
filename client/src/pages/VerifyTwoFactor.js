import { Link } from 'react-router-dom'
import img from '../assets/images/not-found.svg'
import { useState,useEffect } from 'react'
import { Logo, FormRow, Alert } from "../components";
import Wrapper from '../assets/wrappers/ErrorPage'
import { useAppContext } from '../context/appContext';
import { useNavigate,useLocation } from 'react-router-dom';
import { Loading } from "../components";
const VerifyTwoFactor = () => {
    const currentURL = new URL(window.location.href);
    const [, , _id] = currentURL.pathname.split('/');
    console.log(_id)
    const {verify2fa,isLoading, showAlert, displayAlert} = useAppContext();
    useEffect(() => {
        verify2fa(_id)
      }, []); 
      useEffect(() => {
        if (showAlert){
            setTimeout(() => {
                navigate("/selectLoc");
              }, 1000)
        }
      }, [showAlert]); 

      
    const navigate = useNavigate();

  return (
    <div>
    <Loading center />    
    {showAlert && <Alert />}
    </div>
  )
}

export default VerifyTwoFactor
