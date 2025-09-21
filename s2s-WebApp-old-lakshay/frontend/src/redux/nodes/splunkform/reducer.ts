import {
  ADD_SPLUNK_FORM_FAILED,
  ADD_SPLUNK_FORM_REQUEST,
  ADD_SPLUNK_FORM_RESET,
  ADD_SPLUNK_FORM_SUCCESS,
  GET_ID_SPLUNK_FORM_FAILED,
  GET_ID_SPLUNK_FORM_REQUEST,
  GET_ID_SPLUNK_FORM_RESET,
  GET_ID_SPLUNK_FORM_SUCCESS,
  GET_SPLUNK_FORM_FAILED,
  GET_SPLUNK_FORM_REQUEST,
  GET_SPLUNK_FORM_RESET,
  GET_SPLUNK_FORM_SUCCESS,
  SPLUNK_DELETE_FAILED,
  SPLUNK_DELETE_REQUEST,
  SPLUNK_DELETE_RESET,
  SPLUNK_DELETE_SUCCESS,
  UPDATE_SPLUNK_FORM_FAILED,
  UPDATE_SPLUNK_FORM_REQUEST,
  UPDATE_SPLUNK_FORM_RESET,
  UPDATE_SPLUNK_FORM_SUCCESS,
} from './action'

const initialState1 = {
  splunkSaveDetail: [],
  loading: false,
  errors: {},
}
export const splunkFormReducer = (state = initialState1, action: { type: any; payload: any }) => {
  switch (action.type) {
    case ADD_SPLUNK_FORM_SUCCESS:
      return {
        isAuthenticted: true,
        splunkSaveDetail: action.payload,
        loading: false,
        errors: {},
      }
    case ADD_SPLUNK_FORM_REQUEST:
    case ADD_SPLUNK_FORM_FAILED:
      return {
        isAuthenticted: false,
        splunkSaveDetail: null,
        loading: false,
        errors: {},
      }
    case ADD_SPLUNK_FORM_RESET:
      return {}
    default:
      return state
  }
}

const initialState2 = {
  splunkget: [],
  loading: false,
  errors: {},
}
export const splunkGetFormReducer = (
  state = initialState2,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case GET_SPLUNK_FORM_SUCCESS:
      return {
        isAuthenticted: true,
        splunkget: action.payload,
        loading: false,
        errors: {},
      }
    case GET_SPLUNK_FORM_REQUEST:
    case GET_SPLUNK_FORM_FAILED:
      return {
        isAuthenticted: false,
        splunkget: null,
        loading: false,
        errors: {},
      }
    case GET_SPLUNK_FORM_RESET:
      return {}
    default:
      return state
  }
}

const initialState3 = {
  feedlyIdget: [],
  loading: false,
  errors: {},
}
export const splunkIdGetFormReducer = (
  state = initialState3,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case GET_ID_SPLUNK_FORM_SUCCESS:
      return {
        isAuthenticted: true,
        feedlyIdget: action.payload,
        loading: false,
        errors: {},
      }
    case GET_ID_SPLUNK_FORM_REQUEST:
    case GET_ID_SPLUNK_FORM_FAILED:
      return {
        isAuthenticted: false,
        feedlyIdget: null,
        loading: false,
        errors: {},
      }
    case GET_ID_SPLUNK_FORM_RESET:
      return {}
    default:
      return state
  }
}

const initialState4 = {
  updatesplunk: [],
  loading: false,
  errors: {},
}

export const feedlyUpdateFormReducer = (
  state = initialState4,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case UPDATE_SPLUNK_FORM_SUCCESS:
      return {
        isAuthenticted: true,
        updatesplunk: action.payload,
        loading: false,
        errors: {},
      }
    case UPDATE_SPLUNK_FORM_REQUEST:
    case UPDATE_SPLUNK_FORM_FAILED:
      return {
        isAuthenticted: false,
        updatesplunk: null,
        loading: false,
        errors: {},
      }
    case UPDATE_SPLUNK_FORM_RESET:
      return {}
    default:
      return state
  }
}

const initialState5 = {
  deletesplunk: [],
  loading: false,
  errors: {},
}
export const splunkDeletereducer = (state = initialState5, action: { type: any; payload: any }) => {
  switch (action.type) {
    case SPLUNK_DELETE_SUCCESS:
      return {
        isAuthenticted: true,
        deletesplunk: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case SPLUNK_DELETE_REQUEST:
    case SPLUNK_DELETE_FAILED:
      return {
        isAuthenticted: false,
        deletesplunk: null,
        loading: false,
        errors: {},
      }
    case SPLUNK_DELETE_RESET:
      return {}
    default:
      return state
  }
}
