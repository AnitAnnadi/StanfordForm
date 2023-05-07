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
  HANDLE_MULTIPLE_CHANGES,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_RESPONSE_GROUPS_BEGIN,
  GET_RESPONSE_GROUPS_SUCCESS,
  GET_RESPONSE_GROUPS_ERROR,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  DELETE_JOB_ERROR,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  ENTER_CODE,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
  GET_TOTAL,
  ADD_LOCATION_SUCCESS,
  SUCCESS_ALERT
} from './actions';

import { initialState } from './appContext';

const reducer = (state, action) => {
  if (action.type === DISPLAY_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertType: 'danger',
      alertText: 'Please provide all values!',
    };
  }
  if (action.type === SUCCESS_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertType: 'success',
      alertText: action.payload.alertText,
    };
  }
  if (action.type === CLEAR_ALERT) {
    return {
      ...state,
      showAlert: false,
      alertType: '',
      alertText: '',
    };
  }

  if (action.type === SETUP_USER_BEGIN) {
    return { ...state, isLoading: true };
  }

  if (action.type === SETUP_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      user: action.payload.user,
      hasLocation:action.payload.hasLocation,
      userLocation: action.payload.location,
      userLocations: action.payload.userLocations,
      jobLocation: action.payload.location,
      searchState: action.payload.newSearchState,
      searchCounty: action.payload.newSearchCounty,
      searchDistrict: action.payload.newSearchDistrict,
      searchCity: action.payload.newSearchCity,
      searchSchool: action.payload.newSearchSchool,
      stateOptions: action.payload.newStateOptions,
      countyOptions: action.payload.newCountyOptions,
      districtOptions: action.payload.newDistrictOptions,
      cityOptions: action.payload.newCityOptions,
      schoolOptions: action.payload.newSchoolOptions,
      showAlert: true,
      alertType: 'success',
      alertText: action.payload.alertText,
      
    };
    
  }
  if (action.type === SETUP_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  if (action.type === TOGGLE_SIDEBAR) {
    return {
      ...state,
      showSidebar: !state.showSidebar,
    };
  }
  if (action.type === LOGOUT_USER) {
    return {
      ...initialState,
      user: null,
      userLocations: [],
      userLoading: false,
    };
  }
  if (action.type === UPDATE_USER_BEGIN) {
    return { ...state, isLoading: true };
  }
  
  if (action.type === UPDATE_USER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      showAlert: true,
      alertType: 'success',
      alertText: 'User Profile Updated!',
    };
  }
  if (action.type === UPDATE_USER_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  if (action.type === HANDLE_CHANGE) {
    return {
      ...state,
      page: 1,
      [action.payload.name]: action.payload.value,
    };
  }
  if (action.type === HANDLE_MULTIPLE_CHANGES) {
  return {
    ...state,
    ...action.payload,
  };
  }
  if (action.type === CLEAR_VALUES) {
    const initialState = {
      isEditing: false,
      editJobId: '',
      position: '',
      company: '',
      jobLocation: state.userLocation,
      jobType: 'full-time',
      status: 'pending',
    };

    return {
      ...state,
      ...initialState,
    };
  }
  if (action.type === CREATE_JOB_BEGIN) {
    return { ...state, isLoading: true };
  }

  if (action.type === CREATE_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'New Job Created!',
    };
  }
  if (action.type === CREATE_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  if (action.type === ENTER_CODE) {
    return {
    // ...state,
    ...state, 
    isLoading: true, 
    teacher:action.payload.teacher,
    showAlert:true,
    alertType: 'success',
    alertText: "Sucessfully Joined New Form",
    schools:action.payload.schools,};
  }

  if (action.type === GET_TOTAL) {
    return {...state,totalResponses:action.payload};
  }

  // if (action.type === ENTER_CODE) {
  //   return { ...state, isLoading: true, showAlert: false };
  // }
  if (action.type === GET_RESPONSE_GROUPS_BEGIN) {
    return { ...state, isLoading: true, showAlert: false };
  }
  if (action.type === GET_RESPONSE_GROUPS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      responseGroups: action.payload.responseGroups,
      totalResponseGroups: action.payload.totalResponseGroups,
      numOfPages: action.payload.numOfPages,
      teacherOptions: action.payload.teacherOptions,
    };
  }
  if (action.type === GET_RESPONSE_GROUPS_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  if (action.type === SET_EDIT_JOB) {
    const job = state.jobs.find((job) => job._id === action.payload.id);
    const { _id, position, company, jobLocation, jobType, status } = job;
    return {
      ...state,
      isEditing: true,
      editJobId: _id,
      position,
      company,
      jobLocation,
      jobType,
      status,
    };
  }
  if (action.type === DELETE_JOB_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === DELETE_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  if (action.type === EDIT_JOB_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === EDIT_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: 'Job Updated!',
    };
  }
  if (action.type === EDIT_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
    };
  }
  if (action.type === SHOW_STATS_BEGIN) {
    return {
      ...state,
      isLoading: true,
      showAlert: false,
    };
  }
  if (action.type === SHOW_STATS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      stats: action.payload.stats,
      monthlyApplications: action.payload.monthlyApplications,
    };
  }
  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      numOfPages: 1,
      responseGroups: [],
      totalResponsesGroups: 0,
      searchState: 'all',
      searchCounty: 'all',
      searchCity: 'all',
      searchDistrict: 'all',
      searchSchool: 'all',
      searchGrade: 'all',
      searchTeacher: 'all',
      searchPeriod: 'all',
      searchType: 'tobacco',
      searchBeforeAfter: 'all',
      countyOptions: initialState.countyOptions,
      cityOptions: initialState.cityOptions,
      districtOptions: initialState.districtOptions,
      schoolOptions: initialState.schoolOptions,
      teacherOptions: initialState.teacherOptions,
    };
  }
  if (action.type === CHANGE_PAGE) {
    return { ...state, page: action.payload.page };
  }
  if (action.type === GET_CURRENT_USER_BEGIN) {
    return { ...state, userLoading: true, showAlert: false };
  }
  if (action.type === GET_CURRENT_USER_SUCCESS) {
    return {
      ...state,
      userLoading: false,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      hasLocation: action.payload.hasLocation
    };
  }
  if (action.type === ADD_LOCATION_SUCCESS) {
    return {
      ...state,
      userLocations: action.payload.userLocations,
      searchState: action.payload.newSearchState,
      searchCounty: action.payload.newSearchCounty,
      searchDistrict: action.payload.newSearchDistrict,
      searchCity: action.payload.newSearchCity,
      searchSchool: action.payload.newSearchSchool,
      stateOptions: action.payload.newStateOptions,
      countyOptions: action.payload.newCountyOptions,
      districtOptions: action.payload.newDistrictOptions,
      cityOptions: action.payload.newCityOptions,
      schoolOptions: action.payload.newSchoolOptions,
      hasLocation: true,
      showAlert: true,
      alertType: 'success',
      alertText: 'Location added!',
    };
  }
  throw new Error(`no such action : ${action.type}`);
};

export default reducer;
