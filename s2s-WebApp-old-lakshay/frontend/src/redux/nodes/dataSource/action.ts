import Axios from 'axios'
import local from '../../../utils/local'
import { environment } from '../../../environment/environment'
import api from '../api'

export const DATASOURCE_POST_REQUEST = 'DATASOURCE_POST_REQUEST'
export const DATASOURCE_POST_SUCCESS = 'DATASOURCE_POST_SUCCESS'
export const DATASOURCE_POST_FAILED = 'DATASOURCE_POST_FAILED'
export const DATASOURCE_POST_RESET = 'DATASOURCE_POST_RESET'

export const DATASOURCE_DOWNLOAD_TEMPLATE_REQUEST = 'DATASOURCE_DOWNLOAD_TEMPLATE_REQUEST'
export const DATASOURCE_DOWNLOAD_TEMPLATE_SUCCESS = 'DATASOURCE_DOWNLOAD_TEMPLATE_SUCCESS'
export const DATASOURCE_DOWNLOAD_TEMPLATE_FAILED = 'DATASOURCE_DOWNLOAD_TEMPLATE_FAILED'
export const DATASOURCE_DOWNLOAD_TEMPLATE_RESET = 'DATASOURCE_DOWNLOAD_TEMPLATE_RESET'

export const CURRENT_CONFIG_GET_REQUEST = 'CURRENT_CONFIG_GET_REQUEST'
export const CURRENT_CONFIG_GET_SUCCESS = 'CURRENT_CONFIG_GET_SUCCESS'
export const CURRENT_CONFIG_GET_FAILED = 'CURRENT_CONFIG_GET_FAILED'
export const CURRENT_CONFIG_GET_RESET = 'CURRENT_CONFIG_GET_RESET'

export const DATASOURCE_ADD_SOURCE_REQUEST = 'DATASOURCE_ADD_SOURCE_REQUEST'
export const DATASOURCE_ADD_SOURCE_SUCCESS = 'DATASOURCE_ADD_SOURCE_SUCCESS'
export const DATASOURCE_ADD_SOURCE_FAILED = 'DATASOURCE_ADD_SOURCE_FAILED'
export const DATASOURCE_ADD_SOURCE_RESET = 'DATASOURCE_ADD_SOURCE_RESET'

export const DATASOURCE_PUT_REQUEST = 'DATASOURCE_PUT_REQUEST'
export const DATASOURCE_PUT_SUCCESS = 'DATASOURCE_PUT_SUCCESS'
export const DATASOURCE_PUT_FAILED = 'DATASOURCE_PUT_FAILED'
export const DATASOURCE_PUT_RESET = 'DATASOURCE_PUT_RESET'

export const DATASOURCE_DELETE_REQUEST = 'DATASOURCE_DELETE_REQUEST'
export const DATASOURCE_DELETE_SUCCESS = 'DATASOURCE_DELETE_SUCCESS'
export const DATASOURCE_DELETE_FAILED = 'DATASOURCE_DELETE_FAILED'
export const DATASOURCE_DELETE_RESET = 'DATASOURCE_DELETE_RESET'

export const DatasourcePost = (postValue: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/datasource/upload-csv`,
      postValue,
      {
        headers: { Authorization: `${token.bearerToken}`, 'Content-Type': 'multipart/form-data' },
      },
    )
    return dispatch({ type: DATASOURCE_POST_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: DATASOURCE_POST_FAILED, payload: error.message })
  }
}

export const downloadtemplate = () => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await api.get(`/data/datasource/download-template`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({ type: DATASOURCE_DOWNLOAD_TEMPLATE_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: DATASOURCE_DOWNLOAD_TEMPLATE_FAILED, payload: error.message })
  }
}

export const currentConfig = () => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await api.get(`/data/datasource/current-config`, {
      headers: { Authorization: `${token.bearerToken}` },
    })

    return dispatch({ type: CURRENT_CONFIG_GET_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: CURRENT_CONFIG_GET_FAILED, payload: error.message })
  }
}

export const DatasourceAddSource = (datavalue: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: DATASOURCE_ADD_SOURCE_REQUEST })
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/datasource/add-source`,
      datavalue,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({ type: DATASOURCE_ADD_SOURCE_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: DATASOURCE_ADD_SOURCE_FAILED, payload: error.message })
  }
}

export const DatasourceUpdate = (datavalue: any, id: any) => async (dispatch: any) => {
  console.log('/data/datasource/')

  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await Axios.put(`${environment.baseUrl}/data/datasource/${id}`, datavalue, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({ type: DATASOURCE_PUT_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: DATASOURCE_PUT_FAILED, payload: error.message })
  }
}

export const DatasourceDelete = (sourceid: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await Axios.delete(`${environment.baseUrl}/data/datasource/${sourceid}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({ type: DATASOURCE_DELETE_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: DATASOURCE_DELETE_FAILED, payload: error.message })
  }
}
