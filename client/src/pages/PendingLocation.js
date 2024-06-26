import { Link } from "react-router-dom";
// import img from "../assets/images/not-found.svg";
import { useState, useEffect } from "react";
import { Logo, FormRow, Alert } from "../components";
import Wrapper from "../assets/wrappers/ErrorPage";
import { useAppContext } from "../context/appContext";
import { useNavigate, useLocation } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
// import { NavLink } from "react-router-dom";
// import { ThreeDots } from "react-loader-spinner";
import {Trans, useTranslation} from 'react-i18next';

const PendingLocation = () => {
  const {
    getLocations,
    pendingLocations,
    handleChange,
    userLocations,
    showAlert,
    displayAlert,
    alertText,
    user,
    successAlert,
  } = useAppContext();

  const { t, i18n } = useTranslation();

  useEffect(() => {
    getLocations({ user });
  }, []);

  const navigate = useNavigate();
  const anotherLocation = (event) => {
    event.preventDefault(); 
    handleChange({ name: "pendingApproval", value: false });
    successAlert("Redirecting...");
    setTimeout(() => {
      navigate("/selectLoc", {
        state: { adminTeacher: false, selectSchool: false, fromProfile: true },
      });
    }, 2000);
  };
  
  const home = () => {
    handleChange({ name: "pendingApproval", value: false });
    setTimeout(() => {
      navigate("/", {});
    }, 2000);
  };
  return (
    <div>
      <Wrapper className="full-page">
        <form className="form">
          {showAlert && <Alert />}
          <label
            className="form-label">
            {t('pending_location_1', 'Your custom location request for')}{" "}
            {pendingLocations?.map((location) => location.name)}{" "}{t('pending_location_2', 'is currently under review. Please check back in 24 hours and contact sgerbert@stanford.edu if you have any questions.')}
          </label>
          <button onClick={anotherLocation} className="btn btn-block">
            {t('select_another_location', 'Select Another Location')}
          </button>
          {console.log(user.adminTeacher, userLocations)}
          {(user.adminTeacher && userLocations.length >= 2) ||
          (userLocations.length > 0 &&
            (user.role == "Site Admin" || user.role === "Teacher")) ? (
            <div
              className="dashboard-link"
              style={{
                display: "flex",
                columnGap: "0.5rem",
                marginTop: "1rem",
                alignContent: "center",
                minWidth: "100%",
                justifyContent: "flex-end",
              }}
            >
              {t('go_to_dashboard', 'Go to Dashboard')}
              <Link
                to="/"
                className="location-icon"
                style={{ fontSize: "1.5rem" }}
              >
                <BsArrowRight />
              </Link>
            </div>
          ) : null}
        </form>
      </Wrapper>
    </div>
  );
};

export default PendingLocation;
