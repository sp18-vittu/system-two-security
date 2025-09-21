import {
  TEXT_EDITOR_SAVE_FAIL,
  TEXT_EDITOR_SAVE_REQUEST,
  TEXT_EDITOR_SAVE_RESET,
  TEXT_EDITOR_SAVE_SUCCESS,
  VALUTPERMISSIONROLE_DETAILS_FAILED,
  VALUTPERMISSIONROLE_DETAILS_REQUEST,
  VALUTPERMISSIONROLE_DETAILS_RESET,
  VALUTPERMISSIONROLE_DETAILS_SUCCESS,
  VALUTPERMISSIONROLE_ROLE_UPDATE_FAILED,
  VALUTPERMISSIONROLE_ROLE_UPDATE_REQUEST,
  VALUTPERMISSIONROLE_ROLE_UPDATE_RESET,
  VALUTPERMISSIONROLE_ROLE_UPDATE_SUCCESS,
  VALUTPERMISSION_DETAILS_FAILED,
  VALUTPERMISSION_DETAILS_REQUEST,
  VALUTPERMISSION_DETAILS_RESET,
  VALUTPERMISSION_DETAILS_SUCCESS,
  VAULT_USER_DELETE_FAILED,
  VAULT_USER_DELETE_REQUEST,
  VAULT_USER_DELETE_RESET,
  VAULT_USER_DELETE_SUCCESS,
} from './action'

const initialState1 = {
  vaultPermissionDetails: [],
  loading: false,
  errors: {},
}

export const vaultPermissionDetailsreducer = (
  state = initialState1,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case VALUTPERMISSION_DETAILS_SUCCESS:
      return {
        isAuthenticted: true,
        vaultPermissionDetails: action.payload,
        loading: false,
        errors: {},
      }
    case VALUTPERMISSION_DETAILS_REQUEST:
    case VALUTPERMISSION_DETAILS_FAILED:
      return {
        isAuthenticted: false,
        vaultPermissionDetails: null,
        loading: false,
        errors: {},
      }
    case VALUTPERMISSION_DETAILS_RESET:
      return {}
    default:
      return state
  }
}

const initialState23 = {
  vaultdeleteDetail: [],
  loading: false,
  errors: {},
}
export const vaultdeletereducer = (state = initialState23, action: { type: any; payload: any }) => {
  switch (action.type) {
    case VAULT_USER_DELETE_SUCCESS:
      return {
        isAuthenticted: true,
        vaultdeleteDetail: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case VAULT_USER_DELETE_REQUEST:
    case VAULT_USER_DELETE_FAILED:
      return {
        isAuthenticted: false,
        vaultdeleteDetail: null,
        loading: false,
        errors: {},
      }
    case VAULT_USER_DELETE_RESET:
      return {}
    default:
      return state
  }
}

const initialState3 = {
  vaultPermissionroleDetails: [],
  loading: false,
  errors: {},
}

export const vaultPermissionroleDetailsreducer = (
  state = initialState3,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case VALUTPERMISSIONROLE_DETAILS_SUCCESS:
      return {
        isAuthenticted: true,
        vaultPermissionroleDetails: action.payload,
        loading: false,
        errors: {},
      }
    case VALUTPERMISSIONROLE_DETAILS_REQUEST:
    case VALUTPERMISSIONROLE_DETAILS_FAILED:
      return {
        isAuthenticted: false,
        vaultPermissionroleDetails: null,
        loading: false,
        errors: {},
      }
    case VALUTPERMISSIONROLE_DETAILS_RESET:
      return {}
    default:
      return state
  }
}

export const vaultPermissionaceessupdatereducer = (
  state = initialState3,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case VALUTPERMISSIONROLE_ROLE_UPDATE_SUCCESS:
      return {
        isAuthenticted: true,
        vaultPermissionroleDetails: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case VALUTPERMISSIONROLE_ROLE_UPDATE_REQUEST:
    case VALUTPERMISSIONROLE_ROLE_UPDATE_FAILED:
      return {
        isAuthenticted: false,
        vaultPermissionroleDetails: null,
        loading: false,
        errors: {},
      }
    case VALUTPERMISSIONROLE_ROLE_UPDATE_RESET:
      return {}
    default:
      return state
  }
}

const initialSate4 = {
  textSaved: {},
  loading: false,
  errors: {},
}

export const textEditorSaveReducer = (
  state = initialSate4,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case TEXT_EDITOR_SAVE_REQUEST:
    case TEXT_EDITOR_SAVE_SUCCESS:
      return {
        isAuthenticted: true,
        textSaved: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case TEXT_EDITOR_SAVE_FAIL:
      return {
        isAuthenticted: false,
        textSaved: null,
        loading: false,
        errors: {},
      }
    case TEXT_EDITOR_SAVE_RESET:
      return {}
    default:
      return state
  }
}
