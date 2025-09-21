import Axios from 'axios'
import local from '../../../utils/local'
import { environment } from '../../../environment/environment'
import api from '../api'

export const AUTOMATIC_POST_REQUEST = 'AUTOMATIC_POST_REQUEST'
export const AUTOMATIC_POST_SUCCESS = 'AUTOMATIC_POST_SUCCESS'
export const AUTOMATIC_POST_FAILED = 'AUTOMATIC_POST_FAILED'
export const AUTOMATIC_POST_RESET = 'AUTOMATIC_POST_RESET'

export const MANUAL_UPLOAD_POST_REQUEST = 'MANUAL_UPLOAD_POST_REQUEST'
export const MANUAL_UPLOAD_POST_SUCCESS = 'MANUAL_UPLOAD_POST_SUCCESS'
export const MANUAL_UPLOAD_POST_FAILED = 'MANUAL_UPLOAD_POST_FAILED'
export const MANUAL_UPLOAD_POST_RESET = 'MANUAL_UPLOAD_POST_RESET'

export const FIELDMAPPING_STATUS_GET_REQUEST = 'FIELDMAPPING_STATUS_GET_REQUEST'
export const FIELDMAPPING_STATUS_GET_SUCCESS = 'FIELDMAPPING_STATUS_GET_SUCCESS'
export const FIELDMAPPING_STATUS_GET_FAILED = 'FIELDMAPPING_STATUS_GET_FAILED'
export const FIELDMAPPING_STATUS_GET_RESET = 'FIELDMAPPING_STATUS_GET_RESET'

export const PREVIOUS_FIELDMAPPING_STATUS_GET_REQUEST = 'PREVIOUS_FIELDMAPPING_STATUS_GET_REQUEST'
export const PREVIOUS_FIELDMAPPING_STATUS_GET_SUCCESS = 'PREVIOUS_FIELDMAPPING_STATUS_GET_SUCCESS'
export const PREVIOUS_FIELDMAPPING_STATUS_GET_FAILED = 'PREVIOUS_FIELDMAPPING_STATUS_GET_FAILED'
export const PREVIOUS_FIELDMAPPING_STATUS_GET_RESET = 'PREVIOUS_FIELDMAPPING_STATUS_GET_RESET'

export const AutomaticPost = (datas: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/fieldmapping/automatic/${datas?.source}/${datas?.source_id}`,
      datas,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({ type: AUTOMATIC_POST_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: AUTOMATIC_POST_FAILED, payload: error.message })
  }
}

export const ManualUpload = (datas: any, sourcedata: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/fieldmapping/manual-upload/${sourcedata?.source}/${sourcedata.source_id}`,
      datas,
      {
        headers: { Authorization: `${token.bearerToken}`, 'Content-Type': 'multipart/form-data' },
      },
    )
    return dispatch({ type: MANUAL_UPLOAD_POST_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: MANUAL_UPLOAD_POST_FAILED, payload: error.message })
  }
}

export const GieldmappingStatus =
  (source: any, jobId: any) => async (dispatch: any, getState: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    try {
      const { data } = await api.get(`/data/fieldmapping/status/${source}`, {
        headers: { Authorization: `${token.bearerToken}` },
        params: { jobId: jobId },
      })
      return dispatch({ type: FIELDMAPPING_STATUS_GET_SUCCESS, payload: data })
    } catch (error: any) {
      return dispatch({ type: FIELDMAPPING_STATUS_GET_FAILED, payload: error.message })
    }
  }

export const PreviousFieldmappingStatus = (source: any) => async (dispatch: any, getState: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await api.get(`/data/fieldmapping/status/${source}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({ type: PREVIOUS_FIELDMAPPING_STATUS_GET_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: PREVIOUS_FIELDMAPPING_STATUS_GET_FAILED, payload: error.message })
  }
}
