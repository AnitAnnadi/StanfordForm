import { useState } from "react";
import { FormRow, Alert } from "../../components";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { v4 as uuid } from "uuid";
import { NavLink } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import HealthyFeatures from "../../components/HealthyFutures";
import { useNavigate } from "react-router-dom";

// Inside your component...

const Profile = () => {
  const {
    user,
    userLocations,
    showAlert,
    displayAlert,
    updateUser,
    isLoading,
    handleChange,
  } = useAppContext();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);

  const showAddLocation =
    user.role === "Teacher" ||
    (user.adminTeacher && user.role !== "Site Admin");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      displayAlert();
      return;
    }
    updateUser({ name, email });
  };

  const handleAddLocationClick = () => {
    navigate(`/selectLoc`, {
      state: { adminTeacher: false, selectSchool: false, fromProfile: true },
    });
  };
  let schoolLocations = [];
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
          {/* <hr /> */}
          <label
            className="form-label"
            style={{ fontSize: "1rem", marginBottom: 0 }}
          >
            role -{" "}
            <span style={{ letterSpacing: "0", color: "#102a43" }}>
              {user.role}
            </span>
          </label>
          <div
            style={{
              display: "flex",
              columnGap: "0.35rem",
              alignItems: "center",
            }}
          >
            {user.role != "Stanford Staff" ? (
              <label
                className="form-label"
                style={{ fontSize: "1rem", marginBottom: 0 }}
              >
                {user.adminTeacher && user.role != "Site Admin"
                  ? "admin location"
                  : "locations"}
              </label>
            ) : (
              <></>
            )}
            {showAddLocation && !user.adminTeacher && (
              <>
                <NavLink
                  to={`/selectLoc`}
                  className="location-link btn btn-block"
                >
                  <BiPlus />
                </NavLink>
              </>
            )}
          </div>
          {userLocations.map((location, index) => {
            const renderLocationInfo = () => {
              if (user.role === "Teacher" || user.role === "Site Admin") {
                return (
                  <>
                    {location.school} - {location.city}, {location.state}
                  </>
                );
              } else {
                if (
                  location.city === null ||
                  location.state === null ||
                  location.school === null
                ) {
                  if (user.role === "District Admin") {
                    return (
                      <>
                        {location.district} - {location.county},{" "}
                        {location.state}
                      </>
                    );
                  } else if (user.role === "County Admin") {
                    return (
                      <>
                        {location.county} - {location.state}
                      </>
                    );
                  } else if (user.role === "State Admin") {
                    return <>{location.state}</>;
                  } else if (user.role === "Stanford Staff") {
                    return <></>;
                  }
                } else {
                  schoolLocations.push(
                    `${location.school} - ${location.city}, ${location.state}`
                  );
                }
              }
            };

            return (
              <p key={index} className="location">
                {renderLocationInfo()}
              </p>
            );
          })}
          <div
            style={{
              display: "flex",
              columnGap: "0.35rem",
              alignItems: "center",
            }}
          >
            {user.adminTeacher && user.role !== "Site Admin" && (
              <label
                className="form-label"
                style={{ fontSize: "1rem", marginBottom: 0 }}
              >
                School locations
              </label>
            )}

            {showAddLocation && user.role != "Teacher" && (
              <button
                onClick={handleAddLocationClick}
                className="location-link btn btn-block"
                style={{ margin: 0 }}
              >
                <BiPlus />
              </button>
            )}
          </div>
          {schoolLocations.map((location, index) => (
            <p
              key={index}
              style={{ margin: "0", padding: "0", textIndent: "2rem" }}
            >
              {location}
            </p>
          ))}

          {user.role == "Teacher" || user.adminTeacher ? (
            <HealthyFeatures />
          ) : null}
          <button className="btn btn-block" type="submit" disabled={isLoading}>
            {isLoading ? "Please Wait..." : "save changes"}
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default Profile;
