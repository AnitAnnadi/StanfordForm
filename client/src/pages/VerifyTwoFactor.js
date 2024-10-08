import { Link } from 'react-router-dom'
import img from '../assets/images/not-found.svg'
import { useState,useEffect } from 'react'
import { Logo, FormRow, Alert } from "../components";
import Wrapper from '../assets/wrappers/ErrorPage'
import { useAppContext } from '../context/appContext';
import { useNavigate,useLocation } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';
import {useTranslation} from "react-i18next";

const VerifyTwoFactor = () => {

    const { t, i18n } = useTranslation();

    const currentURL = new URL(window.location.href);
    const [, , _id] = currentURL.pathname.split('/');
    const {verify2fa,isLoading, showAlert, displayAlert,alertText,user} = useAppContext();
    useEffect(() => {
        verify2fa(_id);
      }, []); // Empty dependency array
      
    useEffect(() => {
    if (alertText==="User Successfully Created"){
        if (user.role==="Stanford Staff" && !user.adminTeacher){
        setTimeout(() => {
            navigate("/locationRequests");
            }, 2000)
        }
        else if(user.role==="Stanford Staff" && user.adminTeacher) {
          setTimeout(() => {
            navigate("/selectLoc", {
              state: { adminTeacher: false, selectSchool:true, fromProfile:false }
            });
          }, 2000);
        }
        else{
          setTimeout(() => {
            navigate("/selectLoc", {
              state: { adminTeacher: user.adminTeacher, selectSchool:false, fromProfile:false }
            });
          }, 2000);
        }
        
    }
    if (alertText==="The link has expired or already been used "){
        setTimeout(() => {
            navigate("/landing");
            }, 2000)
    }
    }, [showAlert, alertText]); 

      
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p>
              {t('creating_user', 'Creating User')}
            </p>
            <ThreeDots color="black" height={20} width={20} style={{ marginLeft: '10px' }} />
          </div>
          <div>
            {showAlert && <Alert />}
          </div>
        </div>
      );
          
}

export default VerifyTwoFactor
