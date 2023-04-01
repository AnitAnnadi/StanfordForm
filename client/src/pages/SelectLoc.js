import { useState } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { v4 as uuid } from "uuid";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SelectLoc = () => {
  const { user, showAlert, displayAlert, updateLocation, isLoading } =
    useAppContext();
  const navigate = useNavigate();

  const [state, setState] = useState(user?.state);
  const [city, setCity] = useState(user?.city);
  const [school, setSchool] = useState(user?.school);
  let states = ["CA", "FL", "AL", "MO"];
  let cities = ["San Francisco", "Dublin", "Los Angeles", "Miami"];
  let schools = [
    "Dublin High School",
    "SF High",
    "Los Angeles Prep",
    "Miami Middle School",
  ];
  const handleChange = (e) => {
    setState(e.target.value);
    setCity(e.target.value);
    setSchool(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(state, city, school);
    if (!state || !city || !school) {
      displayAlert();
      return;
    }
    updateLocation({ state, city, school });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div
      className="full-page"
      style={{ display: "grid", alignItems: "center", padding: "0 1.5rem" }}
    >
      <Wrapper>
        <form className="form" onSubmit={handleSubmit}>
          {showAlert && <Alert />}
          <div className="form">
            <h4>State</h4>
            <select
              name="aliasChoice"
              value={state}
              onChange={(e) => setState(e.target.value)}
              defaultValue
              className="form-select"
            >
              <option value={"default"} selected>
                Choose your State
              </option>
              {states.map((state, index) => {
                return (
                  <option key={index} value={state}>
                    {state}
                  </option>
                );
              })}
            </select>
            <h4 className="form-title">City</h4>
            <select
              name="aliasChoice"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-select"
            >
              <option value={"default"} selected>
                Choose your City
              </option>
              {cities.map((city, index) => {
                return (
                  <option key={index} value={city}>
                    {city}
                  </option>
                );
              })}
            </select>
            <h4 className="form-title">School</h4>
            <select
              name="aliasChoice"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="form-select"
            >
              <option value={"default"} selected>
                Choose your School
              </option>
              {schools.map((school, index) => {
                return (
                  <option key={index} value={school}>
                    {school}
                  </option>
                );
              })}
            </select>
            <button
              className="btn btn-block"
              type="submit"
              disabled={isLoading}
              onSubmit={(e) => handleSubmit(e.target.value)}
              style={{ marginTop: "1.38rem" }}
            >
              {isLoading ? "Please Wait..." : "submit"}
            </button>
          </div>
        </form>
      </Wrapper>
    </div>
  );
};

export default SelectLoc;
/*<FormRow
            type='text'
            name='State'
            value={state}
            handleChange={(e) => setState(e.target.value)}
          />*/
