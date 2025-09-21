import Axios from 'axios'
import local from '../../../utils/local'
import { environment } from '../../../environment/environment'
import api from '../api'

export const CREATE_NEW_DATAVALUT_REQUEST = 'CREATE_NEW_DATAVALUT_REQUEST'
export const CREATE_NEW_DATAVALUT_SUCCESS = 'CREATE_NEW_DATAVALUT_SUCCESS'
export const CREATE_NEW_DATAVALUT_FAILED = 'CREATE_NEW_DATAVALUT_FAILED'
export const CREATE_NEW_DATAVALUT_RESET = 'CREATE_NEW_DATAVALUT_RESET'

export const DATAVAULT_DETAIL_REQUEST = 'DATAVAULT_DETAIL_REQUEST'
export const DATAVAULT_DETAIL_SUCCESS = 'DATAVAULT_DETAIL_SUCCESS'
export const DATAVAULT_DETAIL_FAILED = 'DATAVAULT_DETAIL_FAILED'
export const DATAVAULT_DETAIL_RESET = 'DATAVAULT_DETAIL_RESET'

export const DATAVAULT_DELETE_REQUEST = ' DATAVAULT_DELETE_REQUEST'
export const DATAVAULT_DELETE_SUCCESS = 'DATAVAULT_DELETE_SUCCESS'
export const DATAVAULT_DELETE_FAILED = 'DATAVAULT_DELETE_FAILED'
export const DATAVAULT_DELETE_RESET = 'DATAVAULT_DELETE_RESET'

export const DATAVAULT_UPDATE_REQUEST = ' DATAVAULT_UPDATE_REQUEST'
export const DATAVAULT_UPDATE_SUCCESS = 'DATAVAULT_UPDATE_SUCCESS'
export const DATAVAULT_UPDATE_FAILED = 'DATAVAULT_UPDATE_FAILED'
export const DATAVAULT_UPDATE_RESET = 'DATAVAULT_UPDATE_RESET'

export const CREATE_NEW_DATAINGESTION_REQUEST = 'CREATE_NEW_DATAINGESTION_REQUEST'
export const CREATE_NEW_DATAINGESTION_SUCCESS = 'CREATE_NEW_DATAINGESTION_SUCCESS'
export const CREATE_NEW_DATAINGESTION_FAILED = 'CREATE_NEW_DATAINGESTION_FAILED'
export const CREATE_NEW_DATAINGESTION_RESET = 'CREATE_NEW_DATAINGESTION_RESET'

export const PDF_UPLOAD_REQUEST = 'PDF_UPLOAD_REQUEST'
export const PDF_UPLOAD_SUCCESS = 'PDF_UPLOAD_SUCCESS'
export const PDF_UPLOAD_FAILED = 'PDF_UPLOAD_FAILED'
export const PDF_UPLOAD_RESET = 'PDF_UPLOAD_RESET'

export const DATAVAULT_ID_REQUEST = ' DATAVAULT_ID_REQUEST'
export const DATAVAULT_ID_SUCCESS = 'DATAVAULT_ID_SUCCESS'
export const DATAVAULT_ID_FAILED = 'DATAVAULT_ID_FAILED'
export const DATAVAULT_ID_RESET = 'DATAVAULT_ID_RESET'

export const DATAVAULT_INDIVIDUAL_ID_REQUEST = ' DATAVAULT_INDIVIDUAL_ID_REQUEST'
export const DATAVAULT_INDIVIDUAL_ID_SUCCESS = 'DATAVAULT_INDIVIDUAL_ID_SUCCESS'
export const DATAVAULT_INDIVIDUAL_ID_FAILED = 'DATAVAULT_INDIVIDUAL_ID_FAILED'
export const DATAVAULT_INDIVIDUAL_ID_RESET = 'DATAVAULT_INDIVIDUAL_ID_RESET'

export const DATAVAULT_DATAINGESTIONURL_REQUEST = 'DATAVAULT_DATAINGESTIONURL_REQUEST'
export const DATAVAULT_DATAINGESTIONURL_SUCCESS = 'DATAVAULT_DATAINGESTIONURL_SUCCESS'
export const DATAVAULT_DATAINGESTIONURL_FAILED = 'DATAVAULT_DATAINGESTIONURL_FAILED'
export const DATAVAULT_DATAINGESTIONURL_RESET = 'DATAVAULT_DATAINGESTIONURL_RESET'

export const CREATE_NEW_VAULT_REQUEST = ' CREATE_NEW_VAULT_REQUEST'
export const CREATE_NEW_VAULT_SUCCESS = 'CREATE_NEW_VAULT_SUCCESS'
export const CREATE_NEW_VAULT_FAILED = 'CREATE_NEW_VAULT_FAILED'
export const CREATE_NEW_VAULT_RESET = 'CREATE_NEW_VAULT_RESET'

const localStorage = local.getItem('bearerToken')

export const Newdatavalut = (Createvalut: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: CREATE_NEW_DATAVALUT_REQUEST })
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/data/datavault`, Createvalut, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: CREATE_NEW_DATAVALUT_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: CREATE_NEW_DATAVALUT_FAILED, payload: message })
  }
}

export const dataingestionUrl = (Createvalut: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: DATAVAULT_DATAINGESTIONURL_REQUEST })
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/upload-cti-report?datavaultId=${Createvalut.id}&url=${
        Createvalut.e.url
      }&ctiName=${Createvalut.e.ctiName}&version=${'v2'}`,
      Createvalut,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({
      type: DATAVAULT_DATAINGESTIONURL_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: DATAVAULT_DATAINGESTIONURL_FAILED, payload: message })
  }
}

export const updateDatavault = (Updatevalut: any, vaultId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: DATAVAULT_UPDATE_REQUEST })
  try {
    const { data } = await Axios.put(
      `${environment.baseUrl}/data/datavault/${vaultId}`,
      Updatevalut,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({
      type: DATAVAULT_UPDATE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: DATAVAULT_UPDATE_FAILED, payload: message })
  }
}

export const dataVaultList = (token: any) => async (dispatch: any, getState: any) => {
  try {
    const { data } = await api.get(`/data/datavaults`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({ type: DATAVAULT_DETAIL_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: DATAVAULT_DETAIL_FAILED, payload: error.message })
  }
}

export const dataVaultuserIdList =
  (token: any, userId: any) => async (dispatch: any, getState: any) => {
    try {
      const { data } = await api.get(`/data/datavaults/${userId}`, {
        headers: { Authorization: `${token.bearerToken}` },
      })

      return dispatch({ type: DATAVAULT_ID_SUCCESS, payload: data })
    } catch (error: any) {
      return dispatch({ type: DATAVAULT_ID_FAILED, payload: error.message })
    }
  }

export const deleteDataVault = (ValutId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: DATAVAULT_DELETE_REQUEST })
  try {
    const { data } = await Axios.delete(`${environment.baseUrl}/data/datavault/${ValutId}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: DATAVAULT_DELETE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: DATAVAULT_DELETE_FAILED, payload: message })
  }
}

export const dataIngestion = (datavalut: any, repotIds: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: CREATE_NEW_DATAINGESTION_REQUEST })
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/data/document`, datavalut, {
      params: { datavaultId: repotIds.datavaultId, ctiId: repotIds.ctiId },
      headers: { Authorization: `${token.bearerToken}`, 'Content-Type': 'multipart/form-data' },
    })

    return dispatch({
      type: CREATE_NEW_DATAINGESTION_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: CREATE_NEW_DATAINGESTION_FAILED, payload: message })
  }
}

export const datavalutPdfUpload = (datavalut: any, filedetails: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: PDF_UPLOAD_REQUEST })
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/upload-cti-report-pdf`,
      filedetails,
      {
        params: { datavaultId: datavalut?.datavaultId, ctiName: datavalut?.ctiName },
        headers: { Authorization: `${token.bearerToken}`, 'Content-Type': 'multipart/form-data' },
      },
    )

    return dispatch({
      type: PDF_UPLOAD_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: PDF_UPLOAD_FAILED, payload: message })
  }
}

export const vaultUserCreate = (valutUsers: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: CREATE_NEW_VAULT_REQUEST })
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/datavault-access/addUsers`,
      valutUsers,
      {
        headers: {
          Authorization: `${token.bearerToken}`,
        },
      },
    )
    dispatch({
      type: CREATE_NEW_VAULT_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: CREATE_NEW_VAULT_FAILED, payload: message })
  }
}

export const dataVaultid = (id: any, dataVault: any, token: any) => async (dispatch: any) => {
  dispatch({ type: DATAVAULT_INDIVIDUAL_ID_REQUEST })
  try {
    const { data } = await api.get(`/data/datavault/${id}`, {
      headers: { Authorization: `${token.bearerToken}` },
      params: { global: dataVault?.global },
    })

    return dispatch({
      type: DATAVAULT_INDIVIDUAL_ID_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: DATAVAULT_INDIVIDUAL_ID_FAILED, payload: message })
  }
}
