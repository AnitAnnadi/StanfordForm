import { Link } from 'react-router-dom'
import img from '../assets/images/not-found.svg'
import { useState,useEffect } from 'react'
import { Logo, FormRow, Alert } from "../components";
import Wrapper from '../assets/wrappers/ErrorPage'
import { useAppContext } from '../context/appContext';
import { useNavigate,useLocation } from 'react-router-dom';
import Error from './Error';
const CertInfo = () => {
    const initialState = {
        name: "",
      };
    const [values, setValues] = useState(initialState);
    const navigate = useNavigate();
    const { certificate, createCertificate, isLoading, showAlert, displayAlert } =
    useAppContext();
    const location = useLocation();
    const info = location?.state?.info;
    useEffect(()=>{
      const {name} = values;
        if (certificate){
          setTimeout(() => {
            navigate("/certificate", {state:{name}});
          }, 2000);
        }
      },[certificate])
    const onSubmit = (e)=>{
        e.preventDefault();
        const {name} = values;
        if (!name ){
            displayAlert(true);
            return;
          }
        createCertificate({name, info});
    }
    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
      };

  return (
    info?
    <div>
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        {showAlert && <Alert />}
        <label  className='form-label'>
        Thank you for completing Stanford REACH Lab’s course. In order to receive credit for completing the course AND to receive a certificate of completion, please enter your full first and last name.
        </label>
 
        <FormRow
        labelText={"Full Name"}
          type="name"
          name="name"
          value={values.name}
          handleChange={handleChange}
        />
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          Generate Certificate
        </button>
      </form>
    </Wrapper>
    </div>:<Error/>
  )
}

export default CertInfo
