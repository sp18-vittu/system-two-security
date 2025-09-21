import { DATAVAULT_ID_FAILED } from '../datavault/action'
import {
  CREATE_CTI_REPORT_WHITELIST_FAILED,
  CREATE_CTI_REPORT_WHITELIST_REQUEST,
  CREATE_CTI_REPORT_WHITELIST_RESET,
  CREATE_CTI_REPORT_WHITELIST_SUCCESS,
  CREATE_VIEWFILE_VAULT_REQUEST,
  CREATE_VIEWFILE_VAULT_RESET,
  CREATE_VIEWFILE_VAULT_SUCCESS,
  CTI_REPORT_QUALIFIED_URL_FAILED,
  CTI_REPORT_QUALIFIED_URL_REQUEST,
  CTI_REPORT_QUALIFIED_URL_RESET,
  CTI_REPORT_QUALIFIED_URL_SUCCESS,
  REPOSITORY_DOC_DELETE_FAILED,
  REPOSITORY_DOC_DELETE_REQUEST,
  REPOSITORY_DOC_DELETE_RESET,
  REPOSITORY_DOC_DELETE_SUCCESS,
  REPOSITORY_DOC_FAILED,
  REPOSITORY_DOC_REQUEST,
  REPOSITORY_DOC_RESET,
  REPOSITORY_DOC_SUCCESS,
  REPOSITORY_MULTI_DOC_DELETE_FAILED,
  REPOSITORY_MULTI_DOC_DELETE_REQUEST,
  REPOSITORY_MULTI_DOC_DELETE_RESET,
  REPOSITORY_MULTI_DOC_DELETE_SUCCESS,
  REPOSITORY_SELECT_DOC_DELETE_FAILED,
  REPOSITORY_SELECT_DOC_DELETE_REQUEST,
  REPOSITORY_SELECT_DOC_DELETE_RESET,
  REPOSITORY_SELECT_DOC_DELETE_SUCCESS,
} from './action'

const initialState = {
  RepositoryDocList: [],
  loading: false,
  errors: {},
}

export const repositoryDocreducer = (state = initialState, action: { type: any; payload: any }) => {
  switch (action.type) {
    case REPOSITORY_DOC_SUCCESS:
      return {
        isAuthenticted: true,
        RepositoryDocList: action.payload,
        loading: false,
        errors: {},
      }
    case REPOSITORY_DOC_REQUEST:
    case REPOSITORY_DOC_FAILED:
      return {
        isAuthenticted: false,
        RepositoryDocList: null,
        loading: false,
        errors: {},
      }
    case REPOSITORY_DOC_RESET:
      return {}
    default:
      return state
  }
}

const initialState5 = {
  documentdeleteDetail: [],
  loading: false,
  errors: {},
}
export const docdeletereducer = (state = initialState5, action: { type: any; payload: any }) => {
  switch (action.type) {
    case REPOSITORY_DOC_DELETE_SUCCESS:
      return {
        isAuthenticted: true,
        documentdeleteDetail: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case REPOSITORY_DOC_DELETE_REQUEST:
    case REPOSITORY_DOC_DELETE_FAILED:
      return {
        isAuthenticted: false,
        documentdeleteDetail: null,
        loading: false,
        errors: {},
      }
    case REPOSITORY_DOC_DELETE_RESET:
      return {}
    default:
      return state
  }
}

const initialState10 = {
  documentdeleteAll: [],
  loading: false,
  errors: {},
}
export const docdeleteAllreducer = (
  state = initialState10,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case REPOSITORY_MULTI_DOC_DELETE_SUCCESS:
      return {
        isAuthenticted: true,
        documentdeleteAll: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case REPOSITORY_MULTI_DOC_DELETE_REQUEST:
    case REPOSITORY_MULTI_DOC_DELETE_FAILED:
      return {
        isAuthenticted: false,
        documentdeleteAll: null,
        loading: false,
        errors: {},
      }
    case REPOSITORY_MULTI_DOC_DELETE_RESET:
      return {}
    default:
      return state
  }
}
export const docSelectdeletereducer = (
  state = initialState5,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case REPOSITORY_SELECT_DOC_DELETE_SUCCESS:
      return {
        isAuthenticted: true,
        documentdeleteDetail: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case REPOSITORY_SELECT_DOC_DELETE_REQUEST:
    case REPOSITORY_SELECT_DOC_DELETE_FAILED:
      return {
        isAuthenticted: false,
        documentdeleteDetail: null,
        loading: false,
        errors: {},
      }
    case REPOSITORY_SELECT_DOC_DELETE_RESET:
      return {}
    default:
      return state
  }
}

export const dataVaultfileviewreducer = (
  state = initialState5,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case CREATE_VIEWFILE_VAULT_SUCCESS:
      return {
        isAuthenticted: true,
        dataVaultIdList: action.payload,
        loading: false,
        errors: {},
      }
    case CREATE_VIEWFILE_VAULT_REQUEST:
    case DATAVAULT_ID_FAILED:
      return {
        isAuthenticted: false,
        dataVaultIdList: null,
        loading: false,
        errors: {},
      }
    case CREATE_VIEWFILE_VAULT_RESET:
      return {}
    default:
      return state
  }
}
const initialStateOfDataWhitelist = {
  dataWhitelist: [],
  loading: false,
  errors: {},
}
export const createDataWhitelistReducer = (
  state = initialStateOfDataWhitelist,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case CREATE_CTI_REPORT_WHITELIST_SUCCESS:
      return {
        isAuthenticted: true,
        dataWhitelist: action.payload,
        loading: false,
        errors: {},
      }
    case CREATE_CTI_REPORT_WHITELIST_REQUEST:
    case CREATE_CTI_REPORT_WHITELIST_FAILED:
      return {
        isAuthenticted: false,
        dataWhitelist: null,
        loading: false,
        errors: {},
      }
    case CREATE_CTI_REPORT_WHITELIST_RESET:
      return {}
    default:
      return state
  }
}
const initialStateOfQualifiedUrl = {
  dataWhitelist: [],
  loading: false,
  errors: {},
}
export const qualifiedUrlReducer = (
  state = initialStateOfQualifiedUrl,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case CTI_REPORT_QUALIFIED_URL_SUCCESS:
      return {
        isAuthenticted: true,
        dataWhitelist: action.payload,
        loading: false,
        errors: {},
      }
    case CTI_REPORT_QUALIFIED_URL_REQUEST:
    case CTI_REPORT_QUALIFIED_URL_FAILED:
      return {
        isAuthenticted: false,
        dataWhitelist: null,
        loading: false,
        errors: {},
      }
    case CTI_REPORT_QUALIFIED_URL_RESET:
      return {}
    default:
      return state
  }
}
