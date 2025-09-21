import {
  CTI_REPORT_FILE_SUCCESS,
  CTI_REPORT_FILE_REQUEST,
  CTI_REPORT_FILE_FAILED,
  CTI_REPORT_FILE_RESET,
  CIT_NAME_LIST_SUCCESS,
  CIT_NAME_LIST_REQUEST,
  CIT_NAME_LIST_FAILED,
  CIT_NAME_LIST_RESET,
  FILETITLE_UPDATE_REQUEST,
  FILETITLE_UPDATE_SUCCESS,
  FILETITLE_UPDATE_FAILED,
  FILETITLE_UPDATE_RESET,
} from './action'

const initialState1 = {
  ctiReportFiles: [],
  loading: false,
  errors: {},
}

const initialState2 = {
  citNameList: [],
  loading: false,
  errors: {},
}

const initialState3 = {
  citNameUpdateList: {},
  loading: false,
  errors: {},
}
// ************************************************
export const datactiReportreducer = (
  state = initialState1,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case CTI_REPORT_FILE_SUCCESS:
      return {
        isAuthenticted: true,
        ctiReportFiles: action.payload,
        loading: false,
        errors: {},
      }
    case CTI_REPORT_FILE_REQUEST:
    case CTI_REPORT_FILE_FAILED:
      return {
        isAuthenticted: false,
        ctiReportFiles: null,
        loading: false,
        errors: {},
      }
    case CTI_REPORT_FILE_RESET:
      return {}
    default:
      return state
  }
}

// ************************************************
export const dataSingmaCitNamereducer = (
  state = initialState2,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case CIT_NAME_LIST_SUCCESS:
      return {
        isAuthenticted: true,
        citNameList: action.payload,
        loading: false,
        errors: {},
      }
    case CIT_NAME_LIST_REQUEST:
    case CIT_NAME_LIST_FAILED:
      return {
        isAuthenticted: false,
        citNameList: null,
        loading: false,
        errors: {},
      }
    case CIT_NAME_LIST_RESET:
      return {}
    default:
      return state
  }
}

export const updateFileTitleReducer = (
  state = initialState3,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case FILETITLE_UPDATE_REQUEST:
    case FILETITLE_UPDATE_SUCCESS:
      return {
        isAuthenticted: true,
        citNameUpdateList: action.payload,
        loading: false,
        errors: {},
      }
    case FILETITLE_UPDATE_FAILED:
      return {
        isAuthenticted: false,
        citNameUpdateList: null,
        loading: false,
        errors: {},
      }
    case FILETITLE_UPDATE_RESET:
      return {}
    default:
      return state
  }
}
