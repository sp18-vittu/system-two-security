import { Prompt } from 'synth'

export const PROMPT_QUERY_SEND_CHATONE = 'PROMPT_QUERY_SEND_CHATONE'
export const PROMPT_RESPONSE_FAILED_CHATONE = 'PROMPT_RESPONSE_FAILED_CHATONE'
export const PROMPT_QUERY_SEND_CHAT = 'PROMPT_QUERY_SEND_CHAT'
export const PROMPT_QUERY_FAILED_CHAT = 'PROMPT_RESPONSE_FAILED_CHAT'

export const sanitizeChatOne = (query: any, user: any) => {
  return (dispatch: any) => {
    dispatch({ type: PROMPT_QUERY_SEND_CHATONE, payload: query })
    return Prompt.sanitizer
      .sanitize({ prompt: query.query })
      .then((response: any) => {})
      .catch((error: any) => {
        dispatch({
          type: PROMPT_RESPONSE_FAILED_CHATONE,
          payload: 'No response found',
        })
      })
  }
}
export const chatName = (data: any) => {
  return (dispatch: any) => {
    dispatch({ type: PROMPT_QUERY_SEND_CHAT, payload: data })
    return Prompt.sanitizer
      .sanitize({ prompt: data.data })
      .then((response: any) => {})
      .catch((error: any) => {
        dispatch({
          type: PROMPT_QUERY_FAILED_CHAT,
          payload: 'No response found',
        })
      })
  }
}

export default { sanitizeChatOne, chatName }
