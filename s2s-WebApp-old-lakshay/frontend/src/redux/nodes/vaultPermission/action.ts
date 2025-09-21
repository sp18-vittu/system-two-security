import Axios from 'axios'
import local from '../../../utils/local'
import { environment } from '../../../environment/environment'
import api from '../api'

export const VALUTPERMISSION_DETAILS_REQUEST = 'VALUTPERMISSION_DETAILS_REQUEST'
export const VALUTPERMISSION_DETAILS_SUCCESS = 'VALUTPERMISSION_DETAILS_SUCCESS'
export const VALUTPERMISSION_DETAILS_FAILED = 'VALUTPERMISSION_DETAILS_FAILED'
export const VALUTPERMISSION_DETAILS_RESET = 'VALUTPERMISSION_DETAILS_RESET'

export const VALUTPERMISSIONROLE_DETAILS_REQUEST = 'VALUTPERMISSIONROLE_DETAILS_REQUEST'
export const VALUTPERMISSIONROLE_DETAILS_SUCCESS = 'VALUTPERMISSIONROLE_DETAILS_SUCCESS'
export const VALUTPERMISSIONROLE_DETAILS_FAILED = 'VALUTPERMISSIONROLE_DETAILS_FAILED'
export const VALUTPERMISSIONROLE_DETAILS_RESET = 'VALUTPERMISSIONROLE_DETAILS_RESET'

export const VAULT_USER_DELETE_REQUEST = 'VAULT_USER_DELETE_REQUEST'
export const VAULT_USER_DELETE_SUCCESS = 'VAULT_USER_DELETE_SUCCESS'
export const VAULT_USER_DELETE_FAILED = 'VAULT_USER_DELETE_FAILED'
export const VAULT_USER_DELETE_RESET = 'VAULT_USER_DELETE_RESET'

export const VALUTPERMISSIONROLE_ROLE_UPDATE_REQUEST = 'VALUTPERMISSIONROLE_ROLE_UPDATE_REQUEST'
export const VALUTPERMISSIONROLE_ROLE_UPDATE_SUCCESS = 'VALUTPERMISSIONROLE_ROLE_UPDATE_SUCCESS'
export const VALUTPERMISSIONROLE_ROLE_UPDATE_FAILED = 'VALUTPERMISSIONROLE_ROLE_UPDATE_FAILED'
export const VALUTPERMISSIONROLE_ROLE_UPDATE_RESET = 'VALUTPERMISSIONROLE_ROLE_UPDATES_RESET'

export const TEXT_EDITOR_SAVE_REQUEST = 'TEXT_EDITOR_SAVE_REQUEST'
export const TEXT_EDITOR_SAVE_SUCCESS = 'TEXT_EDITOR_SAVE_SUCCESS'
export const TEXT_EDITOR_SAVE_FAIL = 'TEXT_EDITOR_SAVE_FAIL'
export const TEXT_EDITOR_SAVE_RESET = 'TEXT_EDITOR_SAVE_RESET'

export const vaultPermissionList =
  (vaultPermissionId: any) => async (dispatch: any, getState: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({
      type: VALUTPERMISSION_DETAILS_REQUEST,
    })
    try {
      const { data } = await api.get(`/data/datavault-access/users/${vaultPermissionId}`, {
        headers: { Authorization: `${token.bearerToken}` },
      })
      dispatch({ type: VALUTPERMISSION_DETAILS_SUCCESS, payload: data })
    } catch (error: any) {
      dispatch({ type: VALUTPERMISSION_DETAILS_FAILED, payload: error.message })
    }
  }

export const vaultPermissionroleList =
  (vaultPermissionId: any) => async (dispatch: any, getState: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({
      type: VALUTPERMISSIONROLE_DETAILS_REQUEST,
    })
    try {
      const { data } = await api.get(`/data/vault-permissions`, {
        headers: { Accept: 'application/json', Authorization: `${token.bearerToken}` },
      })
      dispatch({ type: VALUTPERMISSIONROLE_DETAILS_SUCCESS, payload: data })
    } catch (error: any) {
      dispatch({ type: VALUTPERMISSIONROLE_DETAILS_FAILED, payload: error.message })
    }
  }

export const vaultDelete = (vaulId: any, UserId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: VAULT_USER_DELETE_REQUEST })
  try {
    const { data } = await Axios.delete(
      `${environment.baseUrl}/data/datavault-access/deleteUser/{vaultId}/${vaulId}?vaultId=${UserId}`,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    dispatch({
      type: VAULT_USER_DELETE_SUCCESS,
      // payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    dispatch({ type: VAULT_USER_DELETE_FAILED, payload: message })
  }
}

export const updateVaultpermissionrole =
  (RoleId: any, updatedUser: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: VALUTPERMISSIONROLE_ROLE_UPDATE_REQUEST })
    try {
      const { data } = await Axios.put(
        `${environment.baseUrl}/data/datavault-access/updateUser/${RoleId}`,
        updatedUser,
        {
          headers: { Authorization: `${token.bearerToken}` },
        },
      )
      dispatch({
        type: VALUTPERMISSIONROLE_ROLE_UPDATE_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      dispatch({ type: VALUTPERMISSIONROLE_ROLE_UPDATE_FAILED, payload: message })
    }
  }

export const saveEditedText = (editedText: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  console.log('editedText------------>', editedText)
  const formData = new FormData()
  formData.append('file', editedText.body)
  dispatch({ type: TEXT_EDITOR_SAVE_REQUEST })
  try {
    const { data } = await Axios.patch(
      `${environment.baseUrl}/data/document/${editedText.id}`,
      formData,
      {
        headers: { Authorization: `${token.bearerToken}`, 'Content-Type': `multipart/form-data` },
      },
    )
    console.log('data of saveEditedText===>', data)
    return dispatch({ type: TEXT_EDITOR_SAVE_SUCCESS, payload: data })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: TEXT_EDITOR_SAVE_FAIL, payload: message })
  }
}
