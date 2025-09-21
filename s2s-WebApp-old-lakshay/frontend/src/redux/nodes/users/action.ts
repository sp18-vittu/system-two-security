import Axios from 'axios'
import local from '../../../utils/local'
import { environment } from '../../../environment/environment'
import api from '../api'

export const INVITE_USER_REQUEST = 'INVITE_USER_REQUEST'
export const INVITE_USER_SUCCESS = 'INVITE_USER_SUCCESS'
export const INVITE_USER_FAILED = 'INVITE_USER_FAILED'
export const INVITE_USER_RESET = 'INVITE_USER_RESET'

export const USER_DELETE_REQUEST = 'USER_DELETE_REQUEST'
export const USER_DELETE_SUCCESS = 'USER_DELETE_SUCCESS'
export const USER_DELETE_FAILED = 'USER_DELETE_FAILED'
export const USER_DELETE_RESET = 'USER_DELETE_RESET'

export const USER_UPDATE_REQUEST = 'USER_UPDATE_REQUEST'
export const USER_UPDATE_SUCCESS = 'USER_UPDATE_SUCCESS'
export const USER_UPDATE_FAILED = 'USER_UPDATE_FAILED'
export const USER_UPDATE_RESET = 'USER_UPDATE_RESET'

export const USER_DETAILS_REQUEST = 'USER_DETAILS_REQUEST'
export const USER_DETAILS_SUCCESS = 'USER_DETAILS_SUCCESS'
export const USER_DETAILS_FAILED = 'USER_DETAILS_FAILED'
export const USER_DETAILS_RESET = 'USER_DETAILS_RESET'

export const USER_ROLE_DETAILS_REQUEST = 'USER_ROLE_DETAILS_REQUEST'
export const USER_ROLE_DETAILS_SUCCESS = 'USER_ROLE_DETAILS_SUCCESS'
export const USER_ROLE_DETAILS_FAILED = 'USER_ROLE_DETAILS_FAILED'
export const USER_ROLE_DETAILS_RESET = 'USER_ROLE_DETAILS_RESET'

export const USER_ROLE_UPDATE_REQUEST = 'USER_ROLE_UPDATE_REQUEST'
export const USER_ROLE_UPDATE_SUCCESS = 'USER_ROLE_UPDATE_SUCCESS'
export const USER_ROLE_UPDATE_FAILED = 'USER_ROLE_UPDATE_FAILED'
export const USER_ROLE_UPDATE_RESET = 'USER_ROLE_UPDATE_RESET'

export const INDVIDUAL_USER_REQUEST = 'INDVIDUAL_USER_REQUEST'
export const INDVIDUAL_USER_SUCCESS = 'INDVIDUAL_USER_SUCCESS'
export const INDVIDUAL_USER_FAILED = 'INDVIDUAL_USER_FAILED'

export const Inviteuser = (InviteUser: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: INVITE_USER_REQUEST })
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/data/user/invite`, InviteUser, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: INVITE_USER_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: INVITE_USER_FAILED, payload: message })
  }
}

export const UserList = (token: any) => async (dispatch: any, getState: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)

  try {
    const { data } = await api.get(`/data/users`, {
      headers: { Authorization: `${token.bearerToken}` },
    })

    return dispatch({ type: USER_DETAILS_SUCCESS, payload: data })
  } catch (error: any) {
    dispatch({ type: USER_DETAILS_FAILED, payload: error.message })
  }
}

export const RoleList = (token: any) => async (dispatch: any, getState: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({
    type: USER_ROLE_DETAILS_REQUEST,
  })
  try {
    const { data } = await api.get(`/data/roles`, {
      headers: { Authorization: `${token.bearerToken}` },
    })

    dispatch({ type: USER_ROLE_DETAILS_SUCCESS, payload: data })
  } catch (error: any) {
    dispatch({ type: USER_ROLE_DETAILS_FAILED, payload: error.message })
  }
}

export const deleteUser = (UserId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: USER_DELETE_REQUEST })
  try {
    const { data } = await Axios.delete(`${environment.baseUrl}/data/user/${UserId}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: USER_DELETE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: USER_DELETE_FAILED, payload: message })
  }
}

export const updateuserrole = (userId: any, RoleId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: USER_ROLE_UPDATE_REQUEST })
  try {
    const { data } = await Axios.put(
      `${environment.baseUrl}/data/user/updateRole/${userId}?roleId=${RoleId}`,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({
      type: USER_ROLE_UPDATE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: USER_ROLE_UPDATE_FAILED, payload: message })
  }
}

export const indUserDetail = (userId: any, token: any) => async (dispatch: any) => {
  dispatch({ type: INDVIDUAL_USER_REQUEST })
  try {
    const { data } = await api.get(`/data/user/${userId}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    dispatch({
      type: INDVIDUAL_USER_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: INDVIDUAL_USER_FAILED, payload: message })
  }
}

export const indUserUpdate = (userId: any, IndUser: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: USER_UPDATE_REQUEST })
  try {
    const { data } = await Axios.put(`${environment.baseUrl}/data/user/${userId}`, IndUser, {
      headers: { Authorization: `${token.bearerToken}` },
    })

    dispatch({
      type: USER_UPDATE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: USER_DETAILS_FAILED, payload: message })
  }
}
