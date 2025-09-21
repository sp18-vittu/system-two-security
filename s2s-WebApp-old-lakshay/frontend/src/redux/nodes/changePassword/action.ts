import Axios from 'axios'
import { environment } from '../../../environment/environment'

export const POST_CHANGEPASSWORD_FORM_REQUEST = 'POST_CHANGEPASSWORD_FORM_REQUEST'
export const POST_CHANGEPASSWORD_FORM_SUCCESS = 'POST_CHANGEPASSWORD_FORM_SUCCESS'
export const POST_CHANGEPASSWORD_FORM_FAILED = 'POST_CHANGEPASSWORD_FORM_FAILED'
export const POST_CHANGEPASSWORD_FORM_RESET = 'POST_CHANGEPASSWORD_FORM_RESET'

export const postChangePassword = (changePass: any) => async (dispatch: any) => {
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/auth/new-password-login`,
      changePass,
      {},
    )
    return dispatch({ type: POST_CHANGEPASSWORD_FORM_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: POST_CHANGEPASSWORD_FORM_FAILED, payload: error.message })
  }
}
