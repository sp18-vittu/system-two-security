import api from '../api'

export const HUNT_RESULT_REQUEST = 'HUNT_RESULT_REQUEST'
export const HUNT_RESULT_SUCCESS = 'HUNT_RESULT_SUCCESS'
export const HUNT_RESULT_FAILED = 'HUNT_RESULT_FAILED'
export const HUNT_RESULT_RESET = 'HUNT_RESULT_RESET'

export const HuntPlaneNodeView =
  (token: any, threatbriefid: any, executionid: any) => async (dispatch: any) => {
    try {
      const { data } = await api.get(
        `/data/v1/huntreport/${threatbriefid}/${executionid}/report-summary`,
        {
          headers: { Authorization: `${token.bearerToken}` },
        },
      )
      return dispatch({ type: HUNT_RESULT_SUCCESS, payload: data })
    } catch (error: any) {
      return dispatch({ type: HUNT_RESULT_FAILED, payload: error.message })
    }
  }
