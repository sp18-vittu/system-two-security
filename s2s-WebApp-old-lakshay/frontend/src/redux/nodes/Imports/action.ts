import Axios from 'axios'
import local from '../../../utils/local'
import api from '../api'
import { environment } from '../../../environment/environment'


export const CLOAN_REPO_POST_REQUEST = 'CLOAN_REPO_POST_REQUEST'
export const CLOAN_REPO_POST_SUCCESS = 'CLOAN_REPO_POST_SUCCESS'
export const CLOAN_REPO_POST_FAILED = 'CLOAN_REPO_POST_FAILED'
export const CLOAN_REPO_POST_RESET = 'CLOAN_REPO_POST_RESET'


export const DOCUMENT_UUID_GET_REQUEST = 'DOCUMENT_UUID_GET_REQUEST'
export const DOCUMENT_UUID_GET_SUCCESS = 'DOCUMENT_UUID_GET_SUCCESS'
export const DOCUMENT_UUID_GET_FAILED = 'DOCUMENT_UUID_GET_FAILED'
export const DOCUMENT_UUID_GET_RESET = 'DOCUMENT_UUID_GET_RESET'

export const IMPORT_TREEVIEW_POST_REQUEST = 'IMPORT_TREEVIEW_POST_REQUEST'
export const IMPORT_TREEVIEW_POST_SUCCESS = 'IMPORT_TREEVIEW_POST_SUCCESS'
export const IMPORT_TREEVIEW_POST_FAILED = 'IMPORT_TREEVIEW_POST_FAILED'
export const IMPORT_TREEVIEW_POST_RESET = 'IMPORT_TREEVIEW_POST_RESET'

export const IMPORT_TREEVIEW_GET_REQUEST = 'IMPORT_TREEVIEW_GET_REQUEST'
export const IMPORT_TREEVIEW_GET_SUCCESS = 'IMPORT_TREEVIEW_GET_SUCCESS'
export const IMPORT_TREEVIEW_GET_FAILED = 'IMPORT_TREEVIEW_GET_FAILED'
export const IMPORT_TREEVIEW_GET_RESET = 'IMPORT_TREEVIEW_GET_RESET'

export const IMPORT_TREEVIEW_DELETE_REQUEST = 'IMPORT_TREEVIEW_DELETE_REQUEST'
export const IMPORT_TREEVIEW_DELETE_SUCCESS = 'IMPORT_TREEVIEW_DELETE_SUCCESS'
export const IMPORT_TREEVIEW_DELETE_FAILED = 'IMPORT_TREEVIEW_DELETE_FAILED'
export const IMPORT_TREEVIEW_DELETE_RESET = 'IMPORT_TREEVIEW_DELETE_RESET'

export const IMPORT_RULE_DELETE_REQUEST = 'IMPORT_RULE_DELETE_REQUEST'
export const IMPORT_RULE_DELETE_SUCCESS = 'IMPORT_RULE_DELETE_SUCCESS'
export const IMPORT_RULE_DELETE_FAILED = 'IMPORT_RULE_DELETE_FAILED'
export const IMPORT_RULE_DELETE_RESET = 'IMPORT_RULE_DELETE_RESET'

export const IMPORT_RULE_GET_REQUEST = 'IMPORT_RULE_GET_REQUEST'
export const IMPORT_RULE_GET_SUCCESS = 'IMPORT_RULE_GET_SUCCESS'
export const IMPORT_RULE_GET_FAILED = 'IMPORT_RULE_GET_FAILED'
export const IMPORT_RULE_GET_RESET = 'IMPORT_RULE_GET_RESET'

export const IMPORT_UPLOAD_FILES_REQUEST = 'IMPORT_UPLOAD_FILES_REQUEST'
export const IMPORT_UPLOAD_FILES_SUCCESS = 'IMPORT_UPLOAD_FILES_SUCCESS'
export const IMPORT_UPLOAD_FILES_FAILED = 'IMPORT_UPLOAD_FILES_FAILED'
export const IMPORT_UPLOAD_FILES_RESET = 'IMPORT_UPLOAD_FILES_RESET'

export const CloanRepodataPost = (git: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: CLOAN_REPO_POST_REQUEST })
  const tockens: any = {
    token: git?.gittoken ? git?.gittoken : null
  }
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/data/validate-import-dac/${git?.organization}/${git?.repository}`, tockens, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: CLOAN_REPO_POST_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const msg = error?.response?.data?.msg
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: CLOAN_REPO_POST_FAILED, payload: message, msg: msg })
  }
}

export const ImportFolderdataPost = (colldata: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: IMPORT_TREEVIEW_POST_REQUEST })
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/data/imported-source`, colldata, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: IMPORT_TREEVIEW_POST_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: IMPORT_TREEVIEW_POST_FAILED, payload: message })
  }
}

export const ImportTreeViewList = (isDAC: any) => async (dispatch: any, getState: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: IMPORT_TREEVIEW_GET_REQUEST })
  try {
    const { data } = await api.get(`/data/imported-source-tree`, {
      headers: { Authorization: `${token.bearerToken}` },
      params: { isDAC: isDAC }
    })
    return dispatch({ type: IMPORT_TREEVIEW_GET_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: IMPORT_TREEVIEW_GET_FAILED, payload: error.message })
  }
}

export const importedSourceFiles =
  (filedetails: any, importedSourceId: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: IMPORT_UPLOAD_FILES_REQUEST })
    try {
      const { data } = await Axios.post(
        `${environment.baseUrl}/data/imported-source/${importedSourceId}/rule`,
        filedetails,
        {
          headers: { Authorization: `${token.bearerToken}`, 'Content-Type': 'multipart/form-data' },
        },
      )

      return dispatch({
        type: IMPORT_UPLOAD_FILES_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      return dispatch({ type: IMPORT_UPLOAD_FILES_FAILED, payload: message })
    }
  }

export const ImportRuleViewList = (folderid: any, isDAC: any) => async (dispatch: any, getState: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: IMPORT_RULE_GET_REQUEST })
  try {
    const { data } = await api.get(`/data/imported-source/${folderid}/rule`, {
      headers: { Authorization: `${token.bearerToken}` },
      params: { isDAC: isDAC }
    })
    return dispatch({ type: IMPORT_RULE_GET_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: IMPORT_RULE_GET_FAILED, payload: error.message })
  }
}

export const FolderDelete = (importedSourceId: any, isDAC: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: IMPORT_TREEVIEW_DELETE_REQUEST })
  try {
    const { data } = await Axios.delete(
      `${environment.baseUrl}/data/imported-source/${importedSourceId}`,
      {
        headers: { Authorization: `${token.bearerToken}` },
        params: { isDAC: isDAC }
      },
    )
    return dispatch({
      type: IMPORT_TREEVIEW_DELETE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: IMPORT_TREEVIEW_DELETE_FAILED, payload: message })
  }
}

export const importRuleDelete =
  (importedSourceId: any, deleteIds: any, isDAC: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: IMPORT_RULE_DELETE_REQUEST })
    try {
      const { data } = await Axios.post(
        `${environment.baseUrl}/data/imported-source/${importedSourceId}/delete-rule`,
        deleteIds,
        {
          headers: { Authorization: `${token.bearerToken}` },
          params: { isDAC: isDAC }
        },

      )
      return dispatch({
        type: IMPORT_RULE_DELETE_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      dispatch({ type: IMPORT_RULE_DELETE_FAILED, payload: message })
    }
  }



export const documentGetuuid = (uuid: any) => async (dispatch: any, getState: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: DOCUMENT_UUID_GET_REQUEST })
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/data/document-uuids`, uuid, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({ type: DOCUMENT_UUID_GET_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: DOCUMENT_UUID_GET_FAILED, payload: error.message })
  }
}
