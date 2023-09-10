import React, { useReducer, useContext, useEffect } from 'react';
import {
  getSchoolDataValue,
  narrowCities,
  narrowCounties,
  narrowDistricts,
  narrowSchools
} from "../utils/schoolDataFetch";

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

  GET_RESPONSE_GROUPS_BEGIN,
  GET_RESPONSE_GROUPS_SUCCESS,
  PAGE_FULL,
  GET_RESPONSE_GROUPS_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,

  ENTER_CODE,
  GET_TOTAL,
  ADD_LOCATION_SUCCESS, HANDLE_MULTIPLE_CHANGES, SUCCESS_ALERT
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
  stateOptions: localStorage.getItem("stateOptions") ? (localStorage.getItem("stateOptions") !== "undefined" ? JSON.parse(localStorage.getItem("stateOptions")): stateList) : stateList,
  searchState: localStorage.getItem("searchState") ? (localStorage.getItem("searchState") !== "undefined" ? JSON.parse(localStorage.getItem("searchState")): 'al'): 'all',
  countyOptions: localStorage.getItem("countyOptions") ? (localStorage.getItem("countyOptions") !== "undefined" ? JSON.parse(localStorage.getItem("countyOptions")): ['all']): ['all'],
  searchCounty: localStorage.getItem("searchCounty") ? (localStorage.getItem("searchCounty") !== "undefined" ? JSON.parse(localStorage.getItem("searchCounty")): 'all'): 'all',
  districtOptions: localStorage.getItem("districtOptions") ? (localStorage.getItem("districtOptions") !== "undefined" ? JSON.parse(localStorage.getItem("districtOptions")): ['all']): ['all'],
  searchDistrict: localStorage.getItem("searchDistrict") ? (localStorage.getItem("searchDistrict") !== "undefined" ? JSON.parse(localStorage.getItem("searchDistrict")): 'all'): 'all',
  cityOptions: localStorage.getItem("cityOptions") ? (localStorage.getItem("cityOptions") !== "undefined" ? JSON.parse(localStorage.getItem("cityOptions")): ['all']): ['all'],
  searchCity: localStorage.getItem("searchCity") ? (localStorage.getItem("searchCity") !== "undefined" ? JSON.parse(localStorage.getItem("searchCity")): 'all'): 'all',
  schoolOptions: localStorage.getItem("schoolOptions") ? (localStorage.getItem("schoolOptions") !== "undefined" ? JSON.parse(localStorage.getItem("schoolOptions")): ['all']): ['all'],
  searchSchool: localStorage.getItem("searchSchool") ? (localStorage.getItem("searchSchool") !== "undefined" ? JSON.parse(localStorage.getItem("searchSchool")): 'all'): 'all',
  gradeOptions: ['all', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  searchGrade: 'all',
  periodOptions: ['all', '1', '2', '3', '4', '5', '6', '7', '8'],
  searchPeriod: 'all',
  teacherOptions: [], // [[teacherName, teacherId], [teacherName, teacherId], ...]
  searchTeacher: 'all',
  typeOptions: ['You and Me, Together Vape-Free', 'Smart Talk: Cannabis Prevention & Education Awareness', 'Safety First', 'Healthy Futures: Tobacco/Nicotine/Vaping','Healthy Futures: Cannabis'],
  searchType: 'You and Me, Together Vape-Free',
  beforeAfterOptions: ['all', 'before', 'after'],
  searchBeforeAfter: 'all',
  teacher:'',
  totalResponses:null,
  hasLocation:null,
  exportData:null,
  currentSchoolIndex:null,
  nextPg:false,
  resetPassword:false,
  twofaSent:false
};

const configureFormStates = (userLocations, user, formStates) => {
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
      newSearchState = userLocations[0].state;
      newSearchCounty = userLocations[0].county;
      newSearchDistrict = userLocations[0].district;
      newSearchCity = userLocations[0].city;
      newSearchSchool = userLocations[0].school;

      newStateOptions = [userLocations[0].state];
      newCountyOptions = [userLocations[0].county];
      newDistrictOptions = [userLocations[0].district];
      newCityOptions = [userLocations[0].city];
      newSchoolOptions = [userLocations[0].school];

      break;
    case "District Admin":
      newSearchState = userLocations[0].state;
      newSearchCounty = userLocations[0].county;
      newSearchDistrict = userLocations[0].district;
      newSearchCity = "all";
      newSearchSchool = "all";

      newStateOptions = [userLocations[0].state];
      newCountyOptions = [userLocations[0].county];
      newDistrictOptions = [userLocations[0].district];
      newCityOptions = ["all", ...narrowCities({state: userLocations[0].state, county: userLocations[0].county, district: userLocations[0].district})];
      newSchoolOptions = ["all", ...narrowSchools({state: userLocations[0].state, county: userLocations[0].county, district: userLocations[0].district})];
      break;
    case "County Admin":
      newSearchState = userLocations[0].state;
      newSearchCounty = userLocations[0].county;
      newSearchDistrict = "all";
      newSearchCity = "all";
      newSearchSchool = "all";

      newStateOptions = [userLocations[0].state];
      newCountyOptions = [userLocations[0].county];

      newCityOptions = ["all", ...narrowCities({state: userLocations[0].state, county: userLocations[0].county})];
      newDistrictOptions = ["all", ...narrowDistricts({state: userLocations[0].state, county: userLocations[0].county})];
      newSchoolOptions = ["all"];
      break;
    case "State Admin":
      newSearchState = userLocations[0].state;
      newSearchCounty = "all";
      newSearchDistrict = "all";
      newSearchCity = "all";
      newSearchSchool = "all";

      newStateOptions = [userLocations[0].state];
      newCountyOptions = ["all", ...narrowCounties({state: newSearchState})];
      newDistrictOptions = ["all"];
      newCityOptions = ["all"];
      newSchoolOptions = ["all"];
      break;
    case "Teacher":
      if (userLocations.length === 1) {
        newSearchState = userLocations[0].state;
        newSearchCounty = userLocations[0].county;
        newSearchDistrict = userLocations[0].district;
        newSearchCity = userLocations[0].city;
        newSearchSchool = userLocations[0].school;

        newStateOptions = [userLocations[0].state];
        newCountyOptions = [userLocations[0].county];
        newDistrictOptions = [userLocations[0].district];
        newCityOptions = [userLocations[0].city];
        newSchoolOptions = [userLocations[0].school];
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

        
      const { user, hasLocation, userLocations } = data;
      
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

        const newFormState = configureFormStates(userLocations, user,
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
          newFormStates: endPoint === 'login' ? newFormState : null
        },
      });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data },
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
      const { data } = await authFetch.post('/schools/user', locationData);
      const { data: data2 } = await authFetch.get('/schools/user', locationData);

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

      const newFormState = configureFormStates(userLocations, user,
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
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

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
      responseGroups,
      exportLoading
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
          searchDistrict,
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
            return obj.school === userLocations[0].school;
          case "District Admin":
            return obj.district === userLocations[0].district;
          case "County Admin":
            return obj.county === userLocations[0].county;
          case "State Admin":
            return obj.state === userLocations[0].state;
          case "Stanford Staff":
            return true;
          case "Teacher":
            return obj.teacher === user._id;
          default:
            return false;
        }
      });


      let newResponses = [];
      let teacherNames = [];
      let schoolIndex = currentSchoolIndex&&!all?currentSchoolIndex:0
            
      while ( schoolIndex<filteredSchools.length) {

        const { data: data2 } = await authFetch.get('/studentResponses', {
          params: {
            school: filteredSchools[schoolIndex].school,
            teacherId: filteredSchools[schoolIndex].teacher,
            grade: searchGrade,
            period: searchPeriod,
            formType: searchType,
            when: searchBeforeAfter,
            all
          }
        });
        const { teacherName, studentResponses } = data2;

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
      dispatch({
        type: GET_RESPONSE_GROUPS_ERROR,
        payload: { msg: error.response },
      });
      logoutUser();
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
    if (search) {
        try {
            dispatch({
                type: GET_EXPORT_BEGIN,
                payload: { exportData: null, msg: "Export Successful" },
            });

            const data = await authFetch.get(`/export/${formCode}${search}`);
            const exportData = data.data.exportData;
            
            
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
          teacherId: school.teacher,
          schoolId: school._id,
          period: uniqueResponseType.period,
          grade: uniqueResponseType.grade,
          formType: uniqueResponseType.formType,
          when: uniqueResponseType.when,
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
        handleChange,
        handleChanges,
        clearValues,
        getResponseGroups,
        getExport,
        successAlert,
        changePage,
        addLocation,
        enterCode,
        submitForm,
        getTotal,
        forgotPassword,
        verifyReset,
        createCertificate,
        resendEmail,
        errorAlert
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
