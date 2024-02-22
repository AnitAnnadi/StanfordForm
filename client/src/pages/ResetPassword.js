import { Link } from 'react-router-dom'
import img from '../assets/images/not-found.svg'
import { useState,useEffect } from 'react'
import { Logo, FormRow, Alert } from "../components";
import Wrapper from '../assets/wrappers/ErrorPage'
import { useAppContext } from '../context/appContext';
import { useNavigate } from 'react-router-dom';
import {useTranslation} from "react-i18next";

const ResetPassword = () => {
    const initialState = {
        password: "",
        confirm:""
      };
    const [values, setValues] = useState(initialState);
    const navigate = useNavigate();

    const currentURL = new URL(window.location.href);
    const [, , token] = currentURL.pathname.split('/');
    const { resetPassword, forgotPassword, isLoading, showAlert, verifyReset, displayAlert } =
    useAppContext();
    useEffect(()=>{
        if (resetPassword){
          setTimeout(() => {
            navigate("/", {});
          }, 2000);
        }
      },[resetPassword])
    const onSubmit = (e)=>{
        e.preventDefault();
        const {  password,confirm } = values;
        if (password!==confirm ){
            displayAlert(true);
            return;
          }
        verifyReset({token, password});
    }
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
      };

    const { t, i18n } = useTranslation();

  return (
    <div>
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <h3>
          {t('reset_password', 'Reset Password')}
        </h3>
        {showAlert && <Alert />}

 
        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        />

        <FormRow
            type="password"
            labelText="Confirm Password"
            name="confirm"
            value={values.confirm}
            handleChange={handleChange}
          />   
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          {t('reset_password', 'Reset Password')}
        </button>
      </form>
    </Wrapper>
    </div>
  )
}

export default ResetPassword
