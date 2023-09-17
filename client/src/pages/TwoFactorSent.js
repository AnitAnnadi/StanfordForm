import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import { Alert, Loading } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { ThreeDots } from 'react-loader-spinner';


const TwoFactorSent = () => {
  const location = useLocation();
  const currentUser = location.state?.currentUser;
  const { resendEmail, isLoading, showAlert, displayAlert } = useAppContext();
  const [isResending, setIsResending] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsResending(true);
      await resendEmail(currentUser.email);
      setIsResending(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="full-page"
      style={{ display: "flex", alignItems: "center", padding: "0 1.5rem" }}
    >
      <Wrapper>
        <div className="form">
          <h3>
            Complete Two Factor Authentication from the link sent to {currentUser?.email}.
          </h3>
          <form onSubmit={onSubmit}>
            {showAlert && <Alert />}
            <button
            type="submit"
            className="btn btn-block"
            disabled={isLoading || isResending}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
            {isResending ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ margin: 0 }}>Resending Email</p>
                <ThreeDots color="black" height={20} width={20} style={{ marginLeft: '10px' }} />
                </div>
            ) : (
                "Resend Email"
            )}
            </button>
          </form>
        </div>
      </Wrapper>
    </div>
  );
};

export default TwoFactorSent;
