import { useState } from "react";
import { FormRow, Alert } from "../../components";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { v4 as uuid } from "uuid";
import { NavLink } from "react-router-dom";
import { BiPlus } from "react-icons/bi";

const Profile = () => {
  const {
    user,
    userLocations,
    showAlert,
    displayAlert,
    updateUser,
    isLoading,
  } = useAppContext();

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      displayAlert();
      return;
    }
    updateUser({ name, email });
  };

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3>profile</h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            type="text"
            name="name"
            value={name}
            handleChange={(e) => setName(e.target.value)}
          />
          <FormRow
            type="email"
            name="email"
            value={email}
            handleChange={(e) => setEmail(e.target.value)}
          />
          {/* <hr /> */}
          <div
            style={{
              display: "flex",
              columnGap: "0.35rem",
              alignItems: "center",
            }}
          >
            <label
              className="form-label"
              style={{ fontSize: "1rem", marginBottom: 0 }}
            >
              locations
            </label>
            <NavLink to={`/selectLoc`} className="location-link btn btn-block">
              <BiPlus />
            </NavLink>
          </div>
          {userLocations.map((location) => {
            return (
              <p key={location.index} className="location">
                {location.school} - {location.city}, {location.state}
              </p>
            );
          })}
          <button className="btn btn-block" type="submit" disabled={isLoading}>
            {isLoading ? "Please Wait..." : "save changes"}
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default Profile;
