import { Prompt } from 'synth'

export const PROMPT_QUERY_SEND_NEWCHAT = 'PROMPT_QUERY_SEND_NEWCHAT'
export const PROMPT_RESPONSE_FAILED_NEWCHAT = 'PROMPT_RESPONSE_FAILED_NEWCHAT'

export const sanitizeNewChat = (query: any, user: any) => {
  return (dispatch: any) => {
    dispatch({ type: PROMPT_QUERY_SEND_NEWCHAT, payload: query })
    return Prompt.sanitizer
      .sanitize({ prompt: query.query })
      .then((response: any) => {})
      .catch((error: any) => {
        dispatch({
          type: PROMPT_RESPONSE_FAILED_NEWCHAT,
          payload: 'No response found',
        })
      })
  }
}
