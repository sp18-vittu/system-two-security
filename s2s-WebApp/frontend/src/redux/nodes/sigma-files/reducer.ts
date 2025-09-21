import {
  SIGMA_FILE_SUCCESS,
  SIGMA_FILE_REQUEST,
  SIGMA_FILE_FAILED,
  SIGMA_FILE_RESET,
  CIT_NAME_LIST_SUCCESS,
  CIT_NAME_LIST_REQUEST,
  CIT_NAME_LIST_FAILED,
  CIT_NAME_LIST_RESET,
  SIGMA_FILE_DELETE_FAILED,
  SIGMA_FILE_DELETE_REQUEST,
  SIGMA_FILE_DELETE_SUCCESS,
  SIGMA_FILE_DELETE_RESET,
  SIGMA_FILE_DELETE_ALL_SUCCESS,
  SIGMA_FILE_DELETE_ALL_REQUEST,
  SIGMA_FILE_DELETE_ALL_FAILED,
  SIGMA_FILE_DELETE_ALL_RESET,
} from './action'

const initialState1 = {
  singmaFiles: [],
  loading: false,
  errors: {},
}

const initialState2 = {
  citNameList: [],
  loading: false,
  errors: {},
}
// ************************************************
export const dataSingmaFilesreducer = (
  state = initialState1,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case SIGMA_FILE_SUCCESS:
      return {
        isAuthenticted: true,
        singmaFiles: action.payload,
        loading: false,
        errors: {},
      }
    case SIGMA_FILE_REQUEST:
    case SIGMA_FILE_FAILED:
      return {
        isAuthenticted: false,
        singmaFiles: null,
        loading: false,
        errors: {},
      }
    case SIGMA_FILE_RESET:
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

const initialState23 = {
  sigmadeleteDetail: [],
  loading: false,
  errors: {},
}

export const sigmadeletereducer = (state = initialState23, action: { type: any; payload: any }) => {
  switch (action.type) {
    case SIGMA_FILE_DELETE_SUCCESS:
      return {
        isAuthenticted: true,
        sigmadeleteDetail: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case SIGMA_FILE_DELETE_REQUEST:
    case SIGMA_FILE_DELETE_FAILED:
      return {
        isAuthenticted: false,
        sigmadeleteDetail: null,
        loading: false,
        errors: {},
      }
    case SIGMA_FILE_DELETE_RESET:
      return {}
    default:
      return state
  }
}

const initialState24 = {
  sigmaalldeleteDetail: [],
  loading: false,
  errors: {},
}

export const sigmaalldeletereducer = (
  state = initialState24,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case SIGMA_FILE_DELETE_ALL_SUCCESS:
      return {
        isAuthenticted: true,
        sigmaalldeleteDetail: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case SIGMA_FILE_DELETE_ALL_REQUEST:
    case SIGMA_FILE_DELETE_ALL_FAILED:
      return {
        isAuthenticted: false,
        sigmaalldeleteDetail: null,
        loading: false,
        errors: {},
      }
    case SIGMA_FILE_DELETE_ALL_RESET:
      return {}
    default:
      return state
  }
}
