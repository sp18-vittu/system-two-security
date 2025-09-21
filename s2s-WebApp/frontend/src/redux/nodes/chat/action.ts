import Axios from 'axios'
import local from '../../../utils/local'
import { environment } from '../../../environment/environment'
import { eventBus } from '../../../pages/history/Chatpage'
import api from '../api'

export const CHAT_CREATE_REQUEST = 'CHAT_CREATE_REQUEST'
export const CHAT_CREATE_SUCCESS = 'CHAT_CREATE_SUCCESS'
export const CHAT_CREATE_FAILED = 'CHAT_CREATE_FAILED'
export const CHAT_CREATE_RESET = 'CHAT_CREATE_RESET'

export const CHAT_ADD_REQUEST = 'CHAT_ADD_REQUEST'
export const CHAT_ADD_SUCCESS = 'CHAT_ADD_SUCCESS'
export const CHAT_ADD_FAILED = 'CHAT_ADD_FAILED'
export const CHAT_ADD_RESET = 'CHAT_ADD_RESET'

export const CHAT_DETAIL_REQUEST = 'CHAT_DETAIL_REQUEST'
export const CHAT_DETAIL_SUCCESS = 'CHAT_DETAIL_SUCCESS'
export const CHAT_DETAIL_FAILED = 'CHAT_DETAIL_FAILED'
export const CHAT_DETAIL_RESET = 'CHAT_DETAIL_RESET'

export const CHAT_DELETE_REQUEST = 'CHAT_DELETE_REQUEST'
export const CHAT_DELETE_SUCCESS = 'CHAT_DELETE_SUCCESS'
export const CHAT_DELETE_FAILED = 'CHAT_DELETE_FAILED'
export const CHAT_DELETE_RESET = 'CHAT_DELETE_RESET'

export const NEW_CHAT_DETAIL_REQUEST = 'NEW_CHAT_DETAIL_REQUEST'
export const NEW_CHAT_DETAIL_SUCCESS = 'NEW_CHAT_DETAIL_SUCCESS'
export const NEW_CHAT_DETAIL_FAILED = 'NEW_CHAT_DETAIL_FAILED'
export const NEW_CHAT_DETAIL_RESET = 'NEW_CHAT_DETAIL_RESET'

export const CHAT_UPDATE_REQUEST = 'CHAT_UPDATE_REQUEST'
export const CHAT_UPDATE_SUCCESS = 'CHAT_UPDATE_SUCCESS'
export const CHAT_UPDATE_FAILED = 'CHAT_UPDATE_FAILED'
export const CHAT_UPDATE_RESET = 'CHAT_UPDATE_RESET'

export const ADD_SOURCE_CHAT_REQUEST = 'ADD_SOURCE_CHAT_REQUEST'
export const ADD_SOURCE_CHAT_SUCCESS = 'ADD_SOURCE_CHAT_SUCCESS'
export const ADD_SOURCE_CHAT_FAILED = 'ADD_SOURCE_CHAT_FAILED'
export const ADD_SOURCE_CHAT_RESET = 'ADD_SOURCE_CHAT_RESET'

export const UPDATE_SOURCE_CHAT_REQUEST = 'UPDATE_SOURCE_CHAT_REQUEST'
export const UPDATE_SOURCE_CHAT_SUCCESS = 'UPDATE_SOURCE_CHAT_SUCCESS'
export const UPDATE_SOURCE_CHAT_FAILED = 'UPDATE_SOURCE_CHAT_FAILED'
export const UPDATE_SOURCE_CHAT_RESET = 'UPDATE_SOURCE_CHAT_RESET'

export const GET_ADD_SOURCE_REQUEST = 'UPDATE_ADD_SOURCE_REQUEST'
export const GET_ADD_SOURCE_SUCCESS = 'UPDATE_ADD_SOURCE_SUCCESS'
export const GET_ADD_SOURCE_FAILED = 'UPDATE_ADD_SOURCE_FAILED'
export const GET_ADD_SOURCE_RESET = 'UPDATE_ADD_SOURCE_RESET'

export const GET_CHAT_UPDATE_REQUEST = 'GET_CHAT_UPDATE_REQUEST'
export const GET_CHAT_UPDATE_SUCCESS = 'GET_CHAT_UPDATE_SUCCESS'
export const GET_CHAT_UPDATE_FAILED = 'GET_CHAT_UPDATE_FAILED'
export const GET_CHAT_UPDATE_RESET = 'GET_CHAT_UPDATE_RESET'

export const CHAT_CONVERSATION_REQUEST = 'CHAT_CONVERSATION_REQUEST'
export const CHAT_CONVERSATION_SUCCESS = 'CHAT_CONVERSATION_SUCCESS'
export const CHAT_CONVERSATION_FAILED = 'CHAT_CONVERSATION_FAILED'
export const CHAT_CONVERSATION_RESET = 'CHAT_CONVERSATION_RESET'

export const CHAT_SESSION_HISTORY_REQUEST = 'CHAT_SESSION_HISTORY_REQUEST'
export const CHAT_SESSION_HISTORY_SUCCESS = 'CHAT_SESSION_HISTORY_SUCCESS'
export const CHAT_SESSION_HISTORY_FAILED = 'CHAT_SESSION_HISTORY_FAILED'
export const CHAT_SESSION_HISTORY_RESET = 'CHAT_SESSION_HISTORY_RESET'

export const CHAT_HISTORY_REQUEST = 'CHAT_HISTORY_REQUEST'
export const CHAT_HISTORY_SUCCESS = 'CHAT_HISTORY_SUCCESS'
export const CHAT_HISTORY_FAILED = 'CHAT_HISTORY_FAILED'
export const CHAT_HISTORY_RESET = 'CHAT_HISTORY_RESET'

export const UPDATE_CHAT_SESSION_REQUEST = 'UPDATE_CHAT_SESSION_REQUEST'
export const UPDATE_CHAT_SESSION_SUCCESS = 'UPDATE_CHAT_SESSION_SUCCESS'
export const UPDATE_CHAT_SESSION_FAILED = 'UPDATE_CHAT_SESSION_FAILED'
export const UPDATE_CHAT_SESSION_RESET = 'UPDATE_CHAT_SESSION_RESET'

export const CHAT_HISTORY_GET_REQUEST = 'CHAT_HISTORY_GET_REQUEST'
export const CHAT_HISTORY_GET_SUCCESS = 'CHAT_HISTORY_GET_SUCCESS'
export const CHAT_HISTORY_GET_FAILED = 'CHAT_HISTORY_GET_FAILED'
export const CHAT_HISTORY_GET_RESET = 'CHAT_HISTORY_GET_REST'

export const CHAT_HISTORY_GET_JSON_REQUEST = 'CHAT_HISTORY_GET_JSON_REQUEST'
export const CHAT_HISTORY_GET_JSON_SUCCESS = 'CHAT_HISTORY_GET_JSON_SUCCESS'
export const CHAT_HISTORY_GET_JSON_FAILED = 'CHAT_HISTORY_GET_JSON_FAILED'
export const CHAT_HISTORY_GET_JSON_RESET = 'CHAT_HISTORY_GET_JSON_REST'

export const CHAT_HISTORY_FIND_ONE_REQUEST = 'CHAT_HISTORY_FIND_ONE_REQUEST'
export const CHAT_HISTORY_FIND_ONE_SUCCESS = 'CHAT_HISTORY_FIND_ONE_SUCCESS'
export const CHAT_HISTORY_FIND_ONE_FAILED = 'CHAT_HISTORY_FIND_ONE_FAILED'
export const CHAT_HISTORY_FIND_ONE_RESET = 'CHAT_HISTORY_FIND_ONE_REST'

export const createchat = (Newchat: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  const chatUser = local.getItem('auth')
  const sessionUser = JSON.parse(chatUser as any)
  const user_ID = sessionUser?.user?.user?.id

  dispatch({ type: CHAT_CREATE_REQUEST })
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/data/chat`, Newchat, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    sessionStorage.setItem('chatid', data?.id)
    if (data?.id) {
      dispatch(chatSideList(token, user_ID))
      sessionStorage.removeItem('sessionVault')
    }
    dispatch({
      type: CHAT_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: CHAT_CREATE_FAILED, payload: message })
  }
}

export const getAddSourceId =
  (token: any, addSourceId: any) => async (dispatch: any, getState: any) => {
    try {
      const { data } = await api.get(`/data/chat/${addSourceId}`, {
        headers: { Authorization: `${token.bearerToken}` },
      })

      if (data) {
        eventBus.dispatchEvent(new CustomEvent('getSessionId', { detail: data }))
      }

      dispatch({ type: GET_ADD_SOURCE_SUCCESS, payload: data })
    } catch (error: any) {
      dispatch({ type: GET_ADD_SOURCE_FAILED, payload: error.message })
    }
  }

export const createAddChat = (AddSourcechat: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: ADD_SOURCE_CHAT_REQUEST })
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/data/chat/addSource`, AddSourcechat, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    dispatch({
      type: ADD_SOURCE_CHAT_SUCCESS,
      payload: data,
    })
    sessionStorage.removeItem('sessionVault')
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: ADD_SOURCE_CHAT_FAILED, payload: message })
  }
}

export const addChat = (Newchat: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: CHAT_ADD_REQUEST })
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/data/chat/addSource`, Newchat, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    dispatch({
      type: CHAT_ADD_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: CHAT_ADD_FAILED, payload: message })
  }
}

export const updateAddSource =
  (UpdatedataVaultChat: any, SessionId: any) => async (dispatch: any, getState: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: UPDATE_SOURCE_CHAT_REQUEST })
    try {
      const { data } = await Axios.put(
        `${environment.baseUrl}/data/chat/addsource/${SessionId}`,
        UpdatedataVaultChat,
        {
          headers: { Authorization: `${token.bearerToken}` },
        },
      )
      if (data.id) {
        dispatch(getAddSourceId(token, data.id) as any)
      }
      sessionStorage.removeItem('sessionVault')
      dispatch({
        type: UPDATE_SOURCE_CHAT_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      dispatch({ type: UPDATE_SOURCE_CHAT_FAILED, payload: message })
    }
  }

export const updatechat =
  (SessionId: any, updatechat: any) => async (dispatch: any, getState: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: CHAT_UPDATE_REQUEST })
    try {
      const { data } = await Axios.put(
        `${environment.baseUrl}/data/chat/${SessionId}`,
        updatechat,
        {
          headers: { Authorization: `${token.bearerToken}` },
        },
      )
      dispatch({
        type: CHAT_UPDATE_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      dispatch({ type: CHAT_CREATE_FAILED, payload: message })
    }
  }

export const chatSideList = (token: any, userID: any) => async (dispatch: any, getState: any) => {
  try {
    const { data } = await api.get(`/data/chats?ruleId=${userID}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({ type: CHAT_DETAIL_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: CHAT_DETAIL_FAILED, payload: error.message })
  }
}

export const updateDataVaultAddChat =
  (UpdatedataVaultChat: any, SessionId: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: GET_CHAT_UPDATE_REQUEST })
    try {
      const { data } = await Axios.put(
        `${environment.baseUrl}/data/chat/${SessionId}`,
        UpdatedataVaultChat,
        {
          headers: { Authorization: `${token.bearerToken}` },
        },
      )
      dispatch({
        type: GET_CHAT_UPDATE_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      dispatch({ type: GET_CHAT_UPDATE_FAILED, payload: message })
    }
  }

export const createNewupdateChat =
  (Newchat: any, SessionId: any, component: any) => async (dispatch: any) => {
    const chatUser = local.getItem('auth')
    const sessionUser = JSON.parse(chatUser as any)
    const user_ID = sessionUser?.user?.user?.id

    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: GET_CHAT_UPDATE_REQUEST })
    try {
      const { data } = await Axios.put(
        `${environment.baseUrl}/data/chat/${SessionId}`,
        {},
        {
          params: {
            sessionName: Newchat.sessionName,
            globalVault: 'false',
          },
          headers: { Authorization: `${token.bearerToken}` },
        },
      )

      return dispatch({
        type: GET_CHAT_UPDATE_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      dispatch({ type: GET_CHAT_UPDATE_FAILED, payload: message })
    }
  }

export const DeleteChat = (SessionId: any) => async (dispatch: any) => {
  const localStorage1 = local.getItem('bearerToken')
  const token = JSON.parse(localStorage1 as any)
  dispatch({ type: CHAT_DELETE_REQUEST })
  try {
    const { data } = await Axios.delete(`${environment.baseUrl}/data/chat/${SessionId}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    localStorage.removeItem('prompthistory')
    return dispatch({
      type: CHAT_DELETE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: CHAT_DELETE_FAILED, payload: message })
  }
}

export const chatSession = (conversation: any, id: any) => async (dispatch: any, getState: any) => {
  const exist_array = localStorage?.getItem('prompthistory')
    ? JSON.parse(localStorage.getItem('prompthistory') as any)
    : null
  try {
    const result = await Axios.post(`${environment.baseUrl}/rag/api/prompt`, conversation)
    let object = {
      prompt: conversation.prompt,
      response: result.data.response,
      responseId: result.data.response_id,
      liked: false,
      disliked: false,
    }
    sessionStorage.removeItem('promptSource')
    if (exist_array?.length > 0) {
      localStorage.setItem('prompthistory', JSON.stringify([...exist_array, object]))
    } else {
      localStorage.setItem('prompthistory', JSON.stringify([object]))
    }

    dispatch({ type: CHAT_CONVERSATION_SUCCESS, payload: result.data })
  } catch (error: any) {
    let object = {
      prompt: conversation.prompt,
      response: null,
      responseId: '3_2023-11-28T13:53:47.5609',
      liked: false,
      disliked: false,
    }
    sessionStorage.removeItem('promptSource')
    if (exist_array?.length > 0) {
      localStorage.setItem('prompthistory', JSON.stringify([...exist_array, object]))
    } else {
      localStorage.setItem('prompthistory', JSON.stringify([object]))
    }

    dispatch({ type: CHAT_CONVERSATION_FAILED, payload: error.message })
  }
}

export const chatSessionHistoryPost =
  (chatSessionHistory: any) => async (dispatch: any, getState: any) => {
    const localStorage1 = local.getItem('bearerToken')
    const token = JSON.parse(localStorage1 as any)
    dispatch({ type: CHAT_SESSION_HISTORY_REQUEST })
    try {
      const result = await Axios.post(
        `${environment.baseUrl}/data/chat/history`,
        chatSessionHistory,
        {
          headers: { Authorization: `${token.bearerToken}` },
        },
      )
      localStorage.removeItem('prompthistory')
      dispatch({ type: CHAT_SESSION_HISTORY_SUCCESS, payload: result.data })
    } catch (error: any) {
      dispatch({ type: CHAT_SESSION_HISTORY_FAILED, payload: error.message })
    }
  }

export const ChatHistoryList = (token: any, id: any) => async (dispatch: any, getState: any) => {
  const tenantDto = local.getItem('auth')
  const tenantd = JSON.parse(tenantDto as any)
  const tenant = tenantd?.user?.user
  const email = tenant?.email

  dispatch({
    type: CHAT_HISTORY_REQUEST,
  })
  try {
    const { data } = await api.get(`/data/chat/history/${email}/session?sessionId=${id}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })

    dispatch({ type: CHAT_HISTORY_SUCCESS, payload: data })
  } catch (error: any) {
    dispatch({ type: CHAT_HISTORY_FAILED, payload: error.message })
  }
}

export const UpdateSessionSourceValue =
  (sessionValueUpdate: any, id: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: UPDATE_CHAT_SESSION_REQUEST })
    try {
      const { data } = await Axios.put(
        `${environment.baseUrl}/data/chat/${id}`,
        sessionValueUpdate,
        {
          headers: { Authorization: `${token.bearerToken}` },
        },
      )

      sessionStorage.setItem('setCard', JSON.stringify(data.sessionSourceValue))

      dispatch({
        type: UPDATE_CHAT_SESSION_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      dispatch({ type: UPDATE_CHAT_SESSION_FAILED, payload: message })
    }
  }

export const ChatHistoryDetails =
  (userId: any, sessionId: any, noOfPrompt: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const tokens = JSON.parse(localStorage as any)
    dispatch({ type: CHAT_HISTORY_GET_REQUEST })
    try {
      const { data } = await api.get(`/chat/history/${userId}/pagedPromptsCti`, {
        params: { userId: userId, sessionId: sessionId, noOfPrompts: noOfPrompt },
        headers: { Authorization: `${tokens.bearerToken}` },
      })

      return dispatch({ type: CHAT_HISTORY_GET_SUCCESS, payload: data })
    } catch (error: any) {
      dispatch({ type: CHAT_HISTORY_GET_FAILED, payload: error.message })
    }
  }

export const ChatHistoryjSONDetails = () => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const tokens = JSON.parse(localStorage as any)
  dispatch({ type: CHAT_HISTORY_GET_JSON_REQUEST })
  try {
    const { data } = await api.get(`/data/datavaults-with-cti`, {
      headers: { Authorization: `${tokens.bearerToken}` },
    })
    return dispatch({ type: CHAT_HISTORY_GET_JSON_SUCCESS, payload: data })
  } catch (error: any) {
    dispatch({ type: CHAT_HISTORY_GET_JSON_FAILED, payload: error.message })
  }
}

export const ChatHistoryFindOne = (userId: any, sessionId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const tokens = JSON.parse(localStorage as any)
  dispatch({ type: CHAT_HISTORY_FIND_ONE_REQUEST })
  try {
    const { data } = await api.get(`/chat/history/${userId}/session`, {
      params: { userId: userId, sessionId: sessionId },
      headers: { Authorization: `${tokens.bearerToken}` },
    })

    return dispatch({ type: CHAT_HISTORY_FIND_ONE_SUCCESS, payload: data })
  } catch (error: any) {
    dispatch({ type: CHAT_HISTORY_FIND_ONE_FAILED, payload: error.message })
  }
}
