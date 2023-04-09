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

  const showAddLocation = user.role === 'Teacher'

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
            {showAddLocation && <>
            <NavLink to={`/selectLoc`} className="location-link btn btn-block">
              <BiPlus />
            </NavLink>
            </>}
          </div>
          {userLocations.map((location, index) => {
            const renderLocationInfo = () => {
                if (user.role === "Teacher" || user.role === "Site Admin") {
                    return <>{location.school} - {location.city}, {location.state}</>
                } else if (user.role === "District Admin") {
                    return <>{location.district} - {location.county}, {location.state}</>
                } else if (user.role === "County Admin") {
                    return <>{location.county} - {location.state}</>
                } else if (user.role === "State Admin") {
                    return <>{location.state}</>
                } else if (user.role === "Standford Staff") {
                    return <></>
                }
            }

            return (
                <p key={index} className="location">
                    {renderLocationInfo()}
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
