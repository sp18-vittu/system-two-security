import Axios from 'axios'
import { environment } from '../../../environment/environment'
import local from '../../../utils/local'
import api from '../api'

export const ADD_SPLUNK_FORM_REQUEST = 'ADD_SPLUNK_FORM_REQUEST'
export const ADD_SPLUNK_FORM_SUCCESS = 'ADD_SPLUNK_FORM_SUCCESS'
export const ADD_SPLUNK_FORM_FAILED = 'ADD_SPLUNK_FORM_FAILED'
export const ADD_SPLUNK_FORM_RESET = 'ADD_SPLUNK_FORM_RESET'

export const GET_SPLUNK_FORM_REQUEST = 'GET_SPLUNK_FORM_REQUEST'
export const GET_SPLUNK_FORM_SUCCESS = 'GET_SPLUNK_FORM_SUCCESS'
export const GET_SPLUNK_FORM_FAILED = 'GET_SPLUNK_FORM_FAILED'
export const GET_SPLUNK_FORM_RESET = 'GET_SPLUNK_FORM_RESET'

export const GET_ID_SPLUNK_FORM_REQUEST = 'GET_ID_SPLUNK_FORM_REQUEST'
export const GET_ID_SPLUNK_FORM_SUCCESS = 'GET_ID_SPLUNK_FORM_SUCCESS'
export const GET_ID_SPLUNK_FORM_FAILED = 'GET_ID_SPLUNK_FORM_FAILED'
export const GET_ID_SPLUNK_FORM_RESET = 'GET_ID_SPLUNK_FORM_RESET'

export const UPDATE_SPLUNK_FORM_REQUEST = 'UPDATE_SPLUNK_FORM_REQUEST'
export const UPDATE_SPLUNK_FORM_SUCCESS = 'UPDATE_SPLUNK_FORM_SUCCESS'
export const UPDATE_SPLUNK_FORM_FAILED = 'UPDATE_SPLUNK_FORM_FAILED'
export const UPDATE_SPLUNK_FORM_RESET = 'UPDATE_SPLUNK_FORM_RESET'

export const SPLUNK_DELETE_REQUEST = 'SPLUNK_DELETE_REQUEST'
export const SPLUNK_DELETE_SUCCESS = 'SPLUNK_DELETE_SUCCESS'
export const SPLUNK_DELETE_FAILED = 'SPLUNK_DELETE_FAILED'
export const SPLUNK_DELETE_RESET = 'SPLUNK_DELETE_RESET'

export const GET_SPLUNK_EXECUTOR_FORM_REQUEST = 'GET_SPLUNK_EXECUTOR_FORM_REQUEST'
export const GET_SPLUNK_EXECUTOR_FORM_SUCCESS = 'GET_SPLUNK_EXECUTOR_FORM_SUCCESS'
export const GET_SPLUNK_EXECUTOR_FORM_FAILED = 'GET_SPLUNK_EXECUTOR_FORM_FAILED'
export const GET_SPLUNK_EXECUTOR_FORM_RESET = 'GET_SPLUNK_EXECUTOR_FORM_RESET'

export const splunkPost = (splunkValue: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/siem/splunk-config`,
      splunkValue,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({ type: ADD_SPLUNK_FORM_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: ADD_SPLUNK_FORM_FAILED, payload: error.message })
  }
}

export const splunkGet = () => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: GET_SPLUNK_FORM_REQUEST })
  try {
    const { data } = await api.get(`/data/siem/splunk-config`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: GET_SPLUNK_FORM_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: GET_SPLUNK_FORM_FAILED, payload: message })
  }
}

export const splunkGetId = (id: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: GET_ID_SPLUNK_FORM_REQUEST })
  try {
    const { data } = await api.get(`/data/siem/splunk-config/${id}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: GET_ID_SPLUNK_FORM_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: GET_ID_SPLUNK_FORM_FAILED, payload: message })
  }
}

export const splunkUpdate = (id: any, fileTitle: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: UPDATE_SPLUNK_FORM_REQUEST })
  try {
    const { data } = await Axios.put(
      `${environment.baseUrl}/data/siem/splunk-config/${id}`,
      fileTitle,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({
      type: UPDATE_SPLUNK_FORM_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: UPDATE_SPLUNK_FORM_FAILED, payload: message })
  }
}

export const deleteSplunk = (id: any) => async (dispatch: any) => {
  const localStorage1 = local.getItem('bearerToken')
  const token = JSON.parse(localStorage1 as any)
  dispatch({ type: SPLUNK_DELETE_REQUEST })
  try {
    const { data } = await Axios.delete(`${environment.baseUrl}/data/siem/splunk/${id}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: SPLUNK_DELETE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: SPLUNK_DELETE_FAILED, payload: message })
  }
}

export const splunkExecutor = (target: any, query: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: GET_SPLUNK_EXECUTOR_FORM_REQUEST })
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/siem/splunk/execute-query`,
      { query: query },
      {
        params: { target: target },
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({
      type: GET_SPLUNK_EXECUTOR_FORM_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: GET_SPLUNK_EXECUTOR_FORM_FAILED, payload: message })
  }
}
