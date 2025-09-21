import { Prompt } from 'synth'

export const PROMPT_QUERY_SEND = 'PROMPT_QUERY_SEND'
export const PROMPT_SUCCESS = 'PROMPT_SUCCESS'
export const PROMPT_FAILED = 'PROMPT_FAILED'
export const PROMPT_RESPONSE_FAILED = 'PROMPT_RESPONSE_FAILED'
export const PROMPT_CATEGORY = ''
export const PROMPT_RESPONSE_RESET = 'PROMPT_RESPONSE_RESET'

export const sanitizePrompt = (query: any, user: any) => {
  return (dispatch: any) => {
    dispatch({ type: PROMPT_QUERY_SEND, payload: query })
    return Prompt.sanitizer
      .sanitize({ prompt: query.query })
      .then((response: any) => {
        if (response.decision == 'yes') {
          dispatch(sendPrompt({ user: user, prompt: query.query, summarize: true }))
        } else {
          switch (response.category) {
            case 1:
              PROMPT_CATEGORY = 'Fill in the blank attack'
              break
            case 2:
              PROMPT_CATEGORY = 'Obfuscation attack'
              break
            case 3:
              PROMPT_CATEGORY = 'Payload Splitting attack'
              break
            case 4:
              PROMPT_CATEGORY = 'Code Injection attack'
              break
            case 5:
              PROMPT_CATEGORY = 'Virtualization attack'
              break
            case 6:
              PROMPT_CATEGORY = 'Nullification attack'
              break
            case 7:
              PROMPT_CATEGORY = 'Abuse of privilege attack'
              break
            default:
              PROMPT_CATEGORY = 'Security Attack'
              break
          }
          dispatch({
            type: PROMPT_FAILED,
            payload: { alert: true, reason: response.reason, category: PROMPT_CATEGORY },
          })
        }
      })
      .catch((error: any) => {
        dispatch({
          type: PROMPT_RESPONSE_FAILED,
          payload: 'No response found',
        })
      })
  }
}

const sendPrompt = (req: { user: string; prompt: string; summarize: boolean }) => {
  return (dispatch: any) => {
    return Prompt.prompter
      .prompt(req)
      .then((response: any) => {
        if (response.better_answer == false && response.documents.length == 0) {
          dispatch({ type: PROMPT_SUCCESS, payload: response })
        } else if (!response.documents || response.documents.length == 0) {
          dispatch({
            type: PROMPT_FAILED,
            payload: {
              warn: true,
              warning:
                'There is a suitable answer available; however, you currently lack the necessary permissions to access these documents.',
            },
          })
        } else if (response.documents.length > 0 && response.better_answer == true) {
          dispatch({ type: PROMPT_SUCCESS, payload: response })
          dispatch({
            type: PROMPT_FAILED,
            payload: {
              warn: true,
              warning:
                'There may be a more suitable answer, however you are currently restricted from accessing those documents due to insufficient permissions.',
            },
          })
        } else {
          dispatch({ type: PROMPT_SUCCESS, payload: response })
        }
      })
      .catch((error: any) => {
        dispatch({
          type: PROMPT_RESPONSE_FAILED,
          payload: 'No response found',
        })
      })
  }
}

export default { sanitizePrompt }
