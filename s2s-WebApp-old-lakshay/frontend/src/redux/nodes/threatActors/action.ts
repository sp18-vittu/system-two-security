import { environment } from '../../../environment/environment'
import local from '../../../utils/local'
import Axios from 'axios'
import api from '../api'

export const THREAT_ACTOR_GET_JSON_REQUEST = 'THREAT_ACTOR_GET_JSON_REQUEST'
export const THREAT_ACTOR_GET_JSON_SUCCESS = 'THREAT_ACTOR_GET_JSON_SUCCESS'
export const THREAT_ACTOR_GET_JSON_FAILED = 'THREAT_ACTOR_GET_JSON_FAILED'
export const THREAT_ACTOR_GET_JSON_RESET = 'THREAT_ACTOR_GET_JSON_REST'

export const threatActorsDetails = () => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const tokens = JSON.parse(localStorage as any)
  dispatch({ type: THREAT_ACTOR_GET_JSON_REQUEST })
  try {
    const { data } = await api.get(`/data/threatbriefs-from-inteldb/`, {
      headers: { Authorization: `${tokens.bearerToken}` },
    })
    return dispatch({ type: THREAT_ACTOR_GET_JSON_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: THREAT_ACTOR_GET_JSON_FAILED, payload: error.message })
  }
}

export const threatActorspost = (entity_name: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const tokens = JSON.parse(localStorage as any)
  dispatch({ type: THREAT_ACTOR_GET_JSON_REQUEST })
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/generate-threatbrief/`,
      { threatActorName: entity_name },
      {
        headers: { Authorization: `${tokens.bearerToken}` },
      },
    )
    return dispatch({ type: THREAT_ACTOR_GET_JSON_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: THREAT_ACTOR_GET_JSON_FAILED, payload: error.message })
  }
}
