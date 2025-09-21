import Axios from 'axios'
import local from '../../../utils/local'
import { environment } from '../../../environment/environment'
import api from '../api'

export const CREATE_NEWCHAT_REQUEST = 'CREATE_NEWCHAT_REQUEST'
export const CREATE_NEWCHAT_SUCCESS = 'CREATE_NEWCHAT_SUCCESS'
export const CREATE_NEWCHAT_FAILED = 'CREATE_NEWCHAT_FAILED'

export const REPOSITORY_DOC_REQUEST = 'REPOSITORY_DOC_REQUEST'
export const REPOSITORY_DOC_SUCCESS = 'REPOSITORY_DOC_SUCCESS'
export const REPOSITORY_DOC_FAILED = 'REPOSITORY_DOC_FAILED'
export const REPOSITORY_DOC_RESET = 'REPOSITORY_DOC_RESET'

export const REPOSITORY_DOC_UPLOAD_REQUEST = 'REPOSITORY_DOC_UPLOAD_REQUEST'
export const REPOSITORY_DOC_UPLOAD_SUCCESS = 'REPOSITORY_DOC_UPLOAD_SUCCESS'
export const REPOSITORY_DOC_UPLOAD_FAILED = 'REPOSITORY_DOC_UPLOAD_FAILED'
export const REPOSITORY_DOC_UPLOAD_RESET = 'REPOSITORY_DOC_UPLOAD_RESET'

export const REPOSITORY_DOC_DELETE_REQUEST = 'REPOSITORY_DOC_DELETE_REQUEST'
export const REPOSITORY_DOC_DELETE_SUCCESS = 'REPOSITORY_DOC_DELETE_SUCCESS'
export const REPOSITORY_DOC_DELETE_FAILED = 'REPOSITORY_DOC_DELETE_FAILED'
export const REPOSITORY_DOC_DELETE_RESET = 'REPOSITORY_DOC_DELETE_RESET'

export const REPOSITORY_MULTI_DOC_DELETE_REQUEST = 'REPOSITORY_MULTI_DOC_DELETE_REQUEST'
export const REPOSITORY_MULTI_DOC_DELETE_SUCCESS = 'REPOSITORY_MULTI_DOC_DELETE_SUCCESS'
export const REPOSITORY_MULTI_DOC_DELETE_FAILED = 'REPOSITORY_MULTI_DOC_DELETE_FAILED'
export const REPOSITORY_MULTI_DOC_DELETE_RESET = 'REPOSITORY_MULTI_DOC_DELETE_RESET'

export const REPOSITORY_SELECT_DOC_DELETE_REQUEST = 'REPOSITORY_SELECT_DOC_DELETE_REQUEST'
export const REPOSITORY_SELECT_DOC_DELETE_SUCCESS = 'REPOSITORY_SELECT_DOC_DELETE_SUCCESS'
export const REPOSITORY_SELECT_DOC_DELETE_FAILED = 'REPOSITORY_SELECT_DOC_DELETE_FAILED'
export const REPOSITORY_SELECT_DOC_DELETE_RESET = 'REPOSITORY_SELECT_DOC_DELETE_RESET'

export const CREATE_VIEWFILE_VAULT_REQUEST = ' CREATE_VIEWFILE_VAULT_REQUEST'
export const CREATE_VIEWFILE_VAULT_SUCCESS = 'CREATE_VIEWFILE_VAULT_SUCCESS'
export const CREATE_VIEWFILE_VAULT_FAILED = 'CREATE_VIEWFILE_VAULT_FAILED'
export const CREATE_VIEWFILE_VAULT_RESET = 'CREATE_VIEWFILE_VAULT_RESET'

export const CREATE_CTI_REPORT_WHITELIST_REQUEST = ' CREATE_CTI_REPORT_WHITELIST_REQUEST'
export const CREATE_CTI_REPORT_WHITELIST_SUCCESS = 'CREATE_CTI_REPORT_WHITELIST_SUCCESS'
export const CREATE_CTI_REPORT_WHITELIST_FAILED = 'CREATE_CTI_REPORT_WHITELIST_FAILED'
export const CREATE_CTI_REPORT_WHITELIST_RESET = 'CREATE_CTI_REPORT_WHITELIST_RESET'

export const CTI_REPORT_QUALIFIED_URL_REQUEST = ' CTI_REPORT_QUALIFIED_URL_REQUEST'
export const CTI_REPORT_QUALIFIED_URL_SUCCESS = 'CTI_REPORT_QUALIFIED_URL_SUCCESS'
export const CTI_REPORT_QUALIFIED_URL_FAILED = 'CTI_REPORT_QUALIFIED_URL_FAILED'
export const CTI_REPORT_QUALIFIED_URL_RESET = 'CTI_REPORT_QUALIFIED_URL_RESET'
export const addChat = (Newchat: any) => async (dispatch: any) => {
  dispatch({ type: CREATE_NEWCHAT_REQUEST })
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/`)
    dispatch({
      type: CREATE_NEWCHAT_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: CREATE_NEWCHAT_FAILED, payload: message })
  }
}

export const repositoryDocList = (token: any, doc: any) => async (dispatch: any, getState: any) => {
  try {
    const { data } = await api.get(`/data/documents/${doc.id}`, {
      headers: { Authorization: `${token.bearerToken}` },
      params: { global: doc.global },
    })
    return dispatch({ type: REPOSITORY_DOC_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: REPOSITORY_DOC_FAILED, payload: error.message })
  }
}

export const deletedocument = (token: any, documentId: any) => async (dispatch: any) => {
  dispatch({ type: REPOSITORY_DOC_DELETE_REQUEST })
  try {
    const { data } = await Axios.delete(`${environment.baseUrl}/data/cti-report/${documentId}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: REPOSITORY_DOC_DELETE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: REPOSITORY_DOC_DELETE_FAILED, payload: message })
  }
}

export const deletemultipledocument = (token: any, documentId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: REPOSITORY_MULTI_DOC_DELETE_REQUEST })
  try {
    const { data } = await Axios.delete(`${environment.baseUrl}/data/cti-reports/${documentId}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    dispatch({
      type: REPOSITORY_MULTI_DOC_DELETE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: REPOSITORY_MULTI_DOC_DELETE_FAILED, payload: message })
  }
}

export const deleteSelecteddocument = (documentId: any, vaultID: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: REPOSITORY_SELECT_DOC_DELETE_REQUEST })
  try {
    const { data } = await Axios.delete(`${environment.baseUrl}/data/documents/${documentId}`, {
      headers: { Authorization: `${token.bearerToken}` },
      data: vaultID,
    })
    dispatch({
      type: REPOSITORY_SELECT_DOC_DELETE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: REPOSITORY_SELECT_DOC_DELETE_FAILED, payload: message })
  }
}

export const dataVaultviewfile =
  (token: any, userId: any) => async (dispatch: any, getState: any) => {
    try {
      const { data } = await api.get(`/data/document/${userId}`, {
        headers: { Authorization: `${token.bearerToken}` },
        params: { global: false },
      })
      dispatch({ type: CREATE_VIEWFILE_VAULT_SUCCESS, payload: data })
    } catch (error: any) {
      dispatch({ type: CREATE_VIEWFILE_VAULT_FAILED, payload: error.message })
    }
  }
export const addCtiWhitelist = (value: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: CREATE_CTI_REPORT_WHITELIST_REQUEST })
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/data/whitelist`, value, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: CREATE_CTI_REPORT_WHITELIST_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: CREATE_CTI_REPORT_WHITELIST_FAILED, payload: message })
  }
}
export const qualifiedUrls = () => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: CTI_REPORT_QUALIFIED_URL_REQUEST })
  try {
    const { data } = await api.get(`/data/whitelist/qualified-urls`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: CTI_REPORT_QUALIFIED_URL_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: CTI_REPORT_QUALIFIED_URL_FAILED, payload: message })
  }
}
