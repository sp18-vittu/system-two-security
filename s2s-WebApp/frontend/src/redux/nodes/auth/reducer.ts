import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILED,
  PASSWORD_RESET_SUCCESS,
  LOGOUT_SUCCESS,
} from './actions'

const initialState = {
  isAuthenticted: false,
  user: null,
  loading: false,
  errors: {},
  messages: {},
}

const reducer = (state = initialState, action: { type: any; payload: any }) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        isAuthenticated: true,
        loading: false,
        errors: {},
        messages: {},
        user: action.payload,
      }
    case LOGIN_REQUEST:
    case LOGIN_FAILED:
      return {
        loading: false,
        isAuthenticted: false,
        errors: action.payload,
        messages: {},
      }

    case SIGNUP_REQUEST:
    case SIGNUP_SUCCESS:
      return {
        isAuthenticated: true,
        loading: false,
        errors: {},
        messages: {},
        user: action.payload,
      }
    case SIGNUP_FAILED:
      return {
        loading: false,
        errors: action.payload,
        messages: {},
      }
    case PASSWORD_RESET_SUCCESS:
      return {
        loading: false,
        messages: action.payload,
      }
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}

export default reducer
