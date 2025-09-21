import Axios from 'axios'
import { environment } from '../../../environment/environment'

export const NEW_LOGIN_REQUEST = 'NEW_LOGIN_REQUEST'
export const NEW_LOGIN_SUCCESS = 'NEW_LOGIN_SUCCESS'
export const NEW_LOGIN_FAIL = 'NEW_LOGIN_FAIL'
export const NEW_LOGIN_RESET = 'NEW_LOGIN_RESET'

export const login = (value: any) => async (dispatch: any) => {
  dispatch({ type: NEW_LOGIN_REQUEST })
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/auth/secure-login`, value)
    return dispatch({ type: NEW_LOGIN_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: NEW_LOGIN_FAIL, payload: error.message })
  }
}
