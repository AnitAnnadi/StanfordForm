import { Link } from 'react-router-dom'
import img from '../assets/images/not-found.svg'
import { useState } from 'react'
import { Logo, FormRow, Alert } from "../components";
import Wrapper from '../assets/wrappers/ErrorPage'
import { useAppContext } from '../context/appContext';
import {useTranslation} from "react-i18next";

const ForgotPassword = () => {
    const { forgotPassword, isLoading, showAlert } =
    useAppContext();
    const [email, setEmail] = useState(""); 
    const onSubmit = (e)=>{
        e.preventDefault();
        if (email){
            forgotPassword({email})
        }
    }
    const handleChange = (e)=>{
        
        setEmail(e.target.value)
    
    }

    const { t, i18n } = useTranslation();

  return (
    <div>
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <h3>
          {t('forgot_password', 'Forgot Password')}
        </h3>
        {showAlert && <Alert />}

        {/* email input */}
        <FormRow
          type="email"
          name="Email Address"
          value={email}
          handleChange={handleChange}
        />
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          {t('request_reset_link', 'Request Reset Link')}
        </button>
      </form>
    </Wrapper>
    </div>
  )
}

export default ForgotPassword
