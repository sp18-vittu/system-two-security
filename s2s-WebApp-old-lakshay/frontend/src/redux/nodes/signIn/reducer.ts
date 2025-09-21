import { LOGOUT_SUCCESS } from '../auth/actions'
import { NEW_LOGIN_FAIL, NEW_LOGIN_REQUEST, NEW_LOGIN_RESET, NEW_LOGIN_SUCCESS } from './action'

const initialState = {
  isAuthenticted: false,
  logIn: null,
  loading: false,
  error: {},
}

export const auth = (state = initialState, action: any) => {
  switch (action.type) {
    case NEW_LOGIN_REQUEST:
    case NEW_LOGIN_SUCCESS:
      return {
        isAuthenticated: true,
        logIn: action.payload,
        loading: false,
        error: {},
      }
    case NEW_LOGIN_FAIL:
      return {
        isAuthenticated: false,
        logIn: null,
        loading: false,
        error: action.payload,
      }
    case NEW_LOGIN_RESET:
      return initialState
    case LOGOUT_SUCCESS:
      return initialState
    default:
      return state
  }
}
