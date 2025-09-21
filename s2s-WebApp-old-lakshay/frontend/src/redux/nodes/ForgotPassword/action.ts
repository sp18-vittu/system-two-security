import Axios from 'axios'
import { environment } from '../../../environment/environment'
import local from '../../../utils/local'

export const POST_FORGOTPASSWORD_FORM_REQUEST = 'POST_FORGOTPASSWORD_FORM_REQUEST'
export const POST_FORGOTPASSWORD_FORM_SUCCESS = 'POST_FORGOTPASSWORD_FORM_SUCCESS'
export const POST_FORGOTPASSWORD_FORM_FAILED = 'POST_FORGOTPASSWORD_FORM_FAILED'
export const POST_FORGOTPASSWORD_FORM_RESET = 'POST_FORGOTPASSWORD_FORM_RESET'

export const postForgotPassword = (forgotPass: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/auth/forgot-password`, forgotPass, {})
    return dispatch({ type: POST_FORGOTPASSWORD_FORM_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: POST_FORGOTPASSWORD_FORM_FAILED, payload: error.message })
  }
}
