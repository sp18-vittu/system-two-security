import Axios from 'axios'
import local from '../../../utils/local'
import { environment } from '../../../environment/environment'
import api from '../api'

export const CTI_REPORT_FILE_REQUEST = ' CTI_REPORT_FILE_REQUEST'
export const CTI_REPORT_FILE_SUCCESS = 'CTI_REPORT_FILE_SUCCESS'
export const CTI_REPORT_FILE_FAILED = 'CTI_REPORT_FILE__FAILED'
export const CTI_REPORT_FILE_RESET = 'CTI_REPORT_FILE__RESET'

export const CIT_NAME_LIST_REQUEST = ' CIT_NAME_LIST_REQUEST'
export const CIT_NAME_LIST_SUCCESS = 'CIT_NAME_LIST_SUCCESS'
export const CIT_NAME_LIST_FAILED = 'CIT_NAME_LIST_FAILED'
export const CIT_NAME_LIST_RESET = 'CIT_NAME_LIST_RESET'

export const FILETITLE_UPDATE_REQUEST = ' FILETITLE_UPDATE_REQUEST'
export const FILETITLE_UPDATE_SUCCESS = 'FILETITLE_UPDATE_SUCCESS'
export const FILETITLE_UPDATE_FAILED = 'FILETITLE_UPDATE_FAILED'
export const FILETITLE_UPDATE_RESET = 'FILETITLE_UPDATE_RESET'

export const CTI_REPORT_FILE_STATUS_REQUEST = ' CTI_REPORT_FILE_STATUS_REQUEST'
export const CTI_REPORT_FILE_STATUS_SUCCESS = 'CTI_REPORT_FILE_STATUS_SUCCESS'
export const CTI_REPORT_FILE_STATUS_FAILED = 'CTI_REPORT_FILE_STATUS__FAILED'
export const CTI_REPORT_FILE_STATUS_RESET = 'CTI_REPORT_FILE_STATUS__RESET'

export const ctiReportFileList = (token: any, obj: any) => async (dispatch: any, getState: any) => {
  dispatch({ type: CTI_REPORT_FILE_REQUEST })
  try {
    const { data } = await api.get(`/data/cti-reports/${obj.id}`, {
      headers: { Authorization: `Bearer ${token.bearerToken}` },
      params: { global: obj.global },
    })
    return dispatch({ type: CTI_REPORT_FILE_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: CTI_REPORT_FILE_FAILED, payload: error.message })
  }
}

export const getCtiReportVaultStatus = (token: any, id: any) => async (dispatch: any) => {
  dispatch({ type: CTI_REPORT_FILE_STATUS_REQUEST })
  try {
    const { data } = await api.get(`/data/cti-report/process-status/${id}`, {
      headers: { Authorization: `Bearer ${token.bearerToken}` },
    })
    return dispatch({ type: CTI_REPORT_FILE_STATUS_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: CTI_REPORT_FILE_STATUS_FAILED, payload: error.message })
  }
}

export const updateFileTitle = (fileTitle: any, fileId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: FILETITLE_UPDATE_REQUEST })
  try {
    const { data } = await Axios.put(
      `${environment.baseUrl}/data/cti-report/${fileId}`,
      fileTitle,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({
      type: FILETITLE_UPDATE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: FILETITLE_UPDATE_FAILED, payload: message })
  }
}
