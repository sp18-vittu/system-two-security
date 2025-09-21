import api from '../api'

export const DASHBOARD_HOMEPAGE_REQUEST = 'DASHBOARD_HOMEPAGE_REQUEST'
export const DASHBOARD_HOMEPAGE_SUCCESS = 'DASHBOARD_HOMEPAGE_SUCCESS'
export const DASHBOARD_HOMEPAGE_FAILED = 'DASHBOARD_HOMEPAGE_FAILED'
export const DASHBOARD_HOMEPAGE_RESET = 'DASHBOARD_HOMEPAGE_RESET'

export const overview = (token: any) => async (dispatch: any, getState: any) => {
  try {
    const { data } = await api.get(`/dashboard-info`, {
      headers: { Authorization: `${token}` },
    })
    return dispatch({ type: DASHBOARD_HOMEPAGE_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: DASHBOARD_HOMEPAGE_FAILED, payload: error.message })
  }
}
