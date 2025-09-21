import Axios from 'axios'
import { environment } from '../../../environment/environment'
import local from '../../../utils/local'
import api from '../api'

export const THREATBRIEFS_GET_DETAIL_REQUEST = 'THREATBRIEFS_GET_DETAIL_REQUEST'
export const THREATBRIEFS_GET_DETAIL_SUCCESS = 'THREATBRIEFS_GET_DETAIL_SUCCESS'
export const THREATBRIEFS_GET_DETAIL_FAILED = 'THREATBRIEFS_GET_DETAIL_FAILED'
export const THREATBRIEFS_GET_DETAIL_RESET = 'THREATBRIEFS_GET_DETAIL_RESET'

export const HUNT_PLAN_GET_DETAIL_REQUEST = 'HUNT_PLAN_GET_DETAIL_REQUEST'
export const HUNT_PLAN_GET_DETAIL_SUCCESS = 'HUNT_PLAN_GET_DETAIL_SUCCESS'
export const HUNT_PLAN_GET_DETAIL_FAILED = 'HUNT_PLAN_GET_DETAIL_FAILED'
export const HUNT_PLAN_GET_DETAIL_RESET = 'HUNT_PLAN_GET_DETAIL_RESET'

export const EXECUTE_HUNT_POST_REQUEST = 'EXECUTE_HUNT_POST_REQUEST'
export const EXECUTE_HUNT_POST_SUCCESS = 'EXECUTE_HUNT_POST_SUCCESS'
export const EXECUTE_HUNT_POST_FAILED = 'EXECUTE_HUNT_POST_FAILED'
export const EXECUTE_HUNT_POST_RESET = 'EXECUTE_HUNT_POST_RESET'

export const EXECUTE_HUNT_STOP_REQUEST = 'EXECUTE_HUNT_STOP_REQUEST'
export const EXECUTE_HUNT_STOP_SUCCESS = 'EXECUTE_HUNT_STOP_SUCCESS'
export const EXECUTE_HUNT_STOP_FAILED = 'EXECUTE_HUNT_STOP_FAILED'
export const EXECUTE_HUNT_STOP_RESET = 'EXECUTE_HUNT_STOP_RESET'

export const GET_CURRENT_STATE_REQUEST = 'GET_CURRENT_STATE_REQUEST'
export const GET_CURRENT_STATE_SUCCESS = 'GET_CURRENT_STATE_SUCCESS'
export const GET_CURRENT_STATE_FAILED = 'GET_CURRENT_STATE_FAILED'
export const GET_CURRENT_STATE_RESET = 'GET_CURRENT_STATE_RESET'

export const ThreatbriefStatus = (token: any, id: any) => async (dispatch: any, getState: any) => {
  try {
    const { data } = await api.get(`/data/threatbriefs/${id}/get-last-execution`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({ type: THREATBRIEFS_GET_DETAIL_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: THREATBRIEFS_GET_DETAIL_FAILED, payload: error.message })
  }
}

export const HuntPlaneNodeView = (token: any, id: any) => async (dispatch: any, getState: any) => {
  try {
    const { data } = await api.get(`/data/threatbriefs/${id}/get-hunt-plan`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({ type: HUNT_PLAN_GET_DETAIL_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: HUNT_PLAN_GET_DETAIL_FAILED, payload: error.message })
  }
}

export const ExecuteHuntPost = (threatbriefId: any, sourceId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/threatbriefs/${threatbriefId}/execute-hunt/${sourceId}`,
      null,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({ type: EXECUTE_HUNT_POST_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: EXECUTE_HUNT_POST_FAILED, payload: error.message })
  }
}

export const GetCurrentState = (threatbriefId: any, executionId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await api.get(
      `/data/threatbriefs/${threatbriefId}/${executionId}/get-current-state`,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({ type: GET_CURRENT_STATE_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: GET_CURRENT_STATE_FAILED, payload: error.message })
  }
}

export const ExecuteHuntStop = (threatbriefId: any, uuid: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/threatbriefs/${threatbriefId}/${uuid}/abort-hunt`,
      null,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({ type: EXECUTE_HUNT_STOP_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: EXECUTE_HUNT_STOP_FAILED, payload: error.message })
  }
}
