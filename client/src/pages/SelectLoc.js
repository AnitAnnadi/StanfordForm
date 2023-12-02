import { useState } from "react";
import { FormRow, Alert } from "../components";
import { useAppContext, countryList } from "../context/appContext";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import Dropdown from "react-dropdown";
import { useEffect, useRef } from "react";
import Logo2 from "../assets/images/logo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import {
  narrowDistricts,
  narrowCities,
  narrowCounties,
  narrowSchools,
  getDistrictCounty,
} from "../utils/schoolDataFetch";
import CreateLocPopup from "../components/CreateLocPopup";
import {useTranslation} from "react-i18next";

const SelectLoc = ({ noCode }) => {
  const {
    user,
    userLocations,
    showAlert,
    displayAlert,
    addLocation,
    isLoading,
    successAlert,
    exists,
    selectLocSchools,
    selectLocStates,
    selectLocCities,
    setToNarrowCities,
    setToNarrowSchools,
    setToNarrowStates,
  } = useAppContext();

  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [country, setCountry] = useState("default");
  const [state, setState] = useState("default");
  const [city, setCity] = useState("default");
  const [school, setSchool] = useState("default");
  const [district, setDistrict] = useState("default");
  const [county, setCounty] = useState("default");
  const [form, setForm] = useState("default");
  const [when, setWhen] = useState("default");

  const [states, setStates] = useState([]);

  const [isUnitedStates, setIsUnitedStates] = useState(false);

  const [cities, setCities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [counties, setCounties] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [grade, setGrade] = useState("default");
  const location = useLocation();
  const locationState = location?.state || {}; // Default to an empty object if location.state is null or undefined
  const { adminTeacher } = locationState;
  const { selectSchool } = locationState;
  const { fromProfile } = locationState;
  let { forOther } = locationState;
  forOther = forOther !== undefined ? forOther : null;
  let { requestedName } = locationState;
  const [multiplePeriods, setMultiplePeriods] = useState(false);
  let adminroles = [
    "Site Admin",
    "District Admin",
    "County Admin",
    "State Admin",
    "Stanford Staff",
  ];
  let grades = ["K", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let adminbool = false;
  const [additionalLoc, setAdditionalLoc] = useState(false);

  const [numOfLocations, setNumOfLocations] = useState(
    user?.adminTeacher && user?.role != "Stanford Staff"
      ? userLocations
        ? userLocations.length
        : 1
      : userLocations
      ? userLocations.length
      : 1
  );

  useEffect(() => {
    if (userLocations && !isFormSubmitted) {
      setNumOfLocations(user?.role=="Stanford Staff"?userLocations.length+1:userLocations.length);
    }
  }, [userLocations]);
  
  const [showCounty, setShowCounty] = useState(false);
  const [showDistrict, setShowDistrict] = useState(false);


  useEffect(() => {
    setShowCounty(
      isUnitedStates && (
      !fromProfile &&
      !selectSchool &&
      (user?.role === "District Admin" || user?.role === "County Admin"))
    );
    setShowDistrict(
      isUnitedStates && (
      !fromProfile && !selectSchool && user?.role === "District Admin")
    );
  }, [isUnitedStates]);

  const showSchool =
    user?.role === "Site Admin" ||
    user?.role === "Teacher" ||
    noCode ||
    selectSchool ||
    fromProfile ||
    forOther;
  const showCity =
    user?.role === "Site Admin" ||
    user?.role === "Teacher" ||
    noCode ||
    selectSchool ||
    fromProfile ||
    forOther;
  const showMultiplePeriods =
    user?.role === "Teacher" ||
    selectSchool ||
    fromProfile ||
    user?.role == "Site Admin";
  const showAdditionalLoc =
    user?.role === "Teacher" || selectSchool || fromProfile;
  useEffect(() => {
    setCountry("default")
    setState("default");
    setCity("default");
    setSchool("default");
    setDistrict("default");
    setCounty("default");
    setForm("default");
    setWhen("default");
  }, []);

  useEffect(() => {
    if (isFormSubmitted && !exists && !additionalLoc) {
      adminroles.map((role) => {
        if (role === user?.role) {
          adminbool = true;
        }
      });
      setIsFormSubmitted(false);
      setAdditionalLoc(false);
      if (adminbool) {
        if (adminTeacher && user?.role !== "Site Admin") {
          setTimeout(() => {
            navigate("/selectLoc", {
              state: {
                adminTeacher: false,
                selectSchool: true,
                fromProfile: false,
              },
            });
          }, 2000);
          return;
        }
        if (user?.adminTeacher) {
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } 
        else {
          setTimeout(() => {
            navigate("/metrics");
          }, 2000);
        }
      } else {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    }
    setIsFormSubmitted(false);
    setAdditionalLoc(false);
  }, [isFormSubmitted]);
  useEffect(() => {
    if (isUnitedStates) {
      if (user?.role === "Site Admin" || user?.role === "Teacher" || noCode) {
        if (state !== "default" && city !== "default" && school !== "default") {
          // just do this whole thing in app context later

          try {
            const { foundDistrict, foundCounty } = getDistrictCounty(
              state,
              city,
              school
            );
            console.log(foundDistrict, foundCounty);

            setDistrict(foundDistrict);
            setCounty(foundCounty);
          } catch (err) {
            setDistrict("custom");
            setCounty("custom");
          }
        }
      }
    }
  }, [state, city, school, isUnitedStates]);

  const handleChange = (field, value) => {
    if (field === "country") {
      setCountry(value);
      setState("default");
      setCity("default");
      setSchool("default");

      if (value === "United States") {
        setIsUnitedStates(true);
      } else {
        setIsUnitedStates(false);
      }

      if (value !== "default") {
        setToNarrowStates({
          reactState: "selectLocStates",
          country: value,
        });
      }
    } else if (field === "state") {
      setState(value);
      setCity("default");
      setSchool("default");

      if (value !== "default") {
        if (isUnitedStates) {
          setCities(narrowCities({ state: value }));
          setCounties(narrowCounties({ state: value }));
        } else {
          setToNarrowCities({
            reactState: "selectLocCities",
            country,
            state: value,
          });
        }
      }
    } else if (field === "county") {
      setCounty(value);
      setDistrict("default");

      if (value !== "default") {
        setDistricts(narrowDistricts({ state, county: value }));
      }
    } else if (field === "city") {
      setCity(value);
      setSchool("default");

      if (value !== "default") {
        if (isUnitedStates) {
          setDistricts(narrowDistricts({state, city: value}));
        }

        setToNarrowSchools({
          reactState: "selectLocSchools",
          state,
          city: value,
        });
      }
    } else if (field === "district") {
      setDistrict(value);
    } else if (field === "school") {
      setSchool(value);
    }
  };

  useEffect(() => {
    if (selectLocSchools.length > 0) {
      setSchools(selectLocSchools);
    }
  }, [selectLocSchools]);

  useEffect(() => {
    if (selectLocStates.length > 0) {
      setStates(selectLocStates);
    }
  }, [selectLocStates]);

  useEffect(() => {
    if (selectLocCities.length > 0) {
      setCities(selectLocCities);
    }
  }, [selectLocCities]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (forOther) {
      if (
        state === "default" ||
        (showCounty && county === "default") ||
        (showCity && city === "default") ||
        (showDistrict && district === "default") ||
        (showSchool && school === "default")
      ) {
        displayAlert();
        return;
      }
      await addLocation({
        country: country !== "default" ? country : null,
        state: state,
        county: county !== "default" ? county : null,
        city: city !== "default" ? city : null,
        district: district !== "default" ? district : null,
        school: school !== "default" ? school : null,
        requesterId: forOther,
      });
      setIsFormSubmitted(true);
      return;
    }
    if (noCode) {
      if (
        country != "default" ||
        state != "default" ||
        grade != "default" ||
        county != "default" ||
        city != "default" ||
        district != "default" ||
        school !== "default"
      ) {
        successAlert("Redirecting...");

        setTimeout(() => {
          navigate("/joinedForm", {
            state: {
              country,
              state,
              county,
              district,
              school,
              city,
              noCode,
            },
          });
        }, 2000);
      } else {
        displayAlert();
      }
    } else {
      if (
        country === "default" ||
        state === "default" ||
        (showCounty && county === "default") ||
        (showCity && city === "default") ||
        (showDistrict && district === "default") ||
        (showSchool && school === "default")
      ) {
        displayAlert();
        return;
      }

      await addLocation({
        multiplePeriods: multiplePeriods,
        country: country !== "default" ? country : null,
        state: state,
        county: county !== "default" ? county : null,
        city: city !== "default" ? city : null,
        district: district !== "default" ? district : null,
        school: school !== "default" ? school : null,
      });

      if (additionalLoc) {
        setCountry("default");
        setState("default");
        setCounty("default");
        setCity("default");
        setDistrict("default");
        setSchool("default");
        setMultiplePeriods(false);
        setNumOfLocations(numOfLocations + 1);
      }

      setIsFormSubmitted(true);
    }

    handleChange({ name: "selectLocSchools", value: [] });
    handleChange({ name: "selectLocStates", value: [] });
  };

  const [displayAddPopup, setDisplayAddPopup] = useState(false);

  return (
    <>
      {displayAddPopup && <CreateLocPopup setDisplay={setDisplayAddPopup} />}
      <div
        className="full-page"
        style={{ display: "grid", alignItems: "center", padding: "0 1rem" }}
      >
        <Wrapper style={{ paddingBottom: "1.5rem" }}>
          <form className="form" onSubmit={handleSubmit}>
            {showAlert && <Alert />}
            <div className="form">
              <h3 className="form-title">
                {forOther
                  ? t('select_location_for', "Select Location for") + " "
                  : noCode ||
                    user?.role === "Teacher" ||
                    selectSchool ||
                    fromProfile
                  ? t('select_school', "Select School")
                  : user?.role === "Site Admin"
                  ? t('select_school_location', "Select School Location")
                  : t('select_admin_location', "Select Admin Location")
                }
                {forOther
                  ? requestedName
                  : numOfLocations > 1 && !noCode
                  ? ` ${numOfLocations}`
                  : ""}
              </h3>

              <h4 className="form-title">{t('UP_country', 'Country')}</h4>
              <select
                name="aliasChoice"
                value={country}
                onChange={(e) => handleChange("country", e.target.value)}
                className="form-select"
              >
                <option value={"default"}>
                  {t('choose_your_country', 'Choose your Country')}
                </option>
                {countryList.map((country, index) => {
                  return (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  );
                })}
              </select>
              <h4 className="form-title">{t('UP_state_slash_province', 'State/Province')}</h4>
              <select
                name="aliasChoice"
                value={state}
                onChange={(e) => handleChange("state", e.target.value)}
                className="form-select"
              >
                <option value={"default"}>
                  {t('choose_your_state', 'Choose your State')}
                </option>
                {selectLocStates.map((state, index) => {
                  return (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  );
                })}
              </select>
              {showCounty && (
                <>
                  <h4 className="form-title">{t('UP_country', 'County')}</h4>
                  <select
                    name="aliasChoice"
                    value={county}
                    onChange={(e) => handleChange("county", e.target.value)}
                    className="form-select"
                  >
                    <option value={"default"}>{t('choose_your_country', 'Choose your County')}</option>
                    {counties.map((county, index) => {
                      if (county === "custom") {
                        if (counties.length === 1) {
                          return (
                            <option key={index} value={county}>
                              {t('doesnt_apply', "Doesn't apply")}
                            </option>
                          );
                        } else {
                          return <></>;
                        }
                      }

                      return (
                        <option key={index} value={county}>
                          {county}
                        </option>
                      );
                    })}
                  </select>
                </>
              )}
              {showCity && (
                <>
                  <h4 className="form-title">{t('UP_city', 'City')}</h4>
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
                </>
              )}
              {showDistrict && (
                <>
                  <h4 className="form-title">{t('UP_district', 'District')}</h4>
                  <select
                    name="aliasChoice"
                    value={district}
                    onChange={(e) => handleChange("district", e.target.value)}
                    className="form-select"
                  >
                    <option value={"default"}>{t('choose_your_district', 'Choose your District')}</option>
                    {districts.map((district, index) => {
                      if (district === "custom") {
                        if (districts.length === 1) {
                          return (
                            <option key={index} value={district}>
                              {t('doesnt_apply', "Doesn't apply")}
                            </option>
                          );
                        } else {
                          return <></>;
                        }
                      }

                      return (
                        <option key={index} value={district}>
                          {district}
                        </option>
                      );
                    })}
                  </select>
                </>
              )}
              {showSchool && (
                <>
                  <h4 className="form-title">{t('UP_school', 'School')}</h4>
                  <select
                    name="aliasChoice"
                    value={school}
                    onChange={(e) => handleChange("school", e.target.value)}
                    className="form-select"
                  >
                    <option value={"default"}>{t('choose_your_school', 'Choose your School')}</option>
                    {schools.map((school, index) => {
                      return (
                        <option key={index} value={school}>
                          {school}
                        </option>
                      );
                    })}
                  </select>
                </>
              )}

              {!noCode && showMultiplePeriods && (
                <>
                  <hr />
                  <label className="checkbox-container">
                    {t('i_teach_multiple', 'I teach multiple classes/periods at this location')}
                    <input
                      type="checkbox"
                      className="checkbox"
                      name="aliasChoice"
                      checked={multiplePeriods}
                      onChange={(e) => setMultiplePeriods(e.target.checked)}
                    />
                    <span className="checkbox-checkmark"></span>
                  </label>
                </>
              )}
              {!noCode && showAdditionalLoc && user?.role !== "Site Admin" && (
                <>
                  <hr />
                  <label className="checkbox-container">
                    {t('like_to_submit_additional_loc', 'I would like to submit an additional location')}
                    <input
                      type="checkbox"
                      className="checkbox"
                      name="aliasChoice"
                      checked={additionalLoc}
                      onChange={(e) => {
                        setAdditionalLoc(e.target.checked);
                      }}
                    />
                    <span className="checkbox-checkmark"></span>
                  </label>
                </>
              )}

              <button
                className="btn btn-block"
                type="submit"
                disabled={isLoading}
                onSubmit={(e) => handleSubmit(e.target.value)}
                style={{ marginTop: "1.38rem" }}
              >
                {isLoading ? t('please_wait', 'Please Wait') + "...": t('submit', 'submit')}
              </button>
              {!noCode && (user?.adminTeacher && numOfLocations >= 1) ||
              user?.role == "Site Admin" ||
              user?.role === "Teacher"||
              user?.role=="Stanford Staff" ? (
                <p>
                  {t('dont_see_your_school', "Don't see your school?")}{" "}
                  <button
                    className="link"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setDisplayAddPopup(true);
                    }}
                  >
                    {t('click_here', 'Click here')}
                  </button>
                </p>
              ) : null}
              {numOfLocations > 1 && !noCode ? (
                <>
                  <br />
                  <div
                    className="dashboard-link"
                    style={{
                      display: "flex",
                      columnGap: "0.5rem",
                      marginTop: "1rem",
                      alignContent: "center",
                      minWidth: "100%",
                      justifyContent: "flex-end",
                    }}
                  >
                    {isLoading ? t('please_wait', 'Please Wait') + "...": t('go_to_dashboard', 'Go to Dashboard')}
                    <Link
                      to="/"
                      disabled={isLoading}
                      className="location-icon"
                      style={{ fontSize: "1.5rem" }}
                    >
                      <BsArrowRight />
                    </Link>
                  </div>
                </>
              ) : null}
            </div>
          </form>
        </Wrapper>
        <img width="200" height="100" src={Logo2} className="corner-logo" />
      </div>
    </>
  );
};

export default SelectLoc;
