import { useState } from "react";
import { Alert } from "../components";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useEffect } from "react";
import Logo2 from "../assets/images/logo.png";
import {Link, useNavigate} from "react-router-dom";
import {
  narrowDistricts,
  narrowCities,
  narrowCounties,
  narrowSchools,
  getDistrictCounty, getSchoolObject,
} from "../utils/schoolDataFetch";
import CreateLocPopup from "../components/CreateLocPopup";
import {useTranslation} from "react-i18next";

const CreateLoc = () => {
  const {
    user,
    userLocations,
    showAlert,
    displayAlert,
    addNewLocation,
    isLoading,
    pendingApproval,
    successAlert,
    stanfordNewLoc
  } = useAppContext();
  const navigate = useNavigate();

  const [state, setState] = useState("default");
  const [city, setCity] = useState("default");
  const [school, setSchool] = useState("default");
  const [district, setDistrict] = useState("default");
  const [county, setCounty] = useState("default");

  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District of Columbia",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];
  useEffect(() => {
    if (pendingApproval){
      console.log(pendingApproval)
      setTimeout(() => {
        navigate("/pendingLocation");
      }, 2000);
    }
    if (stanfordNewLoc){
      successAlert("New Location Created");
      handleChange({ name: "stanfordNewLoc", value: false });
      setTimeout(() => {
        navigate("/locationRequests");
      }, 2000);
      
    }

  } , [pendingApproval,stanfordNewLoc]);

  const { t, i18n } = useTranslation();

  const [cities, setCities] = useState([]);
  const [counties, setCounties] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [multiplePeriods, setMultiplePeriods] = useState(false);

  let adminroles = [
    "Site Admin",
    "District Admin",
    "County Admin",
    "State Admin",
    "Standford Staff",
  ];
  let adminbool = false;
  const [additionalLoc, setAdditionalLoc] = useState(false);

  const [numOfLocations, setNumOfLocations] = useState(
    userLocations ? userLocations.length + 1 : 1
  );

  const handleChange = (field, value) => {
    if (field === "state") {
      setState(value);
      setCity("default");
      setSchool("default");

      if (value !== "default") {
        setCities(narrowCities({ state: value }));
        setCounties(narrowCounties({ state: value }));
      }
    } else if (field === "county") {
      setCounty(value);
      setDistrict("default");

      if (value !== "default") {
        setCities(narrowCities({ state, county: value }));
        setDistricts(narrowDistricts({ state, county: value }));
      }
    } else if (field === "city") {
      setCity(value);
      setSchool("default");

      if (value !== "default") {
        setDistricts(narrowDistricts({ state, county, city: value }));
      }
    } else if (field === "district") {
      setDistrict(value);
    } else if (field === "school") {
      setSchool(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      state === "default" ||
      (county === "default") ||
      (city === "default") ||
      (school === "default")
    ) {
      displayAlert();
      return;
    }
    successAlert("Redirecting...")
    addNewLocation({
      multiplePeriods: multiplePeriods,
      state: state,
      county: county !== "default" ? county : null,
      city: city !== "default" ? city : null,
      district: district !== "default" ? district : null,
      school: school !== "default" ? school : null,
    }, false);
  };


  return <>
    <div
      className="full-page"
      style={{ display: "grid", alignItems: "center", padding: "0 1rem" }}
    >
      <Wrapper style={{ paddingBottom: "1.5rem" }}>
        <form className="form" onSubmit={handleSubmit}>
          {showAlert && <Alert />}
          <div className="form">
            <h3 className="form-title">
              {t('create_location', 'Create Location')}{" "}
              {numOfLocations > 1 ? numOfLocations : ""}
            </h3>
            <h4 className="form-title">{t('UP_state', 'State')}*</h4>
            <select
              name="aliasChoice"
              value={state}
              onChange={(e) => handleChange("state", e.target.value)}
              className="form-select"
            >
              <option value={"default"}>{t('choose_your_state', 'Choose your State')}</option>
              {states.map((state, index) => {
                return (
                  <option key={index} value={state}>
                    {state}
                  </option>
                );
              })}
            </select>
            <h4 className="form-title">{t('UP_country', 'Country')}*</h4>
            <select
              name="aliasChoice"
              value={county}
              onChange={(e) => handleChange("county", e.target.value)}
              className="form-select"
            >
              <option value={"default"}>{t('choose_your_country', 'Choose your Country')}</option>
              {counties.map((county, index) => {
                return (
                  <option key={index} value={county}>
                    {county}
                  </option>
                );
              })}
            </select>
            <h4 className="form-title">{t('UP_city', 'city')}*</h4>
            <select
              name="aliasChoice"
              value={city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="form-select"
            >
              <option value={"default"}>{t('choose_your_city', 'Choose your City')}</option>
              {cities.map((city, index) => {
                return (
                  <option key={index} value={city}>
                    {city}
                  </option>
                );
              })}
            </select>
            <h4 className="form-title">{t('UP_district', 'District')}</h4>
            <select
              name="aliasChoice"
              value={district}
              onChange={(e) => handleChange("district", e.target.value)}
              className="form-select"
            >
              <option value={"default"}>{t('choose_your_district', 'Choose your District')}</option>
              {districts.map((district, index) => {
                return (
                  <option key={index} value={district}>
                    {district}
                  </option>
                );
              })}
            </select>
            <h4 className="form-title">{t('UP_school', 'School')}*</h4>
            <input
              name="aliasChoice"
              onChange={(e) => handleChange("school", e.target.value)}
              className="form-input"
              placeholder="Enter your school name"
            />
            <hr />
            <label className="checkbox-container">
              {t('i_teach_multiple_classes', 'I teach multiple classes/periods at this location')}
              <input
                type="checkbox"
                className="checkbox"
                name="aliasChoice"
                checked={multiplePeriods}
                onChange={(e) => setMultiplePeriods(e.target.checked)}
              />
              <span className="checkbox-checkmark"></span>
            </label>
            <hr />
            <button
              className="btn btn-block"
              type="submit"
              disabled={isLoading}
              onSubmit={(e) => handleSubmit(e.target.value)}
              style={{ marginTop: "1.38rem" }}
            >
              {isLoading ? "Please Wait..." : "submit"}
            </button>
            <Link to="/selectLoc" className="link">
              {t('go_back', 'Go Back')}
            </Link>
          </div>
        </form>
      </Wrapper>
      <img width="200" height="100" src={Logo2} className="corner-logo" />
    </div>
  </>
};

export default CreateLoc;
