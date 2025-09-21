import Axios from 'axios'
import local from '../../../utils/local'
import { environment } from '../../../environment/environment'
import api from '../api'

export const CREATE_CHAT_REQUEST = ' CREATE_CHAT_REQUEST'
export const CREATE_CHAT_SUCCESS = 'CREATE_CHAT_SUCCESS'
export const CREATE_CHAT_FAILED = 'CREATE_CHAT_FAILED'
export const CREATE_CHAT_RESET = 'CREATE_CHAT_RESET'

export const CREATE_CHAT_PUT_REQUEST = ' CREATE_CHAT_PUT_REQUEST'
export const CREATE_CHAT_PUT_SUCCESS = 'CREATE_CHAT_PUT_SUCCESS'
export const CREATE_CHAT_PUT_FAILED = 'CREATE_CHAT_PUT_FAILED'
export const CREATE_CHAT_PUT_RESET = 'CREATE_CHAT_PUT_RESET'

export const CHAT_HISTORYS_REQUEST = ' CHAT_HISTORYS_REQUEST'
export const CHAT_HISTORYS_SUCCESS = 'CHAT_HISTORYS_SUCCESS'
export const CHAT_HISTORYS_FAILED = 'CHAT_HISTORYS_FAILED'
export const CHAT_HISTORYS_RESET = 'CHAT_HISTORYS_RESET'

export const CHAT_HISTORYS_SCROLL_REQUEST = ' CHAT_HISTORYS_SCROLL_REQUEST'
export const CHAT_HISTORYS_SCROLL_SUCCESS = 'CHAT_HISTORYS_SCROLL_SUCCESS'
export const CHAT_HISTORYS_SCROLL_FAILED = 'CHAT_HISTORYS_SCROLL_FAILED'
export const CHAT_HISTORYS_SCROLL_RESET = 'CHAT_HISTORYS_SCROLL_RESET'

export const createChat = (selectFiles: any, ctiFiles: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: CREATE_CHAT_REQUEST })
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/data/chat`, ctiFiles, {
      params: {
        vaultId: Number(selectFiles.vaultId),
        reportId: selectFiles.id,
        ruleId: selectFiles?.ruleId,
        mitreLocation: selectFiles.mitreLocation,
        globalVault: selectFiles.global,
      },
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({ type: CREATE_CHAT_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: CREATE_CHAT_FAILED, payload: error.message })
  }
}

export const sessionChatUpdate = (selectFiles: any, id: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: CREATE_CHAT_PUT_REQUEST })
  try {
    const { data } = await Axios.put(
      `${environment.baseUrl}/data/chat/${Number(id)}?sessionName=${
        selectFiles.sessionName
      }&vaultId=${Number(selectFiles.vaultId)}&reportId=${selectFiles.reportId}&mitreLocation=${
        selectFiles.mitreLocation
      }&globalVault=${selectFiles.globalVault}`,
      null,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({ type: CREATE_CHAT_PUT_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: CREATE_CHAT_PUT_FAILED, payload: error.message })
  }
}

export const chatHistory = (token: any, id: any) => async (dispatch: any) => {
  const tenantDto = local.getItem('auth')
  const tenantd = JSON.parse(tenantDto as any)
  const tenant = tenantd?.user?.user
  dispatch({
    type: CHAT_HISTORYS_REQUEST,
  })
  try {
    const { data } = await api.get(`/chat/history/${tenant?.id}/session?`, {
      headers: { Authorization: `${token.bearerToken}` },
      params: { sessionId: id },
    })

    return dispatch({ type: CHAT_HISTORYS_SUCCESS, payload: data })
  } catch (error: any) {
    console.log('error.id', error)

    dispatch({ type: CHAT_HISTORYS_FAILED, payload: error.message })
  }
}
