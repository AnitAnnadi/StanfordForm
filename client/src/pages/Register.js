import { useState, useEffect } from "react";
import { Logo, FormRow, Alert } from "../components";
import Wrapper from "../assets/wrappers/RegisterPage";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Logo2 from "../assets/images/logo.png";
// import { Select } from "@mui/material";
const initialState = {
  name: "",
  email: "",
  password: "",
  state: "",
  city: "",
  school: "",
  isMember: true,
};

const Register = () => {
  let role = "";
  let adminroles = ["Site Admin", "District Admin", "County Admin", "State Admin", "Standford Staff"];
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = location.state;
  let adminbool=false
  const [values, setValues] = useState(initialState);
  const [adminRole, setAdminRole] = useState("default");
  const { user, isLoading, showAlert, displayAlert, setupUser, hasLocation } =
    useAppContext();

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };
  function AdminRole() {
    if (type == "admin") {
      return (
        <div>
          <label className="form-label" style={{ fontSize: "1rem" }}>
            Role
          </label>
          <select
            name="adminRole"
            value={adminRole}
            onChange={handleAdminRole}
            className="form-select"
          >
            <option value={"default"}>Choose your Role</option>
            {adminroles.map((role, index) => {
              return (
                <option key={index} value={role}>
                  {role}
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
  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember, state, city, school } = values;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }
    if (type == "teacher") {
      role = "Teacher";
    }
    if (type == "admin") {
      console.log(adminRole)
      if (adminRole=="default"){
        
        displayAlert();
        return;

      }
      else{
        role = adminRole;
      }
      
    }
    const currentUser = { name, email, password, role, state, city, school };

    if (isMember) {
      setupUser({
        currentUser,
        endPoint: "login",
        alertText: "Login Successful! Redirecting...",
      });
    } else {
      setupUser({
        currentUser,
        endPoint: "register",
        alertText: "User Created! Redirecting...",
      });
    }
  };

  useEffect(() => {
    if ((user && hasLocation) || (user?.role === 'Standford Staff')) {
      adminroles.map((role=>{
        if (role==user.role){
          adminbool=true
        }
      }))
      if (adminbool){
        setTimeout(() => {
          navigate("/metrics");
        }, 3000);
      }
      else{
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    
    } else if (user && !hasLocation) {
      setTimeout(() => {
        navigate("/selectLoc");
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <div>
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <h3>{values.isMember ? "Login" : "Register"}</h3>
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

        {!values.isMember && <AdminRole />}

        <button type="submit" className="btn btn-block" disabled={isLoading}>
          submit
        </button>
        <p>
          {values.isMember ? "Don't have an account?" : "Have an account?"}
          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  <img width="200" height="90" src={Logo2} className="corner-logo" />
    </div>
  );
};
export default Register;
