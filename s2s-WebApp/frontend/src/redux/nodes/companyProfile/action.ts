import Axios from 'axios'
import local from '../../../utils/local'
import { environment } from '../../../environment/environment'
import api from '../api'

export const COMPANY_PROFILE_REQUEST = 'COMPANY_PROFILE_REQUEST'
export const COMPANY_PROFILE_SUCCESS = 'COMPANY_PROFILE_SUCCESS'
export const COMPANY_PROFILE_FAILED = 'COMPANY_PROFILE_FAILED'
export const COMPANY_PROFILE_RESET = 'COMPANY_PROFILE_RESET'

export const COMPANY_PROFILE_GET_REQUEST = 'COMPANY_PROFILE_GET_REQUEST'
export const COMPANY_PROFILE_GET_SUCCESS = 'COMPANY_PROFILE_GET_SUCCESS'
export const COMPANY_PROFILE_GET_FAILED = 'COMPANY_PROFILE_GET_FAILED'
export const COMPANY_PROFILE_GET_RESET = 'COMPANY_PROFILE_GET_RESET'

export const COMPANY_PROFILE_ALL_GET_REQUEST = 'COMPANY_PROFILE_ALL_GET_REQUEST'
export const COMPANY_PROFILE_ALL_GET_SUCCESS = 'COMPANY_PROFILE_ALL_GET_SUCCESS'
export const COMPANY_PROFILE_ALL_GET_FAILED = 'COMPANY_PROFILE_ALL_GET_FAILED'
export const COMPANY_PROFILE_ALL_GET_RESET = 'COMPANY_PROFILE_ALL_GET_RESET'

export const companyProfilePost = (companyProfile: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: COMPANY_PROFILE_REQUEST })
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/profile/save-profile-info`,
      companyProfile,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({
      type: COMPANY_PROFILE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: COMPANY_PROFILE_FAILED, payload: message })
  }
}

export const getCompanyProfile = () => async (dispatch: any, getState: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)

  try {
    const { data } = await api.get(`/data/profile/company-profile-info`, {
      headers: { Authorization: `${token.bearerToken}` },
    })

    return dispatch({ type: COMPANY_PROFILE_GET_SUCCESS, payload: data })
  } catch (error: any) {
    dispatch({ type: COMPANY_PROFILE_GET_FAILED, payload: error.message })
  }
}

export const getCompanyAllProfile = () => async (dispatch: any, getState: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)

  try {
    const { data } = await api.get(`/data/profile/all-profile-info`, {
      headers: { Authorization: `${token.bearerToken}` },
    })

    return dispatch({ type: COMPANY_PROFILE_ALL_GET_SUCCESS, payload: data })
  } catch (error: any) {
    dispatch({ type: COMPANY_PROFILE_ALL_GET_FAILED, payload: error.message })
  }
}
