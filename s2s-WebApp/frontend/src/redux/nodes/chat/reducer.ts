import {
  CHAT_CONVERSATION_FAILED,
  CHAT_CONVERSATION_REQUEST,
  CHAT_CONVERSATION_RESET,
  CHAT_CONVERSATION_SUCCESS,
  CHAT_CREATE_FAILED,
  CHAT_CREATE_REQUEST,
  CHAT_CREATE_RESET,
  CHAT_CREATE_SUCCESS,
  CHAT_DELETE_FAILED,
  CHAT_DELETE_REQUEST,
  CHAT_DELETE_RESET,
  CHAT_DELETE_SUCCESS,
  CHAT_DETAIL_FAILED,
  CHAT_DETAIL_REQUEST,
  CHAT_DETAIL_RESET,
  CHAT_DETAIL_SUCCESS,
  CHAT_HISTORY_FAILED,
  CHAT_HISTORY_REQUEST,
  CHAT_HISTORY_RESET,
  CHAT_HISTORY_SUCCESS,
  CHAT_SESSION_HISTORY_FAILED,
  CHAT_SESSION_HISTORY_REQUEST,
  CHAT_SESSION_HISTORY_RESET,
  CHAT_SESSION_HISTORY_SUCCESS,
  CHAT_UPDATE_FAILED,
  CHAT_UPDATE_REQUEST,
  CHAT_UPDATE_RESET,
  CHAT_UPDATE_SUCCESS,
  GET_ADD_SOURCE_FAILED,
  GET_ADD_SOURCE_REQUEST,
  GET_ADD_SOURCE_RESET,
  GET_ADD_SOURCE_SUCCESS,
  GET_CHAT_UPDATE_FAILED,
  GET_CHAT_UPDATE_REQUEST,
  GET_CHAT_UPDATE_RESET,
  GET_CHAT_UPDATE_SUCCESS,
  NEW_CHAT_DETAIL_FAILED,
  NEW_CHAT_DETAIL_REQUEST,
  NEW_CHAT_DETAIL_RESET,
  NEW_CHAT_DETAIL_SUCCESS,
  UPDATE_SOURCE_CHAT_FAILED,
  UPDATE_SOURCE_CHAT_REQUEST,
  UPDATE_SOURCE_CHAT_RESET,
  UPDATE_SOURCE_CHAT_SUCCESS,
} from './action'

const initialState5 = {
  Createchatlist: [],
  loading: false,
  errors: {},
}

export const createchatreducer = (state = initialState5, action: { type: any; payload: any }) => {
  switch (action.type) {
    case CHAT_CREATE_SUCCESS:
      return {
        isAuthenticted: true,
        Createchatlist: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case CHAT_CREATE_REQUEST:
    case CHAT_CREATE_FAILED:
      return {
        isAuthenticted: false,
        Createchatlist: null,
        loading: false,
        errors: {},
      }
    case CHAT_CREATE_RESET:
      return {}
    default:
      return state
  }
}

const initialState = {
  chatDetaillist: [],
  loading: false,
  errors: {},
}

export const chatDetailreducer = (state = initialState, action: { type: any; payload: any }) => {
  switch (action.type) {
    case CHAT_DETAIL_SUCCESS:
      return {
        isAuthenticted: true,
        chatDetaillist: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case CHAT_DETAIL_REQUEST:
    case CHAT_DETAIL_FAILED:
      return {
        isAuthenticted: false,
        chatDetaillist: null,
        loading: false,
        errors: {},
      }
    case CHAT_DETAIL_RESET:
      return {}
    default:
      return state
  }
}

const initialState2 = {
  chatupdateDetail: {},
  loading: false,
  errors: {},
}
export const chatupdatereducer = (state = initialState2, action: { type: any; payload: any }) => {
  switch (action.type) {
    case CHAT_UPDATE_SUCCESS:
      return {
        isAuthenticted: true,
        chatupdateDetail: action.payload,
        success: true,
        loading: false,
        errors: {},
      }
    case CHAT_UPDATE_REQUEST:
    case CHAT_UPDATE_FAILED:
      return {
        isAuthenticted: false,
        chatupdateDetail: null,
        loading: false,
        errors: {},
      }
    case CHAT_UPDATE_RESET:
      return {}
    default:
      return state
  }
}

const initialState3 = {
  addchatupdateDetail: {},
  loading: false,
  errors: {},
}
export const addchatupdatereducer = (
  state = initialState3,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case UPDATE_SOURCE_CHAT_SUCCESS:
      return {
        isAuthenticted: true,
        addchatupdateDetail: action.payload,
        success: true,
        loading: false,
        errors: {},
      }
    case UPDATE_SOURCE_CHAT_REQUEST:
    case UPDATE_SOURCE_CHAT_FAILED:
      return {
        isAuthenticted: false,
        addchatupdateDetail: null,
        loading: false,
        errors: {},
      }
    case UPDATE_SOURCE_CHAT_RESET:
      return {}
    default:
      return state
  }
}

const initialState4 = {
  getAddSourceDetail: {},
  loading: false,
  errors: {},
}
export const getAddSourcereducer = (state = initialState4, action: { type: any; payload: any }) => {
  switch (action.type) {
    case GET_ADD_SOURCE_SUCCESS:
      return {
        isAuthenticted: true,
        getAddSourceDetail: action.payload,
        success: true,
        loading: false,
        errors: {},
      }
    case GET_ADD_SOURCE_REQUEST:
    case GET_ADD_SOURCE_FAILED:
      return {
        isAuthenticted: false,
        getAddSourceDetail: null,
        loading: false,
        errors: {},
      }
    case GET_ADD_SOURCE_RESET:
      return {}
    default:
      return state
  }
}

export const chatUpdatepagereducer = (
  state = initialState4,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case GET_CHAT_UPDATE_SUCCESS:
      return {
        isAuthenticted: true,
        getAddSourceDetail: action.payload,
        success: true,
        loading: false,
        errors: {},
      }
    case GET_CHAT_UPDATE_REQUEST:
    case GET_CHAT_UPDATE_FAILED:
      return {
        isAuthenticted: false,
        getAddSourceDetail: null,
        loading: false,
        errors: {},
      }
    case GET_CHAT_UPDATE_RESET:
      return {}
    default:
      return state
  }
}

export const chatUpdategetreducer = (
  state = initialState4,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case NEW_CHAT_DETAIL_SUCCESS:
      return {
        isAuthenticted: true,
        getAddSourceDetail: action.payload,
        success: true,
        loading: false,
        errors: {},
      }
    case NEW_CHAT_DETAIL_REQUEST:
    case NEW_CHAT_DETAIL_FAILED:
      return {
        isAuthenticted: false,
        getAddSourceDetail: null,
        loading: false,
        errors: {},
      }
    case NEW_CHAT_DETAIL_RESET:
      return {}
    default:
      return state
  }
}

const initialState7 = {
  chatDeletelist: [],
  loading: false,
  errors: {},
}
export const chatDeletereducer = (state = initialState7, action: { type: any; payload: any }) => {
  switch (action.type) {
    case CHAT_DELETE_SUCCESS:
      return {
        isAuthenticted: true,
        chatDetaillist: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case CHAT_DELETE_REQUEST:
    case CHAT_DELETE_FAILED:
      return {
        isAuthenticted: false,
        chatDetaillist: null,
        loading: false,
        errors: {},
      }
    case CHAT_DELETE_RESET:
      return {}
    default:
      return state
  }
}

const initialState8 = {
  chatConversationlist: {},
  loading: false,
  errors: {},
}
export const chatConversationeducer = (
  state = initialState8,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case CHAT_CONVERSATION_REQUEST:
    case CHAT_CONVERSATION_SUCCESS:
      return {
        isAuthenticted: true,
        chatConversationlist: action.payload,
        loading: true,
        success: true,
        errors: {},
      }
    case CHAT_CONVERSATION_FAILED:
      return {
        isAuthenticted: false,
        chatConversationlist: null,
        loading: false,
        errors: {},
      }
    case CHAT_CONVERSATION_RESET:
      return {}
    default:
      return state
  }
}

const initialState9 = {
  chatHistorylist: [],
  loadings: true,
  errors: {},
}
export const chatHistoryreducer = (state = initialState9, action: { type: any; payload: any }) => {
  switch (action.type) {
    case CHAT_HISTORY_REQUEST:
    case CHAT_HISTORY_SUCCESS:
      return {
        isAuthenticted: true,
        chatHistorylist: action.payload,
        loadings: true,
        success: true,
        errors: {},
      }
    case CHAT_HISTORY_FAILED:
      return {
        isAuthenticted: false,
        chatHistorylist: null,
        loadings: false,
        errors: {},
      }
    case CHAT_HISTORY_RESET:
      return {}
    default:
      return state
  }
}

const initialState10 = {
  chatHistorySavelist: {},
  loading: true,
  errors: {},
}
export const chatHistorySavereducer = (
  state = initialState10,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case CHAT_SESSION_HISTORY_REQUEST:
    case CHAT_SESSION_HISTORY_SUCCESS:
      return {
        isAuthenticted: true,
        chatHistorySavelist: action.payload,
        loading: true,
        success: true,
        errors: {},
      }
    case CHAT_SESSION_HISTORY_FAILED:
      return {
        isAuthenticted: false,
        chatHistorySavelist: null,
        loading: false,
        errors: {},
      }
    case CHAT_SESSION_HISTORY_RESET:
      return {}
    default:
      return state
  }
}
