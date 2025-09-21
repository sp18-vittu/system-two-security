import {
  PROMPT_QUERY_FAILED_CHAT,
  PROMPT_QUERY_SEND_CHAT,
  PROMPT_QUERY_SEND_CHATONE,
  PROMPT_RESPONSE_FAILED_CHATONE,
} from './chatAction'

const initialState = {
  loading: false,
  errors: {},
  chatResults: [],
}

const chatNameState = {
  loading: false,
  errors: {},
  chatNameResults: '',
}

export const reducer = (state = initialState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case PROMPT_QUERY_SEND_CHATONE:
      return {
        loading: true,
        errors: {},
        chatResults: [
          {
            query: action.payload.query,
            response: false,
            dateTime: new Date(),
            documents: [],
          },
          ...state.chatResults,
        ],
      }
    case PROMPT_RESPONSE_FAILED_CHATONE:
      return {
        ...state,
        loading: false,
        errors: 'Promt failed',
        chatResults: [
          {
            query: 'Sorry!!!, \n Network Issue, Failed to connect to prompt server.',
            response: true,
            alert: false,
            warn: false,
            dateTime: new Date(),
            documents: [],
          },
          ...state.chatResults,
        ],
      }
    default:
      return state
  }
}

export const chatnameReducer = (state = chatNameState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case PROMPT_QUERY_SEND_CHAT:
      return {
        loading: true,
        errors: {},
        chatResults: [
          {
            data: action.payload.data,
            response: false,
            dateTime: new Date(),
            documents: [],
          },
          ...state.chatNameResults,
        ],
      }
    case PROMPT_QUERY_FAILED_CHAT:
      return {
        ...state,
        loading: false,
        errors: 'Promt failed',
        chatResults: [
          {
            data: 'Sorry!!!, \n Network Issue, Failed to connect to prompt server.',
            response: true,
            alert: false,
            warn: false,
            dateTime: new Date(),
            documents: [],
          },
          ...state.chatNameResults,
        ],
      }
    default:
      return state
  }
}
export default reducer
