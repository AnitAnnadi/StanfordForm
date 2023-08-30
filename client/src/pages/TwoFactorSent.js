import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import { Alert, Loading } from '../components';

const TwoFactorSent = () => {
  const location = useLocation();
  const currentUser = location.state?.currentUser;
  const { resendEmail, isLoading, showAlert, displayAlert } = useAppContext();
  const [isResending, setIsResending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsResending(true);
      console.log(location.state)
      await resendEmail(currentUser.email);
      setIsResending(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <p>Complete Two Factor Authentication from the link sent to your email.</p>
      <form onSubmit={onSubmit}>
        <button type="submit" className="btn btn-block" disabled={isLoading || isResending}>
          {isResending ? 'Resending...' : 'Resend Email'}
        </button>
      </form>
      {showAlert && <Alert />}
    </div>
  );
};

export default TwoFactorSent;
