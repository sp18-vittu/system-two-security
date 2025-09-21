import { PROMPT_QUERY_SEND_NEWCHAT, PROMPT_RESPONSE_FAILED_NEWCHAT } from './newchatAction'

const initialState = {
  loading: false,
  errors: {},
  chatnewResults: [],
}

const newChatReducers = (state = initialState, action: { type: string; payload: any }) => {
  switch (action.type) {
    case PROMPT_QUERY_SEND_NEWCHAT:
      return {
        loading: true,
        errors: {},
        chatnewResults: [
          {
            query: action.payload.query,
            response: false,
            dateTime: new Date(),
            documents: [],
          },
          ...state.chatnewResults,
        ],
      }
    case PROMPT_RESPONSE_FAILED_NEWCHAT:
      return {
        ...state,
        loading: false,
        errors: 'Promt failed',
        chatnewResults: [
          {
            query: 'Sorry!!!, \n Network Issue, Failed to connect to prompt server.',
            response: true,
            alert: false,
            warn: false,
            dateTime: new Date(),
            documents: [],
          },
          ...state.chatnewResults,
        ],
      }
    default:
      return state
  }
}

export default newChatReducers
