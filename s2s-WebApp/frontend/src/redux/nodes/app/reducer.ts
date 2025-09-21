import {
  PROMPT_SUCCESS,
  PROMPT_FAILED,
  PROMPT_QUERY_SEND,
  PROMPT_RESPONSE_FAILED,
  PROMPT_RESPONSE_RESET,
} from './actions'

const initialState = {
  loading: false,
  errors: {},
  results: [],
}

const reducer = (state = initialState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case PROMPT_QUERY_SEND:
      return {
        loading: true,
        errors: {},
        results: [
          {
            query: action.payload.query,
            response: false,
            dateTime: new Date(),
            documents: [],
          },
          ...state.results,
        ],
      }
    case PROMPT_SUCCESS:
      return {
        loading: false,
        errors: {},
        results: [
          {
            query: action.payload.response || 'Sorry!, No results found.',
            response: true,
            dateTime: new Date(),
            documents: action.payload.documents,
          },
          ...state.results,
        ],
      }
    case PROMPT_FAILED:
      return {
        ...state,
        loading: false,
        errors: 'Promt failed',
        results: [
          {
            query: '',
            response: true,
            warn: action.payload.warn,
            warning: action.payload.warning,
            reason: action.payload.reason,
            alert: action.payload.alert,
            category: action.payload.category,
            dateTime: new Date(),
            documents: [],
          },
          ...state.results,
        ],
      }
    case PROMPT_RESPONSE_FAILED:
      return {
        ...state,
        loading: false,
        errors: 'Promt failed',
        results: [
          {
            query: 'Sorry!!!, \n Network Issue, Failed to connect to prompt server.',
            response: true,
            alert: false,
            warn: false,
            dateTime: new Date(),
            documents: [],
          },
          ...state.results,
        ],
      }
    case PROMPT_RESPONSE_RESET:
      return {
        loading: false,
        errors: {},
        results: [],
      }
    default:
      return state
  }
}

export default reducer
