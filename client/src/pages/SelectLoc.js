import { useState } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { v4 as uuid } from "uuid";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { narrowDistricts, narrowCities, narrowCounties, narrowSchools, getDistrictCounty } from "../utils/schoolDataFetch";
import contains from "validator/es/lib/contains";

const SelectLoc = () => {
  const { user, userLocations, showAlert, displayAlert, addLocation, isLoading } =
    useAppContext();
  const navigate = useNavigate();

  const [state, setState] = useState("default");
  const [city, setCity] = useState("default");
  const [school, setSchool] = useState("default");
  const [district, setDistrict] = useState("default");
  const [county, setCounty] = useState("default");

  const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California",
      "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida",
      "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas",
      "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
      "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
      "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
      "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
      "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
      "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

  const [cities, setCities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [counties, setCounties] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [multiplePeriods, setMultiplePeriods] = useState(false);

  const [additionalLoc, setAdditionalLoc] = useState(false);

  const [numOfLocations, setNumOfLocations] = useState(userLocations ? userLocations.length + 1 : 1);

  const showCounty = user.role === "District Admin" || user.role === "County Admin";
  const showCity = user.role === "Site Admin";
  const showDistrict = user.role === "District Admin";
  const showSchool = user.role === "Site Admin";
  const showMultiplePeriods = user.role === "Teacher";
  const showAdditionalLoc = user.role === "Teacher";

  const handleChange = (field, value) => {
    if (field === 'state') {
      setState(value);
      setCity('default')
      setSchool('default')

      if (value !== 'default') {
        setCities(narrowCities(value));
        setCounties(narrowCounties(value));
      }
    } else if (field === 'county') {
      setCounty(value);
      setDistrict('default')

      if (value !== 'default') {
          setDistricts(narrowDistricts(state, value));
      }
    } else if (field === 'city') {
      setCity(value);
      setSchool('default')

      if (value !== 'default') {
        setSchools(narrowSchools(state, value));
      }
    } else if (field === 'district') {
      setDistrict(value);
    } else if (field === 'school') {
      setSchool(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user.role === 'Standford Staff') {
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }

    if ((state === 'default') || (showCounty && county === 'default') || (showCity && city === 'default')
        || (showDistrict && district === 'default') || (showSchool && school === 'default')) {
        displayAlert();
        return;
    }

    if (user.role === 'Site Admin' || user.role === 'Teacher') {

      const {foundDistrict, foundCounty} = getDistrictCounty(state, city, school);

      setDistrict(foundDistrict);
      setCounty(foundCounty);
    }

    addLocation({
      multiplePeriods: multiplePeriods !== 'default' ? multiplePeriods: null,
      state: state,
      county: county !== 'default' ? county : null,
      city: city !== 'default' ? city : null,
      district: district !== 'default' ? district : null,
      school: school !== 'default' ? school : null,
    });


    if (additionalLoc) {
      setState('default')
      setCounty('default')
      setCity('default')
      setDistrict('default')
      setSchool('default')
      setMultiplePeriods(false)
      setAdditionalLoc(false)
      setNumOfLocations(numOfLocations + 1)
    } else {
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
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
            <h3 className="form-title">Select Location {numOfLocations > 1 ? numOfLocations : ""}</h3>
            <h4 className="form-title">State</h4>
            <select
              name="aliasChoice"
              value={state}
              onChange={(e) => handleChange("state", e.target.value)}
              className="form-select"
            >
              <option value={"default"}>
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
            {showCounty && <>
            <h4 className="form-title">County</h4>
            <select
              name="aliasChoice"
              value={county}
              onChange={(e) => handleChange("county", e.target.value)}
              className="form-select"
            >
              <option value={"default"}>
                Choose your County
              </option>
              {counties.map((county, index) => {
                return (
                  <option key={index} value={county}>
                    {county}
                  </option>
                );
              })}
            </select>
            </>}
            {showCity && <>
            <h4 className="form-title">City</h4>
            <select
              name="aliasChoice"
              value={city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="form-select"
            >
              <option value={"default"}>
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
            </>}
            {showDistrict && <>
            <h4 className="form-title">District</h4>
            <select
              name="aliasChoice"
              value={district}
              onChange={(e) => handleChange("district", e.target.value)}
              className="form-select"
            >
              <option value={"default"}>
                Choose your District
              </option>
              {districts.map((district, index) => {
                return (
                  <option key={index} value={district}>
                    {district}
                  </option>
                );
              })}
            </select>
            </>}
            {showSchool && <>
            <h4 className="form-title">School</h4>
            <select
              name="aliasChoice"
              value={school}
              onChange={(e) => handleChange("school", e.target.value)}
              className="form-select"
            >
              <option value={"default"}>
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
            </>}

            {showMultiplePeriods && <>
            <hr/>
            <label className="form-label">
            <input
              type="checkbox"
              className="form-checkbox"
              name="aliasChoice"
              checked={multiplePeriods}
              onChange={(e) => setMultiplePeriods(e.target.checked)}

            />  I teach multiple classes/periods at this location
            </label>
            </>}
            {showAdditionalLoc && <>
            <hr/>
            <label className="form-label">
            <input
              type="checkbox"
              className="form-checkbox"
              name="aliasChoice"
              checked={additionalLoc}
              onChange={(e) => setAdditionalLoc(e.target.checked)}
            />  I would like to submit an additional location
            </label>
            </>}
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
