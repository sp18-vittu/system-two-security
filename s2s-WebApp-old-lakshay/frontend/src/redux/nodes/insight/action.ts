import api from '../api'

export const INSIGHT_CARD_DETAIL_REQUEST = 'INSIGHT_CARD_DETAIL_REQUEST'
export const INSIGHT_CARD_DETAIL_SUCCESS = 'INSIGHT_CARD_DETAIL_SUCCESS'
export const INSIGHT_CARD_DETAIL_FAILED = 'INSIGHT_CARD_DETAIL_FAILED'
export const INSIGHT_CARD_DETAIL_RESET = 'INSIGHT_CARD_DETAIL_RESET'

export const insightCardList = (token: any, list: any) => async (dispatch: any, getState: any) => {
  try {
    const { data } = await api.get(`/data/cti-report/insights/${list.urlSHA256}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({ type: INSIGHT_CARD_DETAIL_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: INSIGHT_CARD_DETAIL_FAILED, payload: error.message })
  }
}
