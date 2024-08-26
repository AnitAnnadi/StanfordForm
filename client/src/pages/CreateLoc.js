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
import countries from "../utils/countries";
import states from "../utils/states";
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
    stanfordNewLoc,
    errorAlert
  } = useAppContext();
  const navigate = useNavigate();
  const currentURL = new URL(window.location.href);
  const [, , type] = currentURL.pathname.split('/');
  console.log(type)

  const [state, setState] = useState("default");
  const [country, setCountry] = useState("default");

  const [city, setCity] = useState("default");
  const [school, setSchool] = useState("default");
  const [district, setDistrict] = useState("default");
  const [county, setCounty] = useState("default");


  
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
    if (field === "country"){
      setCountry(value)
    }
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
    console.log(country, city, school)

    e.preventDefault();
    if(type==="us"){
      if (
        state === "default" ||
        (county === "default") ||
        (city === "default") ||
        (school === "default")
      ) {
        displayAlert();
        return;
      }
    }
    else if (type==="foreign"){
      if (country==="default"|| school ==="default" || city === "default"){
        displayAlert();
        return;
      }
    }

    const existingSchools = new Set(narrowSchools({ state, county, city, district }));
    if (existingSchools.has(school)) {
      errorAlert(`${school} already exists.`)
      return;
    } else {
  
    successAlert("Redirecting...")
    
    addNewLocation({
      multiplePeriods: multiplePeriods,
      country: country !== "default" ? country : null,
      state: state,
      county: county !== "default" ? county : null,
      city: city !== "default" ? city : null,
      district: district !== "default" ? district : null,
      school: school !== "default" ? school : null,
      type
    }, false);
  }
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
            {type=="us"?
            <div>
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
            <h4 className="form-title">{t('UP_county', 'County')}*</h4>
            <select
              name="aliasChoice"
              value={county}
              onChange={(e) => handleChange("county", e.target.value)}
              className="form-select"
            >
              <option value={"default"}>{t('choose_your_county', 'Choose your County')}</option>
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
            </div>:
            <div>
            <h4 className="form-title">Country</h4>
            <select
              name="aliasChoice"
              value={country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="form-select"
            >
              <option value={"default"}>Chose your country</option>
              {countries.map((country, index) => {
                return (
                  <option key={index} value={country}>
                    {country}
                  </option>
                );
              })}
            </select>
            <h4 className="form-title">{t('UP_city', 'city')}*</h4>
            <input
              name="aliasChoice"
              onChange={(e) => handleChange("city", e.target.value)}
              className="form-input"
              placeholder="Enter your city name"
            >
            </input>
            </div>}

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
