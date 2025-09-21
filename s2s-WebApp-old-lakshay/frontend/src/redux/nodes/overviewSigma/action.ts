import local from '../../../utils/local'
import api from '../api'

export const DASHBOARD_SIGMA_REQUEST = 'DASHBOARD_SIGMA_REQUEST'
export const DASHBOARD_SIGMA_SUCCESS = 'DASHBOARD_SIGMA_SUCCESS'
export const DASHBOARD_SIGMA_FAILED = 'DASHBOARD_SIGMA_FAILED'
export const DASHBOARD_SIGMA_RESET = 'DASHBOARD_SIGMA_RESET'

export const REPO_SIGMA_REQUEST = 'REPO_SIGMA_REQUEST'
export const REPO_SIGMA_SUCCESS = 'REPO_SIGMA_SUCCESS'
export const REPO_SIGMA_FAILED = 'REPO_SIGMA_FAILED'
export const REPO_SIGMA_RESET = 'REPO_SIGMA_RESET'

export const sigmaFilter = (reportId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await api.get(`/data/sigma-files/${reportId}`, {
      headers: { Authorization: `${token.bearerToken}` },
      params: { global: false },
    })
    return dispatch({ type: DASHBOARD_SIGMA_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: DASHBOARD_SIGMA_FAILED, payload: error.message })
  }
}

export const repoinsightFilter = (reportId: any, params: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await api.get(`/data/sigma-files/${reportId}`, {
      headers: { Authorization: `${token.bearerToken}` },
      params: { global: params?.global },
    })
    return dispatch({ type: REPO_SIGMA_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: REPO_SIGMA_FAILED, payload: error.message })
  }
}
