import React, { useReducer, useContext, useEffect } from 'react';
import {
  getSchoolDataValue,
  getSchoolObject,
  narrowCities,
  narrowCounties,
  narrowDistricts,
  narrowSchools
} from "../utils/schoolDataFetch";
import { distance } from "fastest-levenshtein";
import { tobacco,postTobacco, cannabis, postCannabis, safety  } from "../utils/questions";


import reducer from './reducer';
import axios from 'axios';
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  GET_EXPORT_FAIL,
  GET_EXPORT_BEGIN,
  GET_EXPORT_SUCCESS,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  FORM_SUCCESS,
  FORM_FAIL,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  NEW_LOCATION_APPROVE,
  NEW_LOCATION_DECLINE,
  GET_RESPONSE_GROUPS_BEGIN,
  GET_RESPONSE_GROUPS_SUCCESS,
  PAGE_FULL,
  GET_RESPONSE_GROUPS_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  NEW_LOCATION_ADDED,
  ENTER_CODE,
  GET_TOTAL,
  ADD_LOCATION_SUCCESS, HANDLE_MULTIPLE_CHANGES, SUCCESS_ALERT, SIMILAR_LOCATIONS_FOUND
} from './actions';
const LSUser = JSON.parse(localStorage.getItem("user"));
const LSUserLocations = JSON.parse(localStorage.getItem("userLocations"));
const stateList = ["all", "Alabama", "Alaska", "Arizona", "Arkansas", "California",
      "Colorado", "Connecticut", "Delaware", "District of Columbia", "Florida",
      "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas",
      "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
      "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
      "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina",
      "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island",
      "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
      "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

const initialState = {
  userLoading: false,
  exportLoading:false,
  userExportLoading:false,
  certificate:false,
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  healthyFuturesListCannabis:[],
  healthyFuturesListTobacco:[],
  exists:true,
  user: LSUser ? LSUser : null,
  userLocation: '',
  userLocations: LSUserLocations ? (LSUserLocations !== 'undefined' ? LSUserLocations : []) : [],
  showSidebar: false,
  isEditing: false,
  responseGroups: [],
  totalResponseGroups: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  overallLoading:false,
  allResponseGroups:[],
  monthlyApplications: [],
  pendingLocations:[],
  stateOptions: localStorage.getItem("stateOptions") ? (localStorage.getItem("stateOptions") !== "undefined" ? JSON.parse(localStorage.getItem("stateOptions")): stateList) : stateList,
  searchState: localStorage.getItem("searchState") ? (localStorage.getItem("searchState") !== "undefined" ? JSON.parse(localStorage.getItem("searchState")): 'all'): 'all',
  countyOptions: localStorage.getItem("countyOptions") ? (localStorage.getItem("countyOptions") !== "undefined" ? JSON.parse(localStorage.getItem("countyOptions")): ['all']): ['all'],
  searchCounty: localStorage.getItem("searchCounty") ? (localStorage.getItem("searchCounty") !== "undefined" ? JSON.parse(localStorage.getItem("searchCounty")): 'all'): 'all',
  districtOptions: localStorage.getItem("districtOptions") ? (localStorage.getItem("districtOptions") !== "undefined" ? JSON.parse(localStorage.getItem("districtOptions")): ['all']): ['all'],
  searchDistrict: localStorage.getItem("searchDistrict") ? (localStorage.getItem("searchDistrict") !== "undefined" ? JSON.parse(localStorage.getItem("searchDistrict")): 'all'): 'all',
  cityOptions: localStorage.getItem("cityOptions") ? (localStorage.getItem("cityOptions") !== "undefined" ? JSON.parse(localStorage.getItem("cityOptions")): ['all']): ['all'],
  searchCity: localStorage.getItem("searchCity") ? (localStorage.getItem("searchCity") !== "undefined" ? JSON.parse(localStorage.getItem("searchCity")): 'all'): 'all',
  schoolOptions: localStorage.getItem("schoolOptions") ? (localStorage.getItem("schoolOptions") !== "undefined" ? JSON.parse(localStorage.getItem("schoolOptions")): ['all']): ['all'],
  searchSchool: localStorage.getItem("searchSchool") ? (localStorage.getItem("searchSchool") !== "undefined" ? JSON.parse(localStorage.getItem("searchSchool")): 'all'): 'all',
  gradeOptions: ['all', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'College or Above'],
  searchGrade: 'all',
  periodOptions: ['all', '1', '2', '3', '4', '5', '6', '7', '8'],
  searchPeriod: 'all',
  teacherOptions: [], // [[teacherName, teacherId], [teacherName, teacherId], ...]
  searchTeacher: 'all',
  typeOptions: ['You and Me, Together Vape-Free(elem)','You and Me Vape Free (middle school and above)', 'Smart Talk: Cannabis Prevention & Education Awareness', 'Safety First', 'Healthy Futures: Tobacco/Nicotine/Vaping','Healthy Futures: Cannabis'],
  searchType: 'You and Me Vape Free (middle school and above)',
  beforeAfterOptions: ['all', 'before', 'after'],
  searchBeforeAfter: 'all',
  teacher:'',
  totalResponses:null,
  hasLocation:null,
  exportData:null,
  currentSchoolIndex:null,
  nextPg:false,
  selectLocSchools:[],
  searchContainerSchools:[],
  resetPassword:false,
  twofaSent:false,
  pendingApproval:false,
  pendingSchool:[],
  approved:false,
  declined:false,
  stanfordNewLoc:false,
  allUsers:null,
  checkedYears:[]
};

const stringDifScore = (str1, str2) => {
  const str1Arr = str1.toUpperCase().split(" ").sort().join("");
  const str2Arr = str2.toUpperCase().split(" ").sort().join("");

  return distance(str1Arr, str2Arr);
}

const configureFormStates = async (userLocations, user, formStates) => {
  let {
    newSearchState,
    newSearchCounty,
    newSearchDistrict,
    newSearchCity,
    newSearchSchool,
    newStateOptions,
    newCountyOptions,
    newDistrictOptions,
    newCityOptions,
    newSchoolOptions,
  } = formStates;
  switch (user.role) {
    case "Site Admin":
      newSearchState = userLocations[0]?.state;
      newSearchCounty = userLocations[0]?.county;
      newSearchDistrict = userLocations[0]?.district;
      newSearchCity = userLocations[0]?.city;
      newSearchSchool = userLocations[0]?.school;

      newStateOptions = [userLocations[0]?.state];
      newCountyOptions = [userLocations[0]?.county];
      newDistrictOptions = [userLocations[0]?.district === "district" ? "N/A" : userLocations[0]?.district];
      newCityOptions = [userLocations[0]?.city];
      newSchoolOptions = [userLocations[0]?.school];

      break;
    case "District Admin":
      newSearchState = userLocations[0]?.state;
      newSearchCounty = userLocations[0]?.county;
      newSearchDistrict = userLocations[0]?.district;
      newSearchCity = userLocations[0]?.city;
      newSearchCity = "all";
      newSearchSchool = "all";

      newStateOptions = [userLocations[0]?.state];
      newCountyOptions = [userLocations[0]?.county];
      newDistrictOptions = [userLocations[0]?.district === "district" ? "N/A" : userLocations[0]?.district];
      newCityOptions = [userLocations[0]?.city];
      console.log(narrowAllSchools({state: userLocations[0]?.state, county: userLocations[0]?.county, district: userLocations[0]?.district}))
      newSchoolOptions = ["all", ...(await narrowAllSchools({state: userLocations[0]?.state, county: userLocations[0]?.county, district: userLocations[0]?.district}))];
      break;
    case "County Admin":
      newSearchState = userLocations[0]?.state;
      newSearchCounty = userLocations[0]?.county;
      newSearchDistrict = "all";
      newSearchCity = "all";
      newSearchSchool = "all";

      newStateOptions = [userLocations[0]?.state];
      newCountyOptions = [userLocations[0]?.county];

      newCityOptions = ["all", ...narrowCities({state: userLocations[0]?.state, county: userLocations[0]?.county})];
      newDistrictOptions = ["all", ...narrowDistricts({state: userLocations[0]?.state, county: userLocations[0]?.county})];
      newSchoolOptions = ["all"];
      break;
    case "State Admin":
      newSearchState = userLocations[0]?.state;
      newSearchCounty = "all";
      newSearchDistrict = "all";
      newSearchCity = "all";
      newSearchSchool = "all";

      newStateOptions = [userLocations[0]?.state];
      newCountyOptions = ["all", ...narrowCounties({state: newSearchState})];
      newDistrictOptions = ["all"];
      newCityOptions = ["all"];
      newSchoolOptions = ["all"];
      break;
    case "Teacher":
      if (userLocations.length === 1) {
        newSearchState = userLocations[0]?.state;
        newSearchCounty = userLocations[0]?.county;
        newSearchDistrict = userLocations[0]?.district;
        newSearchCity = userLocations[0]?.city;
        newSearchSchool = userLocations[0]?.school;

        newStateOptions = [userLocations[0]?.state];
        newCountyOptions = [userLocations[0]?.county];
        newDistrictOptions = [userLocations[0]?.district === "district" ? "N/A" : userLocations[0]?.district];
        newCityOptions = [userLocations[0]?.city];
        newSchoolOptions = [userLocations[0]?.school];
      } else {
        newSearchState = "all";
        newSearchCounty = "all";
        newSearchDistrict = "all";
        newSearchCity = "all";
        newSearchSchool = "all";

        newStateOptions = ["all", ...new Set(userLocations.map((location) => location.state))];
        newCountyOptions = ["all"];
        newDistrictOptions = ["all"];
        newCityOptions = ["all"];
        newSchoolOptions = ["all"];
      }
      break;
    case "Stanford Staff":
      newSearchState = "all";
      newSearchCounty = "all";
      newSearchDistrict = "all";
      newSearchCity = "all";
      newSearchSchool = "all";

      newStateOptions = stateList;
      newCountyOptions = ["all"];
      newDistrictOptions = ["all"];
      newCityOptions = ["all"];
      newSchoolOptions = ["all"];
      break;
  }

  return {
    searchState: newSearchState,
    searchCounty: newSearchCounty,
    searchDistrict: newSearchDistrict,
    searchCity: newSearchCity,
    searchSchool: newSearchSchool,
    stateOptions: newStateOptions,
    countyOptions: newCountyOptions,
    districtOptions: newDistrictOptions,
    cityOptions: newCityOptions,
    schoolOptions: newSchoolOptions,
  }
}

const narrowAllSchools = async (getParams, allowed = false) => {
  try {
    if (allowed) {
      const {data} = await axios.get(`/api/v1/schools/user`);
      const { userLocations } = data;
      console.log(userLocations)

      const { state, county, city, district, school } = getParams;

      // get all schoolnames that meet the getParams criteria, ignore undefined values

      let userLocationsFiltered = userLocations

      if (state && state !== "all") {
        userLocationsFiltered = userLocationsFiltered.filter((location) => location.state.toUpperCase() === state.toUpperCase());
      }

      if (county && county !== "all") {
        userLocationsFiltered = userLocationsFiltered.filter((location) => location.county?.toUpperCase() === county.toUpperCase());
      }

      if (city && city !== "all") {
        userLocationsFiltered = userLocationsFiltered.filter((location) => location.city?.toUpperCase() === city.toUpperCase());
      }

      if (district && district !== "all") {
        userLocationsFiltered = userLocationsFiltered.filter((location) => location.district?.toUpperCase() === district.toUpperCase());
      }

      if (school && school !== "all") {
        userLocationsFiltered = userLocationsFiltered.filter((location) => location.school.toUpperCase() === school.toUpperCase());
      }

      return userLocationsFiltered.map((location) => location.school);
    } else {
      const urlSearchParams = new URLSearchParams(
        Object.entries(getParams).filter(([key, value]) => value !== undefined)
      );

      const {data} = await axios.get(`/api/v1/locations?${urlSearchParams}`);
      const {locations} = data;
      console.log(locations)

      return narrowSchools(getParams).concat(locations.map((location) => location.name));
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}


const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // axios
  const authFetch = axios.create({
    baseURL: '/api/v1',
  });
  // request

  // response

  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        console.log('hi')
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = (diff) => {
    dispatch({ type: DISPLAY_ALERT, payload:{diff} });
    clearAlert();
  };
  const successAlert = (text) => {
    dispatch({ type: SUCCESS_ALERT,payload:{alertText:text} });
    clearAlert();
  };

  const errorAlert = (text) => {
    dispatch({ type: SETUP_USER_ERROR,payload:{msg:text} });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };
  const getLocations = async({user})=>{
    const { data } = await axios.post(
      `/api/v1/auth/getLocations`,
      {user}
    );
    const { userLocations,pendingLocations } = data;
    handleChange({ name: "userLocations", value: userLocations });
    handleChange({ name: "pendingLocations", value: pendingLocations });
  }
  const setupUser = async ({ currentUser, captcha, adminTeacher, endPoint, alertText }) => {
    localStorage.clear()
    dispatch({ type: SETUP_USER_BEGIN });
    handleChange({ name: "twofaSent", value: false });
    try {
      const { data } = await axios.post(
        `/api/v1/auth/${endPoint}`,
        {currentUser,
        captcha,
        adminTeacher}
      );

        
      const { user, hasLocation, userLocations, pendingLocations } = data;
      
     let role = currentUser.role
      if (
        role !== "Site Admin" &&
        role !== "District Admin" &&
        role !== "County Admin" &&
        role !== "State Admin" &&
        role !== "Stanford Staff"
      ) {
        
        localStorage.setItem('user', JSON.stringify(user));
        if (userLocations) {
          localStorage.setItem('userLocations', JSON.stringify(userLocations));
        }
      }

      else{
        handleChange({ name: "twofaSent", value: true });
      }
      
    

      let newFormState = {};

      if (endPoint === 'login') {
        const stateKeys = [
          'searchState',
          'searchCounty',
          'searchDistrict',
          'searchCity',
          'searchSchool',
          'stateOptions',
          'countyOptions',
          'districtOptions',
          'cityOptions',
          'schoolOptions'
        ];

        const newFormState = await configureFormStates(userLocations, user,
          Object.fromEntries(stateKeys.map(key => {
              return ['new' + key[0].toUpperCase() + key.slice(1), state[key]]
          }))
        );

        stateKeys.forEach(key => {
          localStorage.setItem(key, JSON.stringify(newFormState[key]));
        });
      }

      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, alertText, hasLocation,
          userLocations: userLocations ? userLocations : [],
          newFormStates: endPoint === 'login' ? newFormState : null,
          pendingLocations: pendingLocations ? pendingLocations : [],
        },
      });
    } catch (error) {
      console.log(error)
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error?.response?.data },
      });
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = async () => {
    await authFetch.get('/auth/logout');
    localStorage.clear();
    dispatch({ type: LOGOUT_USER });
  };
  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);

      const { user } = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user },
      });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const addLocation = async (locationData) => {
    try {
      const { state, county, district, city, school, multiplePeriods, requesterId } = locationData;

      let newLocationData = {state, county, district, city, school, multiplePeriods, requesterId};
      console.log(requesterId)
      if (district === 'custom' || county === 'custom') {
        const urlSearchParams = new URLSearchParams(
          state,
          city,
          school,
        );
        const {data} = await axios.get(`/api/v1/locations?${urlSearchParams}`);
        const {locations} = data;

        if (locations.length > 0) {
          newLocationData.county = locations[0].county;
          newLocationData.district = locations[0].district;
        }
      }

      const { data } = await authFetch.post('/schools/user', newLocationData);
      const { data: data2 } = await authFetch.get('/schools/user');

      const { user, exists } = data;
      const { userLocations } = data2;

      localStorage.setItem('userLocations', JSON.stringify(userLocations))

      const stateKeys = [
        'searchState',
        'searchCounty',
        'searchDistrict',
        'searchCity',
        'searchSchool',
        'stateOptions',
        'countyOptions',
        'districtOptions',
        'cityOptions',
        'schoolOptions'
      ];

      const newFormState = await configureFormStates(userLocations, user,
          Object.fromEntries(stateKeys.map(key => {
              return ['new' + key[0].toUpperCase() + key.slice(1), state[key]]
          }))
      );

      stateKeys.forEach(key => {
        localStorage.setItem(key, JSON.stringify(newFormState[key]));
      });

      dispatch({
        type: ADD_LOCATION_SUCCESS,
        payload: {
          userLocations,
          newFormStates: newFormState,
          exists
        }
      });
    } catch (error) {
      console.log(error)
      if (error.response?.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const addNewLocation = async (locationData, bypassSimilar=false) => {
    const {
      pendingSchool,
      user
  } = state;
    try {
      const {multiplePeriods, state, county, city, district, school} = locationData
      console.log(school)
      const {data} = await authFetch.post('/locations', locationData); 
      if (! data.msg && data.location){
        if (user.role!="Stanford Staff"){

        handleChange({ name: "pendingApproval", value: true });
        }
        else{
          handleChange({ name: "stanfordNewLoc", value: true });
          handleChange({ name: "pendingApproval", value: false });
        }
        dispatch({
          type:NEW_LOCATION_ADDED,
          payload:{pendingSchool: pendingSchool.push(school)}
        })
      } 
      else if (data.msg){
        errorAlert(data.msg);
      }
      else{
        errorAlert("There was an error submitting your location.")
      }
    }

    catch(error){

    }

  };

  const setToNarrowSchools = async ({reactState, allowed, state, county, city, district}) => {
    try {
      const schoolNames = await narrowAllSchools({state, county, city, district}, allowed);

      dispatch({ type: HANDLE_CHANGE, payload: { name: reactState, value: schoolNames } });
    } catch (error) {
      console.log(error)
    }
  }

  const enterCode = async (code) => {
    try {
      const { data } = await axios.post(`/api/v1/auth/enterCode/`, {code});

            const {id, name, email, state, city, school} = data;
      dispatch({ type: ENTER_CODE , payload:{teacher:data["user"],schools:data["schools"]}});
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };
 const submitForm = async (formData,code,grade,when,type,school,period,state, city, county, district, captcha) => {
    try {
      console.log(period)
      handleChange({name:"isLoading",value:true})
      const { data } = await axios.post(`/api/v1/auth/submitForm/`, {formData,code,grade,when,type,school,period,state, city, county, district,captcha});
      dispatch({
        type: FORM_SUCCESS,
        payload :{msg:"Form Sucessfully Completed. Redirecting..." }

      });
      
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: FORM_FAIL,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
    // clearAlert();
  };


  const forgotPassword = async({email})=>{
    try{
      const { data } = await axios.post(`/api/v1/auth/forgotPassword`,{email})
      if (data=="Email sent"){
        dispatch({
          type: FORM_SUCCESS,
          payload: {msg: `An email with the password reset has been sent to ${email}`}

        });
        clearAlert()
      }

    }
    catch(error){
      dispatch({
        type: FORM_FAIL,
        payload: { msg: error.response.data.msg },
      });
      clearAlert()

    }
  }

  const verifyReset = async({token, password})=>{

    try{
      handleChange({ name: "resetPassword", value: false });
      const { data } = await axios.post(`/api/v1/auth/verifyToken`,{token})
      if (data.msg == "verified"){
        const {reset} = await axios.post(`/api/v1/auth/resetpassword`,{password,token})
        dispatch({
          type: FORM_SUCCESS,
          payload: {msg: "Password Changed"}

        });
        handleChange({ name: "resetPassword", value: true });
        clearAlert()
      }
      else{
        dispatch({
          type: FORM_FAIL,
          payload: { msg: "Your reset password link has expired" },
        });
        clearAlert();
      }

    }
    catch(error){
      dispatch({
        type: FORM_FAIL,
        payload: { msg: error.response.data.msg},
      });
      clearAlert();
    }
  }



  const handleChange = ({ name, value }) => {
    console.log(name,value)
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };
  const handleChanges = (newStates) => {
    for (const [name, value] of Object.entries(newStates)) {
      localStorage.setItem(name, JSON.stringify(value));
    }
    dispatch({ type: HANDLE_MULTIPLE_CHANGES, payload: newStates });
  };
  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };

  const getResponseGroups = async (currentSchoolIndex, shouldReload, all=false, overallBreakdown= false) => {
    const {
      user,
      userLocations,
      page,
      searchState,
      searchCounty,
      searchCity,
      searchDistrict,
      searchSchool,
      searchGrade,
      searchPeriod,
      searchTeacher,
      searchType,
      searchBeforeAfter,
      checkedYears
    } = state;
    dispatch({ type: GET_RESPONSE_GROUPS_BEGIN, payload:{shouldReload} });
    try {
      if (all){
        handleChange({ name: "exportLoading", value: true });
      }
      if (overallBreakdown){
        handleChange({ name: "overallLoading", value: true });
      }
      const { data } = await authFetch.get('/schools', {
        params: {
          searchState,
          searchCounty,
          searchCity,
          searchDistrict : searchDistrict === 'N/A' ? undefined : searchDistrict,
          searchSchool,
          searchTeacher:
            user.role === 'Teacher' ? user._id :
              searchTeacher === 'all' ? 'all' : searchTeacher[1],
        }
      });

      const { schools } = data;
      const filteredSchools = schools.filter((obj) => {
        switch (user.role) {
          case "Site Admin":
            return obj.school.toLowerCase() === userLocations[0]?.school.toLowerCase();
          case "District Admin":
            return obj.district.toLowerCase() === userLocations[0]?.district.toLowerCase();
          case "County Admin":
            return obj.county.toLowerCase() === userLocations[0]?.county.toLowerCase();
          case "State Admin":
            return obj.state.toLowerCase() === userLocations[0]?.state.toLowerCase();
          case "Stanford Staff":
            return true;
          case "Teacher":
            return obj.teacher.toLowerCase() === user._id.toLowerCase();
          default:
            return false;
        }
      });
      

      let newResponses = [];
      let teacherNames = [];
      let schoolIndex = (currentSchoolIndex && !all) ? currentSchoolIndex : 0;
      console.log(filteredSchools)
      while ( schoolIndex < filteredSchools.length) {

        const { data: data2 } = await authFetch.get('/studentResponses', {
          params: {
            school: filteredSchools[schoolIndex].school,
            teacherId: filteredSchools[schoolIndex].teacher,
            grade: searchGrade,
            period: searchPeriod,
            formType: searchType,
            when: searchBeforeAfter,
            all,
            checkedYears
          }
        });
        const {teacherId, teacherName, studentResponses } = data2;

        // let teacherMatch = teacherNames.find(function(obj) {
        //     return obj[1] === filteredSchools[schoolIndex].teacher;
        //   });

        // if (!teacherMatch) {
        //   teacherNames.push([teacherName, filteredSchools[schoolIndex].teacher]);
        // }


        let uniqueResponseTypes = [];

        for (const responseIndex in studentResponses) {
          let newResponseType = {
            formCode: studentResponses[responseIndex].formCode,
            teacher: studentResponses[responseIndex].teacher,
            grade: studentResponses[responseIndex].grade,
            when: studentResponses[responseIndex].when,
            formType: studentResponses[responseIndex].formType,
            school: studentResponses[responseIndex].school,
            period: studentResponses[responseIndex].period,
          }

          let match = uniqueResponseTypes.find(function(obj) {
            return JSON.stringify(obj) === JSON.stringify(newResponseType);
          });

          if (!match) {
            uniqueResponseTypes.push(newResponseType);
          }
        }

        for (const responseTypeIndex in uniqueResponseTypes) {
          newResponses.push({
            school: filteredSchools[schoolIndex],
            teacherName,
            uniqueResponseType: uniqueResponseTypes[responseTypeIndex],
            numberOfResponses: studentResponses.filter((response) => {
              return Object.entries(uniqueResponseTypes[responseTypeIndex]).every(([key, value]) => {
                return response[key] === value;
              });
            }).length,
          });


        }
        schoolIndex++
        if (!overallBreakdown && !all && newResponses.length>=8){
          break
        }
      }
      if (user.role === 'Stanford Staff') {
        if (schoolIndex >= filteredSchools.length && (newResponses.length === 0 || all)) {
          const offsetIndex = schoolIndex - filteredSchools.length;

          const { data: data3 } = await authFetch.get('/studentResponses/noCode', {
            params: {
              school: searchSchool,
              state: searchState,
              city: searchCity,
              county: searchCounty,
              district: searchDistrict,
              grade: searchGrade,
              period: searchPeriod,
              formType: searchType,
              when: searchBeforeAfter,
              all
            }
          });

          const { studentResponses: noCodeStudentResponses } = data3;

          let uniqueResponseTypes = [];

          for (const responseIndex in noCodeStudentResponses) {
            let newResponseType = {
              formCode: "noCode",
              noCode: true,
              teacher: "No Teacher",
              grade: noCodeStudentResponses[responseIndex].grade,
              when: noCodeStudentResponses[responseIndex].when,
              formType: noCodeStudentResponses[responseIndex].formType,
              school: {
                school: noCodeStudentResponses[responseIndex].school,
                state: noCodeStudentResponses[responseIndex].state,
                teacher: "No Teacher",
                multiplePeriods: false,
                district: noCodeStudentResponses[responseIndex].district,
                county: noCodeStudentResponses[responseIndex].county,
                city: noCodeStudentResponses[responseIndex].city,
              },
              period: "No Period"
            }

            let match = uniqueResponseTypes.find(function(obj) {
              return JSON.stringify(obj) === JSON.stringify(newResponseType);
            });

            if (!match) {
              uniqueResponseTypes.push(newResponseType);
            }
          }
          for (let i = (offsetIndex * 8); (i < uniqueResponseTypes.length && ((i < ((offsetIndex * 8) + 8)) || all)); i += 1) {
            const currentResponse = uniqueResponseTypes[i]
            newResponses.push({
              school: currentResponse.school,
              teacherName: "No Teacher",
              uniqueResponseType: currentResponse,
              numberOfResponses: noCodeStudentResponses.filter((response) => {
                return response.grade === currentResponse.grade &&
                  response.when === currentResponse.when &&
                  response.formType === currentResponse.formType &&
                  response.school === currentResponse.school.school &&
                  response.state === currentResponse.school.state &&
                  response.district === currentResponse.school.district &&
                  response.county === currentResponse.school.county &&
                  response.city === currentResponse.school.city
              }).length
            });
          }
        }
      }

      if (all){
        getExport(false, null, newResponses);
      }

      dispatch({
        type: PAGE_FULL,
        payload: {
        schoolIndex,
        },
      });
      handleChange({ name: "overallLoading", value: false });
      dispatch({
        type: GET_RESPONSE_GROUPS_SUCCESS,
        payload: {
          newResponses,
          all,
          teacherOptions: searchTeacher === 'all' ? teacherNames : state.teacherOptions,
        },
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error fetching schools:", error);
      dispatch({
        type: GET_RESPONSE_GROUPS_ERROR,
        payload: { msg: error.response },
      });
      // logoutUser();
    }
    clearAlert();
  };

  const getExport = async (search, formCode, allResponseGroups) => {
    const {
        responseGroups,
        currentSchoolIndex,
        shouldReload,
        exportLoading
    } = state;
    handleChange({ name: "exportLoading", value: true });
    console.log('context export')
    if (search) {
        try {
            dispatch({
                type: GET_EXPORT_BEGIN,
                payload: { exportData: null, msg: "Export Successful" },
            });

            const data = await authFetch.get(`/export/${formCode}${search}`);
            const exportData = data.data.exportData;
            console.log(exportData)
            
            
            dispatch({
                type: GET_EXPORT_SUCCESS,
                payload: { exportData: exportData, msg: "Export Successful" },
            });
        } catch (error) {
            dispatch({ type: GET_EXPORT_FAIL, payload: { msg: "Export Failed" } });
        }
    } else {
        dispatch({ type: GET_EXPORT_BEGIN, payload: { exportData: null } });

        const allExportData = [];

        for (const responseGroup of (allResponseGroups ? allResponseGroups : responseGroups)) {
          const { school, uniqueResponseType } = responseGroup;

          const queryParameters = new URLSearchParams({
            noCode: uniqueResponseType?.noCode ? 'true' : 'false',
            teacherId: school.teacher,
            schoolId: school?._id,
            period: uniqueResponseType.period,
            grade: uniqueResponseType.grade,
            formType: uniqueResponseType.formType,
            when: uniqueResponseType.when,
            school: school.school,
            state: school.state,
            city: school.city,
            county: school.county,
            district: school.district,
          });

          try {
            const data = await authFetch.get(
              `/export/${uniqueResponseType.formCode}?${queryParameters}`
            );
            const exportDatas = data.data.exportData;
            exportDatas.forEach((exportData) => {
              allExportData.push(exportData);
            });
          } catch (error) {
            console.error(`Error fetching data for responseGroup: ${responseGroup}`, error);
            dispatch({ type: GET_EXPORT_FAIL, payload: { msg: "Export Failed" } });
            return; // Exit the function early since there was an error
          }
        
        }

        dispatch({
            type: GET_EXPORT_SUCCESS,
            payload: { exportData: allExportData, msg: "Export Successful" },
        });
        clearAlert();
    }
};


  

  

  const getTotal = async(user)=>{
    let code=user.code
    const {data}=await authFetch.post('/form/responses', {
      code
    });
    let total=(data["totalResponses"])
    dispatch({ type: GET_TOTAL , payload:{total}});
    
  }

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  const approveLocationRequest = async(_id) => {
    console.log(_id)
    const {data} = await authFetch.post('/locations/approve', {_id}); 
    if (data){
      dispatch({ type: NEW_LOCATION_APPROVE });
      clearAlert();
    }
  };
  const declineLocationRequest = async(_id) => {
    console.log(_id)
    const {data} = await authFetch.post('/locations/decline', {_id}); 
    if (data){
      dispatch({ type: NEW_LOCATION_DECLINE });
      clearAlert();
    }
  };

  // const declineAndSelectLocationRequest = async(_id) => {
  //   console.log(_id)
  //   const {data} = await authFetch.post('/locations/decline', {_id}); 
  //   if (data){
  //     dispatch({ type: NEW_LOCATION_DECLINE });
  //     clearAlert();
  //   }
  // };

  const createCertificate = async ({name,info}) => {
    try{
    const { data } = await axios.post(`/api/v1/auth/createCertificate`,{name,info})
    if (data.msg == "Certificate Created"){
      handleChange({ name: "certificate", value: true });
      handleChange({ name: "certificate", value: true });
      successAlert("Creating Certificate...")
    }
  }
    catch(error){
    }
    // dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  const getHealthyFutures = async(teacherId) =>{
    try{
      const { data } = await authFetch.get('/studentResponses/healthyFutures', {
        params: {
         teacherId
        }
      });
      handleChange({ name: "healthyFuturesListCannabis", value: data.responsesByCannabis });
      handleChange({ name: "healthyFuturesListTobacco", value: data.responsesByTobacco });

      // const { data } = await authFetch.get('/studentResponse s/healthyFutures', {teacherId});
    }
    catch(error){
    }

  }

  const resendEmail = async(email) =>{
    try{
    const { data } = await axios.post(`/api/v1/auth/resend2fa`,{email })
    successAlert(data)
    }
    catch(error){

    }
  }

  const getUsers = async()=>{
    try{
      handleChange({ name: "userExportLoading", value: true });
      const { data } = await axios.post(`/api/v1/user/all`)
      console.log(data)
      handleChange({ name: "allUsers", value: data });
    }
    catch(error){

    }
  }
  const verify2fa = async(_id) => {
    try{
      const { data } = await axios.post(`/api/v1/auth/verify2fa`,{_id})
      const { user, hasLocation, userLocations } = data;
      localStorage.setItem('user', JSON.stringify(user))

      if (userLocations) {
        localStorage.setItem('userLocations', JSON.stringify(userLocations))
      }
      let alertText = "User Successfully Created"
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, alertText, hasLocation,
          userLocations: userLocations ? userLocations : [],
        },
      });
      clearAlert();

      // const { data } = await authFetch.get('/studentResponse s/healthyFutures', {teacherId});
    }
    catch(error){
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data },
      });
      clearValues();
    }
  };



  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        verify2fa,
        getHealthyFutures,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        setToNarrowSchools,
        handleChange,
        handleChanges,
        clearValues,
        getResponseGroups,
        getExport,
        successAlert,
        changePage,
        addLocation,
        addNewLocation,
        enterCode,
        submitForm,
        getTotal,
        forgotPassword,
        verifyReset,
        createCertificate,
        resendEmail,
        errorAlert,
        approveLocationRequest,
        declineLocationRequest,
        getLocations,
        getUsers
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
