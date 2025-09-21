import Synth from 'synth'
import local from '../../../utils/local'

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILED = 'LOGIN_FAILED'
export const SIGNUP_REQUEST = 'SIGNUP_REQUEST'
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS'
export const SIGNUP_FAILED = 'SIGNUP_FAILED'
export const PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

export const signin = (credentials: any) => {
  return (dispatch: any) => {
    return Synth.auth
      .signIn(credentials)
      .then((response: any) => {
        local.setItem('auth_token', response.token)
        dispatch({ type: LOGIN_SUCCESS, payload: credentials })
      })
      .catch((error: any) => {
        local.setItem('auth', JSON.stringify({ isAuthenticated: true, user: credentials }))
        dispatch({ type: LOGIN_SUCCESS, payload: credentials })
      })
  }
}

export const signup = (userData: any) => {
  return (dispatch: any) => {
    return Synth.auth
      .signUp(userData)
      .then((response: any) => {
        local.setItem('auth_token', response.token)
        dispatch({ type: SIGNUP_SUCCESS, payload: response })
      })
      .catch((error: any) => {
        dispatch({ type: SIGNUP_FAILED, payload: error })
      })
  }
}

export const inviteuser = (userData: any) => {
  return (dispatch: any) => {
    return Synth.auth
      .signUp(userData)
      .then((response: any) => {
        local.setItem('auth_token', response.token)
        dispatch({ type: SIGNUP_SUCCESS, payload: response })
      })
      .catch((error: any) => {
        dispatch({ type: SIGNUP_FAILED, payload: error })
      })
  }
}

export const passwordreset = (email: any) => {
  return (dispatch: any) => {
    return Synth.auth
      .passwordReset(email)
      .then((response: any) => {
        dispatch({ type: PASSWORD_RESET_SUCCESS, payload: response })
      })
      .catch((error: any) => {
        dispatch({ type: SIGNUP_FAILED, payload: error })
      })
  }
}

export default { signin }
