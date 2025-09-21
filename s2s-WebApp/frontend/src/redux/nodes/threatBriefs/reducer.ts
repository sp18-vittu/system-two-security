import {
  GET_THREATBRIEF_AOD_PACKAGE_FAILURE,
  GET_THREATBRIEF_AOD_PACKAGE_REQUEST,
  GET_THREATBRIEF_AOD_PACKAGE_RESET,
  GET_THREATBRIEF_AOD_PACKAGE_SUCCESS,
  GET_THREAT_BRIEF_FAILURE,
  GET_THREAT_BRIEF_REQUEST,
  GET_THREAT_BRIEF_RESET,
  GET_THREAT_BRIEF_SUCCESS,
  GET_THREAT_BRIEF_SUMMARY_FAILURE,
  GET_THREAT_BRIEF_SUMMARY_REQUEST,
  GET_THREAT_BRIEF_SUMMARY_RESET,
  GET_THREAT_BRIEF_SUMMARY_SUCCESS,
} from './action'

const getThreatInitialState = {
  threatBrief: [],
  loading: false,
  errors: {},
}

export const getThreatReducer = (
  state = getThreatInitialState,
  action: { type: string; payload: any },
) => {
  switch (action.type) {
    case GET_THREAT_BRIEF_REQUEST:
    case GET_THREAT_BRIEF_SUCCESS:
      return {
        isAuthenticted: true,
        threatBrief: action.payload,
        loading: false,
        errors: null,
      }
    case GET_THREAT_BRIEF_FAILURE:
      return {
        isAuthenticted: false,
        threatBrief: null,
        loading: false,
        errors: action.payload,
      }
    case GET_THREAT_BRIEF_RESET:
      return {}
    default:
      return state
  }
}

const getThreatSummaryInitialState = {
  summary: {},
  loading: false,
  error: {},
}

export const getThreatSummaryReducer = (
  state = getThreatSummaryInitialState,
  action: { type: string; payload: any },
) => {
  switch (action.type) {
    case GET_THREAT_BRIEF_SUMMARY_REQUEST:
    case GET_THREAT_BRIEF_SUMMARY_SUCCESS:
      return {
        isAuthenticated: true,
        summary: action.payload,
        loading: false,
        error: null,
      }
    case GET_THREAT_BRIEF_SUMMARY_FAILURE:
      return {
        isAuthenticated: true,
        summary: action.payload,
        loading: false,
        error: null,
      }
    case GET_THREAT_BRIEF_SUMMARY_RESET:
      return {}
    default:
      return state
  }
}

const threatAODPackageInitialState = {
  file: null,
  loading: false,
  error: {},
}

export const threatAODPackageReducer = (
  state = threatAODPackageInitialState,
  action: { type: string; payload: any },
) => {
  switch (action.type) {
    case GET_THREATBRIEF_AOD_PACKAGE_REQUEST:
    case GET_THREATBRIEF_AOD_PACKAGE_SUCCESS:
      return {
        isAuthenticated: true,
        file: action.payload,
        loading: false,
        error: null,
      }
    case GET_THREATBRIEF_AOD_PACKAGE_FAILURE:
      return {
        isAuthenticated: false,
        file: null,
        loading: false,
        error: action.payload,
      }
    case GET_THREATBRIEF_AOD_PACKAGE_RESET:
      return {}
    default:
      return state
  }
}
