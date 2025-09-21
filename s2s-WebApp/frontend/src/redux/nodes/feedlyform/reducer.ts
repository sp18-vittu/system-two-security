import {
  ADD_CTI_FEEDLY_FORM_FAILED,
  ADD_CTI_FEEDLY_FORM_REQUEST,
  ADD_CTI_FEEDLY_FORM_RESET,
  ADD_CTI_FEEDLY_FORM_SUCCESS,
  ADD_FEEDLY_FORM_FAILED,
  ADD_FEEDLY_FORM_REQUEST,
  ADD_FEEDLY_FORM_RESET,
  ADD_FEEDLY_FORM_SUCCESS,
  FEEDLY_DELETE_FAILED,
  FEEDLY_DELETE_REQUEST,
  FEEDLY_DELETE_RESET,
  FEEDLY_DELETE_SUCCESS,
  GET_FEEDLY_FORM_FAILED,
  GET_FEEDLY_FORM_REQUEST,
  GET_FEEDLY_FORM_RESET,
  GET_FEEDLY_FORM_SUCCESS,
  GET_ID_FEEDLY_FORM_FAILED,
  GET_ID_FEEDLY_FORM_REQUEST,
  GET_ID_FEEDLY_FORM_SUCCESS,
  UPDATE_FEEDLY_FORM_FAILED,
  UPDATE_FEEDLY_FORM_REQUEST,
  UPDATE_FEEDLY_FORM_RESET,
  UPDATE_FEEDLY_FORM_SUCCESS,
} from './action'

const initialState5 = {
  feedlySaveDetail: [],
  loading: false,
  errors: {},
}
export const feedlyFormReducer = (state = initialState5, action: { type: any; payload: any }) => {
  switch (action.type) {
    case ADD_FEEDLY_FORM_SUCCESS:
      return {
        isAuthenticted: true,
        feedlySaveDetail: action.payload,
        loading: false,
        errors: {},
      }
    case ADD_FEEDLY_FORM_REQUEST:
    case ADD_FEEDLY_FORM_FAILED:
      return {
        isAuthenticted: false,
        feedlySaveDetail: null,
        loading: false,
        errors: {},
      }
    case ADD_FEEDLY_FORM_RESET:
      return {}
    default:
      return state
  }
}

const initialState2 = {
  feedlyget: [],
  loading: false,
  errors: {},
}
export const feedlyGetFormReducer = (
  state = initialState2,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case GET_FEEDLY_FORM_SUCCESS:
      return {
        isAuthenticted: true,
        feedlyget: action.payload,
        loading: false,
        errors: {},
      }
    case GET_FEEDLY_FORM_REQUEST:
    case GET_FEEDLY_FORM_FAILED:
      return {
        isAuthenticted: false,
        feedlyget: null,
        loading: false,
        errors: {},
      }
    case GET_FEEDLY_FORM_RESET:
      return {}
    default:
      return state
  }
}

const initialState3 = {
  updatfeedly: [],
  loading: false,
  errors: {},
}

export const feedlyUpdateFormReducer = (
  state = initialState3,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case UPDATE_FEEDLY_FORM_SUCCESS:
      return {
        isAuthenticted: true,
        updatfeedly: action.payload,
        loading: false,
        errors: {},
      }
    case UPDATE_FEEDLY_FORM_REQUEST:
    case UPDATE_FEEDLY_FORM_FAILED:
      return {
        isAuthenticted: false,
        updatfeedly: null,
        loading: false,
        errors: {},
      }
    case UPDATE_FEEDLY_FORM_RESET:
      return {}
    default:
      return state
  }
}

const initialState4 = {
  deletefeeldy: [],
  loading: false,
  errors: {},
}
export const feedlyDeletereducer = (state = initialState4, action: { type: any; payload: any }) => {
  switch (action.type) {
    case FEEDLY_DELETE_SUCCESS:
      return {
        isAuthenticted: true,
        deletefeeldy: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case FEEDLY_DELETE_REQUEST:
    case FEEDLY_DELETE_FAILED:
      return {
        isAuthenticted: false,
        deletefeeldy: null,
        loading: false,
        errors: {},
      }
    case FEEDLY_DELETE_RESET:
      return {}
    default:
      return state
  }
}

const initialState8 = {
  feedlycti: [],
  loading: false,
  errors: {},
}
export const feedlyCTiPostreducer = (
  state = initialState8,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case ADD_CTI_FEEDLY_FORM_SUCCESS:
      return {
        isAuthenticted: true,
        feedlycti: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case ADD_CTI_FEEDLY_FORM_REQUEST:
    case ADD_CTI_FEEDLY_FORM_FAILED:
      return {
        isAuthenticted: false,
        feedlycti: null,
        loading: false,
        errors: {},
      }
    case ADD_CTI_FEEDLY_FORM_RESET:
      return {}
    default:
      return state
  }
}

const initialState9 = {
  feedlyIdget: [],
  loading: false,
  errors: {},
}
export const feedlyIdGetFormReducer = (
  state = initialState9,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case GET_ID_FEEDLY_FORM_SUCCESS:
      return {
        isAuthenticted: true,
        feedlyIdget: action.payload,
        loading: false,
        errors: {},
      }
    case GET_ID_FEEDLY_FORM_REQUEST:
    case GET_ID_FEEDLY_FORM_FAILED:
      return {
        isAuthenticted: false,
        feedlyIdget: null,
        loading: false,
        errors: {},
      }
    case GET_FEEDLY_FORM_RESET:
      return {}
    default:
      return state
  }
}
