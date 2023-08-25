import { Link } from 'react-router-dom'
import img from '../assets/images/not-found.svg'
import { useState,useEffect } from 'react'
import { Logo, FormRow, Alert } from "../components";
import Wrapper from '../assets/wrappers/ErrorPage'
import { useAppContext } from '../context/appContext';

const ResetPassword = () => {
    const initialState = {
        email: "",
        password: "",
        confirm:""
      };
    const [values, setValues] = useState(initialState);
    const currentURL = new URL(window.location.href);
    console.log(currentURL.pathname)
    const [, , token] = currentURL.pathname.split('/');
    const { forgotPassword, isLoading, showAlert, verifyReset, displayAlert } =
    useAppContext();

    const onSubmit = (e)=>{
        e.preventDefault();
        const { email, password,confirm } = values;
        console.log(email)
        if (password!==confirm ){
            displayAlert(true);
            return;
          }
        if (email){
            verifyReset({token,email, password});
        }
    }
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
      };
  return (
    <div>
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <h3>Reset Passsword</h3>
        {showAlert && <Alert />}

        {/* email input */}
        <FormRow
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}
        />
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
          Send Email
        </button>
      </form>
    </Wrapper>
    </div>
  )
}

export default ResetPassword
