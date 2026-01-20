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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    setIsSubmitting(true);
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
          <h3 style={{ textAlign: 'center', marginBottom: '2rem' }}>
            {t('certificate_of_completion', 'Certificate of Completion')}
          </h3>

          {showAlert && <Alert />}

          <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
            <strong>{t('congratulations', 'Congratulations!')}</strong> {t('thanks_completion', "Thank you for completing Stanford REACH Lab's course. Please enter your full name below to receive your certificate.")}
          </p>

          <FormRow
            labelText={t('full_name', 'Full Name')}
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}
          />

          <div style={{ marginTop: '1.5rem' }}>
            <FormRow
              labelText={t(
                'other_recipients_question',
                'Additional Email Recipients (Optional)'
              )}
              type="text"
              name="emails"
              value={values.emails}
              handleChange={handleChange}
              placeholder="parent@example.com, counselor@school.org"
            />
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
              {t('comma_separated_note', 'Use commas to separate multiple email addresses')}
            </p>
          </div>

          <button type="submit" className="btn btn-block" disabled={isLoading || isSubmitting} style={{ marginTop: '2rem' }}>
            {isSubmitting ? t('generating', 'Generating...') : t('generate_certificate', 'Generate Certificate')}
          </button>
        </form>
      </Wrapper>
    </div>
  ) : (
    <Error />
  );
};

export default CertInfo;
