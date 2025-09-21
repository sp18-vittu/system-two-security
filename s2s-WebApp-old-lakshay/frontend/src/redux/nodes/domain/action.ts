import Axios from 'axios'
import local from '../../../utils/local'
import jwt_decode from 'jwt-decode'
import { LOGIN_FAILED, LOGIN_REQUEST, LOGIN_SUCCESS } from '../auth/actions'
import { environment } from '../../../environment/environment'

export const DOMAIN_REQUEST = 'DOMAIN_REQUEST'
export const DOMAIN_SUCCESS = 'DOMAIN_SUCCESS'
export const DOMAIN_FAILED = 'DOMAIN_FAILED'

export const TOKEN_REQUEST = 'TOKEN_REQUEST'
export const TOKEN_SUCCESS = 'TOKEN_SUCCESS'
export const TOKEN_FAILED = 'TOKEN_FAILED'

export const ssoDomainAuth = (ssoUser: any) => async (dispatch: any) => {
  dispatch({ type: DOMAIN_REQUEST })
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/auth/loginUrl`, ssoUser)

    local.setItem('data', JSON.stringify(data))

    dispatch({
      type: DOMAIN_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: DOMAIN_FAILED, payload: message })
  }
}

export const tokenAuth = (token: any) => async (dispatch: any) => {
  dispatch({ type: TOKEN_REQUEST })
  dispatch({ type: LOGIN_REQUEST })
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/auth/accessToken`, token)

    const decodedToken = jwt_decode(data.bearerToken)
    local.setItem('auth', JSON.stringify(decodedToken))
    local.setItem('bearerToken', JSON.stringify(data))
    dispatch({
      type: LOGIN_SUCCESS,
      payload: decodedToken,
    })
    dispatch({
      type: TOKEN_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: TOKEN_FAILED, payload: message })
    dispatch({
      type: LOGIN_FAILED,
      payload: message,
    })
  }
}
