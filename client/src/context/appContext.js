import React, { useReducer, useContext, useEffect } from 'react';
import {
  getSchoolDataValue,
  narrowCities,
  narrowCounties,
  narrowDistricts,
  narrowSchools
} from "../utils/schoolDataFetch";

import reducer from './reducer';
import axios from 'axios';
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  // CREATE_JOB_BEGIN,
  // CREATE_JOB_SUCCESS,
  // CREATE_JOB_ERROR,
  GET_RESPONSE_GROUPS_BEGIN,
  GET_RESPONSE_GROUPS_SUCCESS,
  GET_RESPONSE_GROUPS_ERROR,
  // SET_EDIT_JOB,
  // DELETE_JOB_BEGIN,
  // DELETE_JOB_ERROR,
  // EDIT_JOB_BEGIN,
  // EDIT_JOB_SUCCESS,
  // EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  // GET_CURRENT_USER_BEGIN,
  // GET_CURRENT_USER_SUCCESS,
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
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: LSUser ? LSUser : null,
  userLocation: '',
  userLocations: LSUserLocations ? (LSUserLocations !== 'undefined' ? LSUserLocations : []) : [],
  showSidebar: false,
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobLocation: '',
  responseGroups: [],
  totalResponseGroups: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
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
  typeOptions: ['You and Me, Together Vape-Free', 'Smart Talk: Cannabis Prevention & Education Awareness', 'Safety First'],
  searchType: 'You and Me, Together Vape-Free',
  beforeAfterOptions: ['all', 'before', 'after'],
  searchBeforeAfter: 'all',
  teacher:'',
  totalResponses:null,
  hasLocation:null,
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
    case "Standford Staff":
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
      // console.log(error.response)
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };
  const successAlert = (text) => {
    dispatch({ type: SUCCESS_ALERT,payload:{alertText:text} });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    localStorage.clear()
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const { data } = await axios.post(
        `/api/v1/auth/${endPoint}`,
        currentUser
      );

      const { user, hasLocation, userLocations } = data;

      localStorage.setItem('user', JSON.stringify(user))

      if (userLocations) {
        localStorage.setItem('userLocations', JSON.stringify(userLocations))
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
        payload: { msg: error.response.data.msg },
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

      const { user } = data;
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
          newFormStates: newFormState
        }
      });
    } catch (error) {
      console.log(error)
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
 const submitForm = async (formData,code,grade,when,type,school,period,state, city, county, district) => {
    console.log(formData,code,grade,when,type,school,period,state, city, county, district)
    
    try {
      const { data } = await axios.post(`/api/v1/auth/submitForm/`, {formData,code,grade,when,type,school,period,state, city, county, district});

    } catch (error) {
      if (error.response.status !== 401) return;
    }
    clearAlert();
  };

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
  // const createJob = async () => {
  //   dispatch({ type: CREATE_JOB_BEGIN });
  //   try {
  //     const { position, company, jobLocation, jobType, status } = state;
  //     await authFetch.post('/jobs', {
  //       position,
  //       company,
  //       jobLocation,
  //       jobType,
  //       status,
  //     });
  //     dispatch({ type: CREATE_JOB_SUCCESS });
  //     dispatch({ type: CLEAR_VALUES });
  //   } catch (error) {
  //     if (error.response.status === 401) return;
  //     dispatch({
  //       type: CREATE_JOB_ERROR,
  //       payload: { msg: error.response.data.msg },
  //     });
  //   }
  //   clearAlert();
  // };
  const getResponseGroups = async () => {
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
    } = state;


    dispatch({ type: GET_RESPONSE_GROUPS_BEGIN });

    try {
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
          case "Standford Staff":
            return true;
          case "Teacher":
            return obj.teacher === user._id;
          default:
            return false;
        }
      });

      let responseGroups = [];

      let teacherNames = [];

      for (const schoolIndex in filteredSchools) {
        const { data: data2 } = await authFetch.get('/studentResponses', {
          params: {
            school: filteredSchools[schoolIndex].school,
            teacherId: filteredSchools[schoolIndex].teacher,
            grade: searchGrade,
            period: searchPeriod,
            formType: searchType,
            when: searchBeforeAfter,
          }
        });
        const { teacherName, studentResponses } = data2;

        let teacherMatch = teacherNames.find(function(obj) {
            return obj[1] === filteredSchools[schoolIndex].teacher;
          });

        if (!teacherMatch) {
          teacherNames.push([teacherName, filteredSchools[schoolIndex].teacher]);
        }


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
          responseGroups.push({
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


        // const periods = [...new Set(studentResponses.map((response) => response.period))];
        //
        // console.log({periods})
        //
        // for (const periodIndex in periods) {
        //   const studentResponsesByPeriod = studentResponses.filter((response) => response.period === periods[periodIndex]);
        //
        //   console.log({studentResponsesByPeriod})
        //   responseGroups.push({
        //     school: filteredSchools[schoolIndex],
        //     teacherName,
        //     period: periods[periodIndex],
        //     studentResponsesByPeriod,
        //   });
        // }
      }


      const limit = 10;
      const skip = (page - 1) * limit;

      responseGroups = responseGroups.slice(skip, skip + limit + 1);

      const numOfPages = Math.ceil(responseGroups.length / limit);

      dispatch({
        type: GET_RESPONSE_GROUPS_SUCCESS,
        payload: {
          responseGroups,
          totalResponseGroups: responseGroups.length,
          numOfPages,
          teacherOptions: searchTeacher === 'all' ? teacherNames : state.teacherOptions,
        },
      });
    } catch (error) {
      dispatch({
        type: GET_RESPONSE_GROUPS_ERROR,
        payload: { msg: error.response.data.msg },
      });
      logoutUser();
    }
    clearAlert();
  };

  // const setEditJob = (id) => {
  //   dispatch({ type: SET_EDIT_JOB, payload: { id } });
  // };
  // const editJob = async () => {
  //   dispatch({ type: EDIT_JOB_BEGIN });
  //
  //   try {
  //     const { position, company, jobLocation, jobType, status } = state;
  //     await authFetch.patch(`/jobs/${state.editJobId}`, {
  //       company,
  //       position,
  //       jobLocation,
  //       jobType,
  //       status,
  //     });
  //     dispatch({ type: EDIT_JOB_SUCCESS });
  //     dispatch({ type: CLEAR_VALUES });
  //   } catch (error) {
  //     if (error.response.status === 401) return;
  //     dispatch({
  //       type: EDIT_JOB_ERROR,
  //       payload: { msg: error.response.data.msg },
  //     });
  //   }
  //   clearAlert();
  // };
  // const deleteJob = async (jobId) => {
  //   dispatch({ type: DELETE_JOB_BEGIN });
  //   try {
  //     await authFetch.delete(`/jobs/${jobId}`);
  //     getJobs();
  //   } catch (error) {
  //     if (error.response.status === 401) return;
  //     dispatch({
  //       type: DELETE_JOB_ERROR,
  //       payload: { msg: error.response.data.msg },
  //     });
  //   }
  //   clearAlert();
  // };

  const getTotal = async(user)=>{
    let code=user.code
    const {data}=await authFetch.post('/jobs/responses', {
      code
    });
    let total=(data["totalResponses"])
    dispatch({ type: GET_TOTAL , payload:{total}});
    
  }
  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch('/jobs/stats');
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };
  // const clearFilters = () => {
  //   dispatch({ type: CLEAR_FILTERS });
  // };
  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  // const getCurrentUser = async () => {
  //   dispatch({ type: GET_CURRENT_USER_BEGIN });
  //   try {
  //     const { data } = await authFetch('/auth/getCurrentUser');
  //     const { user, location, hasLocation } = data;
  //     console.log(hasLocation)
  //     dispatch({
  //       type: GET_CURRENT_USER_SUCCESS,
  //       payload: { user, location, hasLocation },
  //     });
  //   } catch (error) {
  //     console.log(error)
  //     if (error.response.status === 401) return;
  //     logoutUser();
  //   }
  // };
  // useEffect(() => {
  //   getCurrentUser();
  // }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        handleChanges,
        clearValues,
        // createJob,
        getResponseGroups,
        // setEditJob,
        // deleteJob,
        successAlert,
        showStats,
        changePage,
        addLocation,
        enterCode,
        submitForm,
        getTotal
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
