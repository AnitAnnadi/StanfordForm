import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  GET_EXPORT_SUCCESS,
  GET_EXPORT_FAIL,
  GET_EXPORT_BEGIN,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  HANDLE_MULTIPLE_CHANGES,
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
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
  GET_TOTAL,
  ADD_LOCATION_SUCCESS,
  SUCCESS_ALERT,
  FORM_SUCCESS,
  FORM_FAIL,
  FORM_BEGIN
} from './actions';

import { initialState } from './appContext';

const reducer = (state, action) => {
  if (action.type === DISPLAY_ALERT) {
    if (action.payload.diff){
      return {
        ...state,
        showAlert: true,
        alertType: 'danger',
        alertText: 'Passwords must match',
      };
    }
    else{
      return {
        ...state,
        showAlert: true,
        alertType: 'danger',
        alertText: 'Please provide all values!',
      };

    }
    
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
      ...action.payload.newFormStates,
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

  if (action.type === GET_EXPORT_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: action.payload.msg,
      exportData: action.payload.exportData
    };
  }

  if (action.type === GET_EXPORT_BEGIN) {
    return {
      ...state,
      exportData: null
    };
  }

  if (action.type === GET_EXPORT_FAIL) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
      exportData: null
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
      ...action.payload.newFormStates,
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
  if (action.type === FORM_FAIL) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'danger',
      alertText: action.payload.msg,
      nextPg:false
    };
  }
  if (action.type === FORM_BEGIN) {
    return {
      ...state,
      isLoading: false,
      showAlert: false,
      nextPg:false
    };
  }
  if (action.type === FORM_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: 'success',
      alertText: "Form Sucessfully Completed. Redirecting...",
      nextPg:true
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
    if (action.payload.shouldReload){
      return { ...state, isLoading: true, showAlert: false, responseGroups:[]};
    }
    else{
      return { ...state, isLoading: true, showAlert: false };
    }
  }

  if (action.type === PAGE_FULL) {
    console.log('payload'+action.payload.schoolIndex)
   return { ...state,currentSchoolIndex: action.payload.schoolIndex};
  }
  if (action.type === GET_RESPONSE_GROUPS_SUCCESS) {
    // Filter out duplicate responses from action.payload.newResponses
    const uniqueNewResponses = action.payload.newResponses.filter((newResponse) => {
      return !state.responseGroups.some((existingResponse) => JSON.stringify(existingResponse) === JSON.stringify(newResponse));
    });
    console.log(uniqueNewResponses)

    // console.log(action.payload.all)
    if (action.payload.all){
      return {
        ...state,
        allResponseGroups: action.payload.newResponses,
        teacherOptions: action.payload.teacherOptions,
        isLoading: false
      };
    }
  
    else{
    return {
      ...state,
      responseGroups: [...state.responseGroups, ...uniqueNewResponses], // Append unique new responses to the end
      teacherOptions: action.payload.teacherOptions,
      isLoading: false
    };
  }
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
      hasLocation: action.payload.hasLocation
    };
  }
  if (action.type === ADD_LOCATION_SUCCESS) {
    return {
      ...state,
      userLocations: action.payload.userLocations,
      ...action.payload.newFormStates,
      hasLocation: true,
      showAlert: true,
      alertType: 'success',
      alertText: 'Location added!',
    };
  }
  throw new Error(`no such action : ${action.type}`);
};

export default reducer;
