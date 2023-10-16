import React, { useEffect, useState } from "react";
import axios from "axios"; // Import Axios
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";
import { Alert } from "../components";
import Wrapper from "../assets/wrappers/ResponseGroup";

const LocationRequests = () => {
  const {
    approveLocationRequest,
    showAlert,
    displayAlert,
    alertText,
    declineLocationRequest,
    handleChange,
    approved,
    declined,
  } = useAppContext();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getParams = { approved: false };

    const urlSearchParams = new URLSearchParams(getParams);

    const fetchData = async () => {
      try {
        handleChange({ name: "approved", value: false });
        handleChange({ name: "decline", value: false });
        const { data } = await axios.get(
          `/api/v1/locations?${urlSearchParams}`
        );
        const { locations, users } = data;
        setUsers(users);
        setLocations(locations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [approved, declined]);

  const declineAndSelectLocationRequest = async (_id, name) => {
    console.log(name);
    navigate(`/selectLoc`, {
      state: {
        adminTeacher: false,
        selectSchool: false,
        fromProfile: false,
        forOther: _id,
        requestedName: name,
      },
    });
  };

  // Return JSX or UI elements here
  return (
    <div>
      {showAlert && <Alert />}
      {locations.length > 0 ? (
        locations.map((location, index) => (
          <Wrapper style={{ marginBottom: "1.2rem" }}>
            <header>
              {/* <div className="main-icon">{school.school.charAt(0)}</div> */}
              <div className="info">
                <h5>
                  {users[index]?.name} ({users[index]?.email})
                </h5>
                <p>
                  {location.city}, {location.state}
                </p>
                <p>
                  {location.county}, {location.district}
                </p>
                <p>{location.name}</p>
              </div>
            </header>
            <div className="content" key={location._id}>
              <div className="content-center">
                {/* <span className='icon'>{icon}</span>
             <span className='text'>{text}</span> */}
              </div>
              <footer>
                <div className="actions">
                  <button
                    className="btn edit-btn"
                    onClick={() => approveLocationRequest(location._id)}
                  >
                    Approve Request
                  </button>
                  <button
                    style={{
                      backgroundColor: "#f8d7da",
                      color: "#842029",
                    }}
                    className="btn edit-btn"
                    onClick={() => declineLocationRequest(location._id)}
                  >
                    Decline Request
                  </button>
                  <button
                    style={{ backgroundColor: "#627d98", color: "#fff" }}
                    className="btn edit-btn grey-btn"
                    onClick={() =>
                      declineAndSelectLocationRequest(
                        location._id,
                        users[index]?.name
                      )
                    }
                  >
                    Decline Request & Add Location
                  </button>
                </div>
              </footer>
            </div>
          </Wrapper>
        ))
      ) : (
        <p> No pending requests</p>
      )}
    </div>
  );
};

export default LocationRequests;
