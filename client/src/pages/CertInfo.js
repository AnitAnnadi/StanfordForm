import { Link } from 'react-router-dom'
import img from '../assets/images/not-found.svg'
import { useState,useEffect } from 'react'
import { Logo, FormRow, Alert } from "../components";
import Wrapper from '../assets/wrappers/ErrorPage'
import { useAppContext } from '../context/appContext';
import { useNavigate,useLocation } from 'react-router-dom';
import Error from './Error';
import {useTranslation} from "react-i18next";

const CertInfo = () => {
  const initialState = {
    name: "",
    emails: "", // NEW: comma-separated emails
  };
  const [values, setValues] = useState(initialState);
  const navigate = useNavigate();
  const { certificate, createCertificate, isLoading, showAlert, displayAlert } =
    useAppContext();
  const location = useLocation();
  const info = location?.state?.info;

  useEffect(() => {
    const { name } = values;
    if (certificate) {
      setTimeout(() => {
        navigate("/certificate", { state: { name } });
      }, 2000);
    }
  }, [certificate]);

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, emails } = values;
    if (!name) {
      displayAlert(true);
      return;
    }
    // Parse comma-separated list into an array of trimmed, non-empty emails
    const extraEmails = (emails || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    createCertificate({ name, info, extraEmails }); // pass along
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const { t } = useTranslation();

  return info ? (
    <div>
      <Wrapper className="full-page">
        <form className="form" onSubmit={onSubmit}>
          {showAlert && <Alert />}

          <label className="form-label">
            {t(
              'thanks_for_completion_certificate',
              'Thank you for completing Stanford REACH Lab’s course. In order to receive credit for completing the course AND to receive a certificate of completion, please enter your full first and last name.'
            )}
          </label>

          <FormRow
            labelText={"Full Name"}
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}
          />

          {/* NEW FIELD */}
          <FormRow
            labelText={t(
              'other_recipients_question',
              'Other than your teacher, would you like any other emails to receive your certificate? Enter as a comma-separated list.'
            )}
            type="text"
            name="emails"
            value={values.emails}
            handleChange={handleChange}
            placeholder="parent1@example.com, counselor@school.org"
          />

          <button type="submit" className="btn btn-block" disabled={isLoading}>
            {t('generate_certificate', 'Generate Certificate')}
          </button>
        </form>
      </Wrapper>
    </div>
  ) : (
    <Error />
  );
};

export default CertInfo;
