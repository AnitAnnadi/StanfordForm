import Wrapper from "../assets/wrappers/Navbar";
import { FaAlignLeft, FaUserCircle, FaCaretDown } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";
import { useAppContext } from "../context/appContext";
import Logo from "./Logo";
import { useState, useEffect } from "react";
import {useTranslation} from "react-i18next";

const Navbar = () => {
  const [showLogout, setShowLogout] = useState(false);
  const { toggleSidebar, logoutUser, user } = useAppContext();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const { t, i18n } = useTranslation();

  useEffect(() => {
    const currentLanguage = i18n.language;

    setCurrentLanguage(currentLanguage);
  });

  return (
    <Wrapper>
      <div className="nav-center">
        <button type="button" className="toggle-btn" onClick={toggleSidebar}>
          <FaAlignLeft />
        </button>
        <div>
          {/* <Logo /> */}
          <h3 className="logo-text">{t('dashboard', 'dashboard')}</h3>
        </div>
        <div className="nav-options">
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
          <div className="btn-container">
            <button
              type="button"
              className="btn"
              onClick={() => setShowLogout(!showLogout)}
            >
              <FaUserCircle />
              {user?.name}
              <FaCaretDown />
            </button>
            <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
              <button type="button" className="dropdown-btn" onClick={logoutUser}>
                {t('logout', 'logout')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
