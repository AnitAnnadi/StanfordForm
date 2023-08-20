import React from "react";
import { useState, useEffect } from "react";
import { Logo, FormRow, Alert } from "../components";
import Logo2 from "../assets/images/logo.png";
import Wrapper from "../assets/wrappers/LandingPage";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function SelectRole() {
  const [role, setRole] = useState("");
  const handleClick = (e) => {
    setRole(e.target.value);
    localStorage.setItem("role", role);
  };

  return (
    // <React.Fragment>
    <Wrapper>
      <div className="content">
        <h2>I am a...</h2>
        <div className="landing-btns">
          <Link
            to="/register?type=teacher"
            className="btn btn-hero"
            onClick={handleClick}
            value={"teacher"}
          >
            Teacher
          </Link>
          <Link
            to="/register?type=admin"
            className="btn btn-hero"
            onClick={handleClick}
            value={"admin"}
          >
            Admin
          </Link>
        </div>
      </div>
      <img width="200" height="100" src={Logo2} className="corner-home-logo" />
    </Wrapper>
  );
}

export default SelectRole;
