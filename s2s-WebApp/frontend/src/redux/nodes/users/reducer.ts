import {
  INDVIDUAL_USER_FAILED,
  INDVIDUAL_USER_REQUEST,
  INDVIDUAL_USER_SUCCESS,
  INVITE_USER_FAILED,
  INVITE_USER_REQUEST,
  INVITE_USER_RESET,
  INVITE_USER_SUCCESS,
  USER_DELETE_FAILED,
  USER_DELETE_REQUEST,
  USER_DELETE_RESET,
  USER_DELETE_SUCCESS,
  USER_DETAILS_FAILED,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_ROLE_DETAILS_FAILED,
  USER_ROLE_DETAILS_REQUEST,
  USER_ROLE_DETAILS_RESET,
  USER_ROLE_DETAILS_SUCCESS,
  USER_ROLE_UPDATE_FAILED,
  USER_ROLE_UPDATE_REQUEST,
  USER_ROLE_UPDATE_RESET,
  USER_ROLE_UPDATE_SUCCESS,
  USER_UPDATE_FAILED,
  USER_UPDATE_REQUEST,
  USER_UPDATE_RESET,
  USER_UPDATE_SUCCESS,
} from './action'

const initialState1 = {
  userDetail: [],
  loading: false,
  errors: {},
}

export const userDetailreducer = (state = initialState1, action: { type: any; payload: any }) => {
  switch (action.type) {
    case USER_DETAILS_SUCCESS:
      return {
        isAuthenticted: true,
        domainDetail: action.payload,
        loading: false,
        errors: {},
      }
    case USER_DETAILS_REQUEST:
    case USER_DETAILS_FAILED:
      return {
        isAuthenticted: false,
        domainDetail: null,
        loading: false,
        errors: {},
      }
    case USER_DETAILS_RESET:
      return {}
    default:
      return state
  }
}

const initialState2 = {
  roleDetail: [],
  loading: false,
  errors: {},
}
export const RoleDetailreducer = (state = initialState2, action: { type: any; payload: any }) => {
  switch (action.type) {
    case USER_ROLE_DETAILS_SUCCESS:
      return {
        isAuthenticted: true,
        roleDetail: action.payload,
        loading: false,
        errors: {},
      }
    case USER_ROLE_DETAILS_REQUEST:
    case USER_ROLE_DETAILS_FAILED:
      return {
        isAuthenticted: false,
        roleDetail: null,
        loading: false,
        errors: {},
      }
    case USER_ROLE_DETAILS_RESET:
      return {}
    default:
      return state
  }
}

const initialState3 = {
  userupdateDetail: [],
  loading: false,
  errors: {},
}

export const Inviteusersavereducer = (
  state = initialState3,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case INVITE_USER_SUCCESS:
      return {
        isAuthenticted: true,
        userupdateDetail: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case INVITE_USER_REQUEST:
    case INVITE_USER_FAILED:
      return {
        isAuthenticted: false,
        userupdateDetail: null,
        loading: false,
        errors: {},
      }
    case INVITE_USER_RESET:
      return {}
    default:
      return state
  }
}

const initialState4 = {
  induserDetail: {},
  loading: false,
  errors: {},
}
export const indUserdetailreducer = (
  state = initialState4,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case INDVIDUAL_USER_SUCCESS:
      return {
        isAuthenticted: true,
        induserDetail: action.payload,
        loading: false,
        errors: {},
      }
    case INDVIDUAL_USER_REQUEST:
      return {
        loading: true,
      }
    case INDVIDUAL_USER_FAILED:
      return {
        isAuthenticted: false,
        induserDetail: null,
        loading: false,
        errors: {},
      }
    default:
      return state
  }
}

const initialState5 = {
  userdeleteDetail: [],
  loading: false,
  errors: {},
}
export const userdeletereducer = (state = initialState5, action: { type: any; payload: any }) => {
  switch (action.type) {
    case USER_DELETE_SUCCESS:
      return {
        isAuthenticted: true,
        userdeleteDetail: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case USER_DELETE_REQUEST:
    case USER_DELETE_FAILED:
      return {
        isAuthenticted: false,
        userdeleteDetail: null,
        loading: false,
        errors: {},
      }
    case USER_DELETE_RESET:
      return {}
    default:
      return state
  }
}

const initialState6 = {
  userroleupdateDetail: [],
  loading: false,
  errors: {},
}
export const userroleupdatereducer = (
  state = initialState6,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case USER_ROLE_UPDATE_SUCCESS:
      return {
        isAuthenticted: true,
        userroleupdateDetail: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case USER_ROLE_UPDATE_REQUEST:
    case USER_ROLE_UPDATE_FAILED:
      return {
        isAuthenticted: false,
        userroleupdateDetail: null,
        loading: false,
        errors: {},
      }
    case USER_ROLE_UPDATE_RESET:
      return {}
    default:
      return state
  }
}

const initialState7 = {
  userUpdateDetail: {},
  loading: false,
  success: false,
  errors: {},
}

export const userSettingUpdatereducer = (
  state = initialState7,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case USER_UPDATE_SUCCESS:
      return {
        isAuthenticted: true,
        userUpdateDetail: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case USER_UPDATE_REQUEST:
    case USER_UPDATE_FAILED:
      return {
        isAuthenticted: false,
        userUpdateDetail: null,
        loading: false,
        errors: {},
      }
    case USER_UPDATE_RESET:
      return {}
    default:
      return state
  }
}
