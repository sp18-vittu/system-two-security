import {
  INSIGHT_CARD_DETAIL_FAILED,
  INSIGHT_CARD_DETAIL_REQUEST,
  INSIGHT_CARD_DETAIL_RESET,
  INSIGHT_CARD_DETAIL_SUCCESS,
} from './action'

const initialState = {
  InsightcardList: [],
  loading: false,
  errors: {},
}

export const insightCardreducer = (state = initialState, action: { type: any; payload: any }) => {
  switch (action.type) {
    case INSIGHT_CARD_DETAIL_SUCCESS:
      return {
        isAuthenticted: true,
        InsightcardList: action.payload,
        loading: false,
        errors: {},
      }
    case INSIGHT_CARD_DETAIL_REQUEST:
    case INSIGHT_CARD_DETAIL_FAILED:
      return {
        isAuthenticted: false,
        InsightcardList: null,
        loading: false,
        errors: {},
      }
    case INSIGHT_CARD_DETAIL_RESET:
      return {}
    default:
      return state
  }
}
