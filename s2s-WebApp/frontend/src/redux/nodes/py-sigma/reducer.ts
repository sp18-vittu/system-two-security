import {
  BULK_TRANSLATE_FILE_FAILED,
  BULK_TRANSLATE_FILE_REQUEST,
  BULK_TRANSLATE_FILE_RESET,
  BULK_TRANSLATE_FILE_SUCCESS,
  CTI_BULK_TRANSLATE_FILE_FAILED,
  CTI_BULK_TRANSLATE_FILE_REQUEST,
  CTI_BULK_TRANSLATE_FILE_RESET,
  CTI_BULK_TRANSLATE_FILE_SUCCESS,
  CTI_REP_BULK_TRANSLATE_FILE_FAILED,
  CTI_REP_BULK_TRANSLATE_FILE_REQUEST,
  CTI_REP_BULK_TRANSLATE_FILE_RESET,
  CTI_REP_BULK_TRANSLATE_FILE_SUCCESS,
  GET_EXECUTE_QUERY_FAILED,
  GET_EXECUTE_QUERY_REQUEST,
  GET_EXECUTE_QUERY_RESET,
  GET_EXECUTE_QUERY_SUCCESS,
  SINGLE_TRANSLATE_FILE_FAILED,
  SINGLE_TRANSLATE_FILE_REQUEST,
  SINGLE_TRANSLATE_FILE_RESET,
  SINGLE_TRANSLATE_FILE_SUCCESS,
  TARGETS_FILE_FAILED,
  TARGETS_FILE_REQUEST,
  TARGETS_FILE_RESET,
  TARGETS_FILE_SUCCESS,
} from './action'

const initialState1 = {
  targetFiles: [],
  loading: false,
  errors: {},
}

export const TargetFilesFilesreducer = (
  state = initialState1,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case TARGETS_FILE_SUCCESS:
      return {
        isAuthenticted: true,
        targetFiles: action.payload,
        loading: false,
        errors: {},
      }
    case TARGETS_FILE_REQUEST:
    case TARGETS_FILE_FAILED:
      return {
        isAuthenticted: false,
        targetFiles: null,
        loading: false,
        errors: {},
      }
    case TARGETS_FILE_RESET:
      return {}
    default:
      return state
  }
}

const initialState2 = {
  bulkTransalate: [],
  loading: false,
  errors: {},
}

export const bulkTransalatesavereducer = (
  state = initialState2,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case BULK_TRANSLATE_FILE_SUCCESS:
      return {
        isAuthenticted: true,
        bulkTransalate: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case BULK_TRANSLATE_FILE_REQUEST:
    case BULK_TRANSLATE_FILE_FAILED:
      return {
        isAuthenticted: false,
        bulkTransalate: null,
        loading: false,
        errors: {},
      }
    case BULK_TRANSLATE_FILE_RESET:
      return {}
    default:
      return state
  }
}

const initialState3 = {
  singleTransalate: [],
  loading: false,
  errors: {},
}

export const singleTransalatesavereducer = (
  state = initialState3,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case SINGLE_TRANSLATE_FILE_SUCCESS:
      return {
        isAuthenticted: true,
        singleTransalate: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case SINGLE_TRANSLATE_FILE_REQUEST:
    case SINGLE_TRANSLATE_FILE_FAILED:
      return {
        isAuthenticted: false,
        singleTransalate: null,
        loading: false,
        errors: {},
      }
    case SINGLE_TRANSLATE_FILE_RESET:
      return {}
    default:
      return state
  }
}

const initialState4 = {
  singleTransalate: [],
  loading: false,
  errors: {},
}

export const ctiBulkTransalatesavereducer = (
  state = initialState4,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case CTI_BULK_TRANSLATE_FILE_SUCCESS:
      return {
        isAuthenticted: true,
        singleTransalate: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case CTI_BULK_TRANSLATE_FILE_REQUEST:
    case CTI_BULK_TRANSLATE_FILE_FAILED:
      return {
        isAuthenticted: false,
        singleTransalate: null,
        loading: false,
        errors: {},
      }
    case CTI_BULK_TRANSLATE_FILE_RESET:
      return {}
    default:
      return state
  }
}

const initialState5 = {
  bulckTransalate: [],
  loading: false,
  errors: {},
}
export const ctirepBulkTransalatesavereducer = (
  state = initialState5,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case CTI_REP_BULK_TRANSLATE_FILE_SUCCESS:
      return {
        isAuthenticted: true,
        singleTransalate: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case CTI_REP_BULK_TRANSLATE_FILE_REQUEST:
    case CTI_REP_BULK_TRANSLATE_FILE_FAILED:
      return {
        isAuthenticted: false,
        singleTransalate: null,
        loading: false,
        errors: {},
      }
    case CTI_REP_BULK_TRANSLATE_FILE_RESET:
      return {}
    default:
      return state
  }
}

const initialStateOfExecuteQuery = {
  executeQuery: {},
  loading: false,
  errors: {},
}
export const executeQueryReducer = (
  state = initialStateOfExecuteQuery,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case GET_EXECUTE_QUERY_SUCCESS:
      return {
        isAuthenticted: true,
        executeQuery: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case GET_EXECUTE_QUERY_REQUEST:
    case GET_EXECUTE_QUERY_FAILED:
      return {
        isAuthenticted: false,
        executeQuery: null,
        loading: false,
        errors: {},
      }
    case GET_EXECUTE_QUERY_RESET:
      return {}
    default:
      return state
  }
}
