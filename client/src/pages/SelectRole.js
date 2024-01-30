import React from "react";
import { useState, useEffect } from "react";
import { Logo, FormRow, Alert } from "../components";
import Logo2 from "../assets/images/logo.png";
import Wrapper from "../assets/wrappers/LandingPage";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {useTranslation} from "react-i18next";
import {MdLanguage} from "react-icons/md";

function SelectRole() {
  const [role, setRole] = useState("");
  const handleClick = (e) => {
    setRole(e.target.value);
    localStorage.setItem("role", role);
  };

  const { t, i18n } = useTranslation();

  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const currentLanguage = i18n.language;

    setCurrentLanguage(currentLanguage);
  });

  return (
    // <React.Fragment>
    <Wrapper>
      <div className="content">
        <h2>{t('i_am_a', 'I am a') + "..."}</h2>
        <div className="landing-btns">
          <Link
            to="/register?type=teacher"
            className="btn btn-hero"
            onClick={handleClick}
            value={"teacher"}
          >
            {t('UP_teacher', 'Teacher')}
          </Link>
          <Link
            to="/register?type=admin"
            className="btn btn-hero"
            onClick={handleClick}
            value={"admin"}
          >
            {t('UP_admin', 'Admin')}
          </Link>
        </div>
        <div className="language-select-container">
          <MdLanguage className="language-select-icon"/>
          <select
            className="language-select"
            value={currentLanguage}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="es">Español</option>
            <option value="zh">中文</option>
          </select>
        </div>
      </div>
      <img width="200" height="100" src={Logo2} className="corner-home-logo" />
    </Wrapper>
  );
}

export default SelectRole;
