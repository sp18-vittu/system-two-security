import Axios from 'axios'
import { environment } from '../../../environment/environment'
import local from '../../../utils/local'
import api from '../api'

export const ADD_FEEDLY_FORM_REQUEST = 'ADD_FEEDLY_FORM_REQUEST'
export const ADD_FEEDLY_FORM_SUCCESS = 'ADD_FEEDLY_FORM_SUCCESS'
export const ADD_FEEDLY_FORM_FAILED = 'ADD_FEEDLY_FORM_FAILED'
export const ADD_FEEDLY_FORM_RESET = 'ADD_FEEDLY_FORM_RESET'

export const GET_FEEDLY_FORM_REQUEST = 'GET_FEEDLY_FORM_REQUEST'
export const GET_FEEDLY_FORM_SUCCESS = 'GET_FEEDLY_FORM_SUCCESS'
export const GET_FEEDLY_FORM_FAILED = 'GET_FEEDLY_FORM_FAILED'
export const GET_FEEDLY_FORM_RESET = 'GRT_FEEDLY_FORM_RESET'

export const UPDATE_FEEDLY_FORM_REQUEST = 'GET_FEEDLY_FORM_REQUEST'
export const UPDATE_FEEDLY_FORM_SUCCESS = 'UPDATE_FEEDLY_FORM_SUCCESS'
export const UPDATE_FEEDLY_FORM_FAILED = 'UPDATE_FEEDLY_FORM_FAILED'
export const UPDATE_FEEDLY_FORM_RESET = 'GRT_FEEDLY_FORM_RESET'

export const FEEDLY_DELETE_REQUEST = 'FEEDLY_DELETE_REQUEST'
export const FEEDLY_DELETE_SUCCESS = 'FEEDLY_DELETE_SUCCESS'
export const FEEDLY_DELETE_FAILED = 'FEEDLY_DELETE_FAILED'
export const FEEDLY_DELETE_RESET = 'FEEDLY_DELETE_RESET'

export const ADD_CTI_FEEDLY_FORM_REQUEST = 'ADD_CTI_FEEDLY_FORM_REQUEST'
export const ADD_CTI_FEEDLY_FORM_SUCCESS = 'ADD_CTI_FEEDLY_FORM_SUCCESS'
export const ADD_CTI_FEEDLY_FORM_FAILED = 'ADD_CTI_FEEDLY_FORM_FAILED'
export const ADD_CTI_FEEDLY_FORM_RESET = 'ADD_CTI_FEEDLY_FORM_RESET'

export const GET_ID_FEEDLY_FORM_REQUEST = 'GET_ID_FEEDLY_FORM_REQUEST'
export const GET_ID_FEEDLY_FORM_SUCCESS = 'GET_ID_FEEDLY_FORM_SUCCESS'
export const GET_ID_FEEDLY_FORM_FAILED = 'GET_ID_FEEDLY_FORM_FAILED'
export const GET_ID_FEEDLY_FORM_RESET = 'GET_ID_FEEDLY_FORM_RESET'

export const GET_FEEDLY_STREAM_FORM_REQUEST = 'GET_FEEDLY_STREAM_FORM_REQUEST'
export const GET_FEEDLY_STREAMF_ORM_SUCCESS = 'GET_FEEDLY_STREAMF_ORM_SUCCESS'
export const GET_FEEDLY_STREAM_FORM_FAILED = 'GET_FEEDLY_STREAM_FORM_FAILED'
export const GET_FEEDLY_STREAM_FORM_RESET = 'GET_FEEDLY_STREAM_FORM_RESET'

export const feedlPost = (feedValue: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/ctiint/feedly-config`,
      feedValue,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({ type: ADD_FEEDLY_FORM_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: ADD_FEEDLY_FORM_FAILED, payload: error.message })
  }
}

export const feedlCtiPost = (feedValue: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/data/ctiint/process-cti`, feedValue, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({ type: ADD_CTI_FEEDLY_FORM_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: ADD_CTI_FEEDLY_FORM_FAILED, payload: error.message })
  }
}

export const feedlyGet = () => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: GET_FEEDLY_FORM_REQUEST })
  try {
    const { data } = await api.get(`/data/ctiint/source-configs`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: GET_FEEDLY_FORM_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: GET_FEEDLY_FORM_FAILED, payload: message })
  }
}

export const feedlyGetId = (id: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: GET_ID_FEEDLY_FORM_REQUEST })
  try {
    const { data } = await api.get(`/data/ctiint/feedly-config/${id}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: GET_ID_FEEDLY_FORM_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: GET_ID_FEEDLY_FORM_FAILED, payload: message })
  }
}

export const feedlyUpdate = (id: any, fileTitle: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: UPDATE_FEEDLY_FORM_REQUEST })
  try {
    const { data } = await Axios.put(
      `${environment.baseUrl}/data/ctiint/feedly-config/${id}`,
      fileTitle,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({
      type: UPDATE_FEEDLY_FORM_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: UPDATE_FEEDLY_FORM_FAILED, payload: message })
  }
}

export const deleteFeedly = (sourceName: any) => async (dispatch: any) => {
  const localStorage1 = local.getItem('bearerToken')
  const token = JSON.parse(localStorage1 as any)
  dispatch({ type: FEEDLY_DELETE_REQUEST })
  try {
    const { data } = await Axios.delete(`${environment.baseUrl}/data/ctiint/feedly/${sourceName}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: FEEDLY_DELETE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: FEEDLY_DELETE_FAILED, payload: message })
  }
}

export const feedlyGetStremeId = (id: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: GET_FEEDLY_STREAM_FORM_REQUEST })
  try {
    const { data } = await api.get(`/data/ctiint/feedly/stream-status/`, {
      params: { streamId: id },
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: GET_FEEDLY_STREAMF_ORM_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: GET_FEEDLY_STREAM_FORM_FAILED, payload: message })
  }
}
