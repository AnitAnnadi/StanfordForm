import { Link } from 'react-router-dom'
import img from '../assets/images/not-found.svg'
import { useState } from 'react'
import { Logo, FormRow, Alert } from "../components";
import Wrapper from '../assets/wrappers/ErrorPage'
import { useAppContext } from '../context/appContext';

const ForgotPassword = () => {
    const { forgotPassword, isLoading, showAlert } =
    useAppContext();
    const [email, setEmail] = useState(""); 
    const onSubmit = (e)=>{
        e.preventDefault();
        console.log(email)
        if (email){
            forgotPassword({email})
        }
    }
    const handleChange = (e)=>{
        
        setEmail(e.target.value)
    
    }
  return (
    <div>
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <h3>Forgot Passsword</h3>
        {showAlert && <Alert />}

        {/* email input */}
        <FormRow
          type="email"
          name="Email Address"
          value={email}
          handleChange={handleChange}
        />
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          Request Reset Link
        </button>
      </form>
    </Wrapper>
    </div>
  )
}

export default ForgotPassword
