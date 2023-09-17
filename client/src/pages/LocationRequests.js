import React, { useEffect,useState } from 'react';
import axios from 'axios'; // Import Axios
import { useAppContext } from '../context/appContext';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../components';
const LocationRequests = () => {
  const { approveLocationRequest, showAlert, displayAlert, alertText, declineLocationRequest, handleChange, approved, declined } = useAppContext();
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const getParams = { approved: false };;

    const urlSearchParams = new URLSearchParams(getParams);

    const fetchData = async () => {
      try {
        handleChange({ name: "approved", value: false });
        handleChange({ name: "decline", value: false });
        const {data} = await axios.get(`/api/v1/locations?${urlSearchParams}`);
        const {locations, users} = data
        setUsers(users)
        setLocations(locations)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); 
  }, [approved, declined]); 

  // Return JSX or UI elements here
  return (
    <div>
      {showAlert && <Alert />}
{locations.length > 0 ? (
  locations.map((location, index) => (
    <div key={location._id}>
      <button onClick={() => approveLocationRequest(location._id)}>
        Approve Request
      </button>
      <button onClick={() => declineLocationRequest(location._id)}>
        Decline Request
      </button>
      <button>
        Decline Request and Add Location
      </button>

      <p>Teacher Name: {users[index].name} </p>
      <p>Teacher Email: {users[index].email} </p>
      <p>Location: {location.name}</p>
      <p>District: {location.district}</p>
      <p>Count: {location.county}</p>
      <p>City: {location.city}</p>
      <p>State: {location.state}</p>
      <br></br>
    </div>
  ))
) : <p> No pending requests</p>}
    </div>
  );
  };

export default LocationRequests;
