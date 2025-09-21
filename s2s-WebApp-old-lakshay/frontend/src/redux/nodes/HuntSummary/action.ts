import local from '../../../utils/local'
import api from '../api'

export const SUMMARY_GET_DETAIL_REQUEST = 'SUMMARY_GET_DETAIL_REQUEST'
export const SUMMARY_GET_DETAIL_SUCCESS = 'SUMMARY_GET_DETAIL_SUCCESS'
export const SUMMARY_GET_DETAIL_FAILED = 'SUMMARY_GET_DETAIL_FAILED'
export const SUMMARY_GET_DETAIL_RESET = 'SUMMARY_GET_DETAIL_RESET'

export const REPORT_SUMMARY_GET_DETAIL_REQUEST = 'REPORT_SUMMARY_GET_DETAIL_REQUEST'
export const REPORT_SUMMARY_GET_DETAIL_SUCCESS = 'REPORT_SUMMARY_GET_DETAIL_SUCCESS'
export const REPORT_SUMMARY_GET_DETAIL_FAILED = 'REPOR_SUMMARY_GETT_GET_DETAIL_FAILED'
export const REPORT_SUMMARY_GET_DETAIL_RESET = 'REPORT_SUMMARY_GET_DETAIL_RESET'

export const HuntSummaryView = (id: any, uuid: any) => async (dispatch: any, getState: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: SUMMARY_GET_DETAIL_REQUEST })
  try {
    const { data } = await api.get(`/data/threatbriefs/${id}/${uuid}/get-execution-summary`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({ type: SUMMARY_GET_DETAIL_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: SUMMARY_GET_DETAIL_FAILED, payload: error.message })
  }
}

export const HuntReportSummaryView =
  (id: any, uuid: any) => async (dispatch: any, getState: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: REPORT_SUMMARY_GET_DETAIL_REQUEST })
    try {
      const { data } = await api.get(`/data/threatbriefs/${id}/${uuid}/report-summary`, {
        responseType: 'blob',
        headers: { Authorization: `${token.bearerToken}` },
      })
      return dispatch({ type: REPORT_SUMMARY_GET_DETAIL_SUCCESS, payload: data })
    } catch (error: any) {
      return dispatch({ type: REPORT_SUMMARY_GET_DETAIL_FAILED, payload: error.message })
    }
  }
