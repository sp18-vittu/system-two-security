import Axios from 'axios'
import { environment } from '../../../environment/environment'
import local from '../../../utils/local'

export const POST_TENANTSIGNUP_FORM_REQUEST = 'POST_TENANTSIGNUP_FORM_REQUEST'
export const POST_TENANTSIGNUP_FORM_SUCCESS = 'POST_TENANTSIGNUP_FORM_SUCCESS'
export const POST_TENANTSIGNUP_FORM_FAILED = 'POST_TENANTSIGNUP_FORM_FAILED'
export const POST_TENANTSIGNUP_FORM_RESET = 'POST_TENANTSIGNUP_FORM_RESET'

export const tenantSignUp = (tenantData: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/data/signup`, tenantData)
    return dispatch({ type: POST_TENANTSIGNUP_FORM_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: POST_TENANTSIGNUP_FORM_FAILED, payload: error.message })
  }
}
