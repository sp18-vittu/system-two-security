import local from '../../../utils/local'
import api from '../api'

export const GET_CTI_REPORTS_REQUEST = 'GET_CTI_REPORTS_REQUEST'
export const GET_CTI_REPORTS_SUCCESS = 'GET_CTI_REPORTS_SUCCESS'
export const GET_CTI_REPORTS_FAILED = 'GET_CTI_REPORTS_FAILED'
export const GET_CTI_REPORTS_RESET = 'GET_EXECUTE_QUERY_RESET'

export const GET_ALL_CTI_REPORTS_REQUEST = 'GET_ALL_CTI_REPORTS_REQUEST'
export const GET_ALL_CTI_REPORTS_SUCCESS = 'GET_ALL_CTI_REPORTS_SUCCESS'
export const GET_ALL_CTI_REPORTS_FAILED = 'GET_ALL_CTI_REPORTS_FAILED'
export const GET_ALL_CTI_REPORTS_RESET = 'GET_EXECUTE_QUERY_RESET'

export const ctiSourceVault = () => async (dispatch: any, getState: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: GET_CTI_REPORTS_REQUEST })
  try {
    const { data } = await api.get(`/data/cti-source-vault`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({ type: GET_CTI_REPORTS_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: GET_CTI_REPORTS_FAILED, payload: error.message })
  }
}

export const allCtiSourceVault = () => async (dispatch: any, getState: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: GET_ALL_CTI_REPORTS_REQUEST })
  try {
    const { data } = await api.get(`/data/cti-source-all-cti`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({ type: GET_ALL_CTI_REPORTS_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: GET_ALL_CTI_REPORTS_FAILED, payload: error.message })
  }
}
