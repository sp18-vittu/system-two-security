import Axios from 'axios'
import moment from 'moment'
import local from '../../../utils/local'
import { environment } from '../../../environment/environment'
import api from '../api'

export const AUDIT_DETAILS_REQUEST = 'AUDIT_DETAILS_REQUEST'
export const AUDIT_DETAILS_SUCCESS = 'AUDIT_DETAILS_SUCCESS'
export const AUDIT_DETAILS_FAILED = 'AUDIT_DETAILS_FAILED'
export const AUDIT_DETAILS_RESET = 'AUDIT_DETAILS_RESET'

export const FEEDBACK_REQUEST = 'FEEDBACK_REQUEST'
export const FEEDBACK_SUCCESS = 'FEEDBACK_SUCCESS'
export const FEEDBACK_FAILED = 'FEEDBACK_FAILED'
export const FEEDBACK_RESET = 'FEEDBACK_RESET'

export const AuditList = (token: any) => async (dispatch: any, getState: any) => {
  const newdate = moment(new Date()).format('YYYY-MM-DD')

  const tenantDto = local.getItem('auth')
  const tenantd = JSON.parse(tenantDto as any)
  const tenant = tenantd?.user?.user
  const tenantName = tenant?.tenantId
  dispatch({
    type: AUDIT_DETAILS_REQUEST,
  })
  try {
    const { data } = await api.get(
      `/rag/api/telemetry?tenant=${tenantName}&start_date=${newdate}&end_date=${newdate}`,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    dispatch({ type: AUDIT_DETAILS_SUCCESS, payload: data })
  } catch (error: any) {
    dispatch({ type: AUDIT_DETAILS_FAILED, payload: error.message })
  }
}

export const feedbackSession = (conversation: any) => async (dispatch: any, getState: any) => {
  dispatch({
    type: FEEDBACK_REQUEST,
  })
  try {
    const result = await Axios.post(
      `${environment.baseUrl}/rag/api/telemetry/feedback`,
      conversation,
    )
    dispatch({ type: FEEDBACK_SUCCESS, payload: result.data })
  } catch (error: any) {
    dispatch({ type: FEEDBACK_FAILED, payload: error.message })
  }
}
