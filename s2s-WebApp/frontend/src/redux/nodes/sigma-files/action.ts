import Axios from 'axios'
import local from '../../../utils/local'
import { environment } from '../../../environment/environment'
import api from '../api'

export const SIGMA_FILE_REQUEST = ' SIGMA_FILE_REQUEST'
export const SIGMA_FILE_SUCCESS = 'SIGMA_FILE_SUCCESS'
export const SIGMA_FILE_FAILED = 'SIGMA_FILE__FAILED'
export const SIGMA_FILE_RESET = 'SIGMA_FILE__RESET'

export const CIT_NAME_LIST_REQUEST = ' CIT_NAME_LIST_REQUEST'
export const CIT_NAME_LIST_SUCCESS = 'CIT_NAME_LIST_SUCCESS'
export const CIT_NAME_LIST_FAILED = 'CIT_NAME_LIST_FAILED'
export const CIT_NAME_LIST_RESET = 'CIT_NAME_LIST_RESET'

export const SIGMA_FILE_DELETE_REQUEST = ' SIGMA_FILE_DELETE_REQUEST'
export const SIGMA_FILE_DELETE_SUCCESS = 'SIGMA_FILE_DELETE_SUCCESS'
export const SIGMA_FILE_DELETE_FAILED = 'SIGMA_FILE_DELETE_FAILED'
export const SIGMA_FILE_DELETE_RESET = 'SIGMA_FILE_DELETE_RESET'

export const SIGMA_FILE_DELETE_ALL_REQUEST = ' SIGMA_FILE_DELETE_REQUEST'
export const SIGMA_FILE_DELETE_ALL_SUCCESS = 'SIGMA_FILE_DELETE_ALL_SUCCESS'
export const SIGMA_FILE_DELETE_ALL_FAILED = 'SIGMA_FILE_DELETE_ALL_FAILED'
export const SIGMA_FILE_DELETE_ALL_RESET = 'SIGMA_FILE_DELETE_ALL_RESET'

const localStorage = local.getItem('bearerToken')
const token = JSON.parse(localStorage as any)

export const sigmaFileList = (token: any, id: any) => async (dispatch: any, getState: any) => {
  dispatch({ type: SIGMA_FILE_REQUEST })
  const vault = sessionStorage.getItem('vault')
  const selectedDataVault = JSON.parse(vault as any)
  try {
    const { data } = await api.get(`/data/documents/${id}`, {
      headers: { Authorization: `${token.bearerToken}` },
      params: { global: selectedDataVault.global },
    })

    return dispatch({ type: SIGMA_FILE_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: SIGMA_FILE_FAILED, payload: error.message })
  }
}

export const sigmaCitNameList = (token: any, obj: any) => async (dispatch: any, getState: any) => {
  dispatch({ type: CIT_NAME_LIST_REQUEST })
  try {
    const { data } = await api.get(`/data/sigma-files/${obj.id}`, {
      headers: { Authorization: `${token.bearerToken}` },
      params: { global: obj.global },
    })

    return dispatch({ type: CIT_NAME_LIST_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: CIT_NAME_LIST_FAILED, payload: error.message })
  }
}

export const sigmaFilesingleDelete = (vaulId: any, docId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: SIGMA_FILE_DELETE_REQUEST })
  try {
    const { data } = await Axios.delete(`${environment.baseUrl}/data/document/${docId}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: SIGMA_FILE_DELETE_SUCCESS,
      // payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: SIGMA_FILE_DELETE_FAILED, payload: message })
  }
}

export const sigmaFileAllsingleDelete =
  (vaulId: any, id: any, docId: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: SIGMA_FILE_DELETE_ALL_REQUEST })
    try {
      const { data } = await Axios.delete(`${environment.baseUrl}/data/documents/${id}`, {
        headers: { Authorization: `${token.bearerToken}` },
        data: docId,
      })

      dispatch({
        type: SIGMA_FILE_DELETE_ALL_SUCCESS,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      dispatch({ type: SIGMA_FILE_DELETE_ALL_FAILED, payload: message })
    }
  }
