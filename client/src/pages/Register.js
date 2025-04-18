import { useState, useEffect } from "react";
import { Logo, FormRow, Alert } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { useAppContext } from "../context/appContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Logo2 from "../assets/images/logo.png";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";
// import { Select } from "@mui/material";
const initialState = {
  name: "",
  email: "",
  password: "",
  state: "",
  city: "",
  school: "",
  isMember: false,
  confirm: "",
  adminTeacher: false,
};

const Register = () => {
  let role = "";
  let adminroles = [
    "Site Admin",
    "District Admin",
    "County Admin",
    "State Admin",
    "Stanford Staff",
  ];
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const type = searchParams.get("type");

  let adminbool = false;
  const [values, setValues] = useState(initialState);
  const [adminRole, setAdminRole] = useState("default");
  const {
    twofaSent,
    user,
    pendingLocations,
    isLoading,
    showAlert,
    displayAlert,
    setupUser,
    hasLocation,
    errorAlert,
    userLocations,
  } = useAppContext();
  const captchaRef = useRef(null);

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const { t, i18n } = useTranslation();

  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    const currentLanguage = i18n.language;

    setCurrentLanguage(currentLanguage);
  });

  function AdminRole() {
    if (type == "admin") {
      return (
        <div>
          <label className="form-label" style={{ fontSize: "1rem" }}>
            {t("UP_role", "Role")}
          </label>
          <select
            name="adminRole"
            value={adminRole}
            onChange={handleAdminRole}
            className="form-row form-select"
          >
            <option value={"default"}>
              {t("choose_your_role", "Choose your Role")}
            </option>
            {adminroles.map((role, index) => {
              return (
                <option key={index} value={role}>
                  {t(role, role)}
                </option>
              );
            })}
          </select>
        </div>
      );
    }
  }

  const handleAdminRole = (e) => {
    setAdminRole(e.target.value);
  };
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleCheckChange = (e) => {
    setValues({ ...values, adminTeacher: !values.adminTeacher });
  };

  const resetPassword = () => {
    navigate("/forgotpassword");
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const {
      name,
      email,
      password,
      isMember,
      state,
      city,
      school,
      confirm,
      adminTeacher,
    } = values;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    if (password !== confirm && !isMember) {
      displayAlert(true);
      return;
    }
    if (type == "teacher") {
      role = "Teacher";
    }

    if (!isMember && type == "admin") {
      if (adminRole == "default") {
        displayAlert();
        return;
      } else {
        role = adminRole;
      }
    }
    if (role === "Stanford Staff") {
      const lowercaseEmail = email.toLowerCase();
      // if (!lowercaseEmail.endsWith('@stanford.edu')){
      //   errorAlert("The email does not match with the role.");
      //   return
      // }
    }
    const currentUser = { name, email, password, role, state, city, school };
    if (isMember) {
      setupUser({
        currentUser,
        // null,
        endPoint: "login",
        alertText: "Login Successful! Redirecting...",
      });
    } else {
      const captcha = captchaRef.current.getValue();
      await setupUser({
        currentUser,
        captcha,
        adminTeacher,
        endPoint: "register",
        alertText:
          type === "admin" ? "Redirecting..." : "User Created! Redirecting...",
      });
    }
  };

  useEffect(() => {
    if (!type || (type !== "teacher" && type !== "admin")) {
      return navigate("/landing");
    }
    console.log(user?.role, user?.adminTeacher);
    if ((user?.role == "Stanford Staff") & !user?.adminTeacher) {
      setTimeout(() => {
        navigate("/locationRequests");
      }, 2000);
    }
    if (user?.role == "Site Admin" && pendingLocations.length >= 1) {
      setTimeout(() => {
        navigate("/pendingLocation");
      }, 2000);
      return;
    } else if (
      user?.role == "Teacher" &&
      !hasLocation &&
      pendingLocations.length >= 1
    ) {
      setTimeout(() => {
        navigate("/pendingLocation");
      }, 2000);
      return;
    } else if (
      user?.adminTeacher &&
      userLocations.length == 1 &&
      pendingLocations.length >= 1
    ) {
      setTimeout(() => {
        navigate("/pendingLocation");
      }, 2000);
      return;
    }
    if (
      (user && hasLocation) ||
      (user?.role === "Stanford Staff" && !user.adminTeacher)
    ) {
      adminroles.map((role) => {
        if (role == user.role) {
          adminbool = true;
        }
      });
      if (adminbool & !user.adminTeacher) {
        if (user.role == "Stanford Staff") {
          setTimeout(() => {
            navigate("/locationRequests");
          }, 2000);
        } else {
          setTimeout(() => {
            navigate("/metrics");
          }, 2000);
        }
      } else {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } else if (user && !hasLocation) {
      //   if (user.adminTeacher){
      //     if ((userLocations.length>=1 && user.role!=="Stanford Staff" && user.role !== "Site Admin" )|| (user.role=="Stanford Staff" && userLocations.length<1) || (user.role == "Site Admin" && userLocations.length<1)){
      //       console.log(userLocations.length)
      //       setTimeout(() => {
      //         navigate("/selectLoc", {
      //           state: { adminTeacher: false, selectSchool:true, fromProfile:false }
      //         });
      //       }, 2000);
      //     }
      if (
        user.adminTeacher &&
        ((user.role == "Stanford Staff" && userLocations.length >= 1) ||
          (user.role == "Site Admin" && userLocations.length >= 1))
      ) {
        setTimeout(() => {
          navigate("/");
        }, 2000);
        return;
      }
      //     else{
      //       setTimeout(() => {
      //         navigate("/selectLoc", {
      //           state: { adminTeacher: true, selectSchool:false, fromProfile:false }
      //         });
      //       }, 2000);
      //     }
      //   }
      else {
        setTimeout(() => {
          navigate("/selectLoc");
        }, 2000);
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    const { name, email, password, isMember, state, city, school, confirm } =
      values;
    const currentUser = { name, email, password, role, state, city, school };

    if (twofaSent === true) {
      setTimeout(() => {
        navigate("/two-factor-sent", { state: { currentUser } });
      }, 2000);
    }
  }, [twofaSent]);

  return (
    <div>
      <Wrapper className="full-page">
        <form className="form" onSubmit={onSubmit}>
          {!values.isMember && (
            <button
              type="button"
              onClick={toggleMember}
              className="btn top-btn"
            >
              Registered? Click here
            </button>
          )}
          <h3>
            {values.isMember
              ? t("UP_login", "Login")
              : t("UP_register", "Register")}
          </h3>
          {showAlert && <Alert />}
          {/* name input */}
          {!values.isMember && (
            <FormRow
              type="text"
              name="name"
              value={values.name}
              handleChange={handleChange}
            />
          )}
          {/* email input */}
          <FormRow
            type="email"
            name="email"
            value={values.email}
            handleChange={handleChange}
          />
          {/* password input */}
          <FormRow
            type="password"
            name="password"
            value={values.password}
            handleChange={handleChange}
          />
          {!values.isMember && (
            <FormRow
              type="password"
              labelText="Confirm Password"
              name="confirm"
              value={values.confirm}
              handleChange={handleChange}
            />
          )}
          {values.isMember ? (
            <button
              type="button"
              onClick={resetPassword}
              className="member-btn"
            >
              {t("forgot_password", "Forgot Password?")}
            </button>
          ) : null}
          {!values.isMember && <AdminRole />}
          {!values.isMember && type == "admin" && (
            <label className="checkbox-container">
              {t("i_am_also_a_teacher", "I am also a teacher")}
              <input
                type="checkbox"
                className="checkbox"
                name="adminTeacher"
                value={values.adminTeacher}
                checked={values.adminTeacher}
                onChange={handleCheckChange}
              />
              <span className="checkbox-checkmark"></span>
            </label>
          )}
          {!values.isMember && (
            <ReCAPTCHA
              ref={captchaRef}
              sitekey={"6LerfqAnAAAAAB86YDhcCf0XanGHJXHQkvyxY6fJ"}
            />
          )}
          <button type="submit" className="btn btn-block" disabled={isLoading}>
            {t("submit", "submit")}
          </button>
          <p>
            {values.isMember
              ? t("dont_have_an_account", "Don't have an account?")
              : t("have_an_account", "Have an account?")}
            <button type="button" onClick={toggleMember} className="member-btn">
              {values.isMember
                ? t("UP_register", "Register")
                : t("UP_login", "Login")}
            </button>
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="language-select-container">
              <MdLanguage className="language-select-icon" />
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
        </form>
      </Wrapper>
      <img width="200" height="90" src={Logo2} className="corner-logo" />
    </div>
  );
};
export default Register;
