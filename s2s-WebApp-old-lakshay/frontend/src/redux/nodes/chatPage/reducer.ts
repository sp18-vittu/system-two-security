import {
  CHAT_HISTORYS_FAILED,
  CHAT_HISTORYS_REQUEST,
  CHAT_HISTORYS_RESET,
  CHAT_HISTORYS_SUCCESS,
  CREATE_CHAT_FAILED,
  CREATE_CHAT_REQUEST,
  CREATE_CHAT_RESET,
  CREATE_CHAT_SUCCESS,
} from './action'

const initialState1 = {
  createChat: [],
  loading: false,
  errors: {},
}
export const createChatReducer = (state = initialState1, action: { type: any; payload: any }) => {
  switch (action.type) {
    case CREATE_CHAT_SUCCESS:
      return {
        isAuthenticted: true,
        createChat: action.payload,
        loading: false,
        errors: {},
      }
    case CREATE_CHAT_REQUEST:
    case CREATE_CHAT_FAILED:
      return {
        isAuthenticted: false,
        createChat: null,
        loading: false,
        errors: {},
      }
    case CREATE_CHAT_RESET:
      return {}
    default:
      return state
  }
}

const initialState9 = {
  ChatHistory: [],
  loadings: true,
  errors: {},
}
export const chatHistorysreducer = (state = initialState9, action: { type: any; payload: any }) => {
  switch (action.type) {
    case CHAT_HISTORYS_REQUEST:
    case CHAT_HISTORYS_SUCCESS:
      return {
        isAuthenticted: true,
        ChatHistory: action.payload,
        loadings: true,
        success: true,
        errors: {},
      }
    case CHAT_HISTORYS_FAILED:
      return {
        isAuthenticted: false,
        ChatHistory: null,
        loadings: false,
        errors: {},
      }
    case CHAT_HISTORYS_RESET:
      return {}
    default:
      return state
  }
}
