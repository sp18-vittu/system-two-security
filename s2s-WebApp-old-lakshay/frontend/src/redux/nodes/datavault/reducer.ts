import {
  CREATE_NEW_DATAINGESTION_FAILED,
  CREATE_NEW_DATAINGESTION_REQUEST,
  CREATE_NEW_DATAINGESTION_RESET,
  CREATE_NEW_DATAINGESTION_SUCCESS,
  CREATE_NEW_DATAVALUT_FAILED,
  CREATE_NEW_DATAVALUT_REQUEST,
  CREATE_NEW_DATAVALUT_RESET,
  CREATE_NEW_DATAVALUT_SUCCESS,
  CREATE_NEW_VAULT_FAILED,
  CREATE_NEW_VAULT_REQUEST,
  CREATE_NEW_VAULT_SUCCESS,
  DATAVAULT_DATAINGESTIONURL_FAILED,
  DATAVAULT_DATAINGESTIONURL_REQUEST,
  DATAVAULT_DATAINGESTIONURL_RESET,
  DATAVAULT_DATAINGESTIONURL_SUCCESS,
  DATAVAULT_DELETE_FAILED,
  DATAVAULT_DELETE_REQUEST,
  DATAVAULT_DELETE_RESET,
  DATAVAULT_DELETE_SUCCESS,
  DATAVAULT_DETAIL_FAILED,
  DATAVAULT_DETAIL_REQUEST,
  DATAVAULT_DETAIL_RESET,
  DATAVAULT_DETAIL_SUCCESS,
  DATAVAULT_ID_FAILED,
  DATAVAULT_ID_REQUEST,
  DATAVAULT_ID_RESET,
  DATAVAULT_ID_SUCCESS,
  DATAVAULT_INDIVIDUAL_ID_FAILED,
  DATAVAULT_INDIVIDUAL_ID_REQUEST,
  DATAVAULT_INDIVIDUAL_ID_RESET,
  DATAVAULT_INDIVIDUAL_ID_SUCCESS,
  DATAVAULT_UPDATE_FAILED,
  DATAVAULT_UPDATE_REQUEST,
  DATAVAULT_UPDATE_RESET,
  DATAVAULT_UPDATE_SUCCESS,
} from './action'

const initialState = {
  dataVaultlist: [],
  loading: false,
  errors: {},
}

export const dataVaultreducer = (state = initialState, action: { type: any; payload: any }) => {
  switch (action.type) {
    case DATAVAULT_DETAIL_SUCCESS:
      return {
        isAuthenticted: true,
        dataVaultlist: action.payload,
        loading: false,
        errors: {},
      }
    case DATAVAULT_DETAIL_REQUEST:
    case DATAVAULT_DETAIL_FAILED:
      return {
        isAuthenticted: false,
        dataVaultlist: null,
        loading: false,
        errors: {},
      }
    case DATAVAULT_DETAIL_RESET:
      return {}
    default:
      return state
  }
}

const initialState12 = {
  isAuthenticted: false,
  dataVaultDelete: [],
  loading: false,
  success: false,
  errors: {},
}

export const dataVaultdeletereducer = (
  state = initialState12,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case DATAVAULT_DELETE_SUCCESS:
      return {
        isAuthenticted: true,
        dataVaultDelete: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case DATAVAULT_DELETE_REQUEST:
    case DATAVAULT_DELETE_FAILED:
      return {
        isAuthenticted: false,
        dataVaultDelete: null,
        loading: false,
        errors: {},
      }
    case DATAVAULT_DELETE_RESET:
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

export const datavalutsavereducer = (
  state = initialState3,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case CREATE_NEW_DATAVALUT_SUCCESS:
      return {
        isAuthenticted: true,
        userupdateDetail: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case CREATE_NEW_DATAVALUT_REQUEST:
    case CREATE_NEW_DATAVALUT_FAILED:
      return {
        isAuthenticted: false,
        userupdateDetail: null,
        loading: false,
        errors: {},
      }
    case CREATE_NEW_DATAVALUT_RESET:
      return {}
    default:
      return state
  }
}

const initialState4 = {
  updateVaultDetail: [],
  loading: false,
  errors: {},
}

export const datavalutUpdatereducer = (
  state = initialState4,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case DATAVAULT_UPDATE_SUCCESS:
      return {
        isAuthenticted: true,
        updateVaultDetail: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case DATAVAULT_UPDATE_REQUEST:
    case DATAVAULT_UPDATE_FAILED:
      return {
        isAuthenticted: false,
        updateVaultDetail: null,
        loading: false,
        errors: {},
      }
    case DATAVAULT_UPDATE_RESET:
      return {}
    default:
      return state
  }
}

export const dataIngestionereducer = (
  state = initialState12,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case CREATE_NEW_DATAINGESTION_REQUEST:
      return {
        loading: true,
        success: false,
      }
    case CREATE_NEW_DATAINGESTION_SUCCESS:
      return {
        isAuthenticted: true,
        dataVaultDelete: action.payload,
        loading: false,
        success: true,
        errors: {},
      }

    case CREATE_NEW_DATAINGESTION_FAILED:
      return {
        isAuthenticted: false,
        dataVaultDelete: null,
        loading: false,
        success: false,
        errors: {},
      }
    case CREATE_NEW_DATAINGESTION_RESET:
      return {}
    default:
      return state
  }
}

const initialState5 = {
  dataVaultIdList: [],
  loading: false,
  errors: {},
}

export const dataVaultIdreducer = (state = initialState5, action: { type: any; payload: any }) => {
  switch (action.type) {
    case DATAVAULT_INDIVIDUAL_ID_SUCCESS:
      return {
        isAuthenticted: true,
        dataVaultIdList: action.payload,
        loading: false,
        errors: {},
      }
    case DATAVAULT_INDIVIDUAL_ID_REQUEST:
    case DATAVAULT_INDIVIDUAL_ID_FAILED:
      return {
        isAuthenticted: false,
        dataVaultIdList: null,
        loading: false,
        errors: {},
      }
    case DATAVAULT_INDIVIDUAL_ID_RESET:
      return {}
    default:
      return state
  }
}

const initialState8 = {
  dataVaultdomainIdList: [],
  loading: false,
  errors: {},
}

export const dataVaultdomainIdreducer = (
  state = initialState8,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case DATAVAULT_ID_SUCCESS:
      return {
        isAuthenticted: true,
        dataVaultdomainIdList: action.payload,
        loading: false,
        errors: {},
      }
    case DATAVAULT_ID_REQUEST:
    case DATAVAULT_ID_FAILED:
      return {
        isAuthenticted: false,
        dataVaultdomainIdList: null,
        loading: false,
        errors: {},
      }
    case DATAVAULT_ID_RESET:
      return {}
    default:
      return state
  }
}

export const dataingestionUrlreducer = (
  state = initialState5,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case DATAVAULT_DATAINGESTIONURL_SUCCESS:
      return {
        isAuthenticted: true,
        success: true,
        dataVaultIdList: action.payload,
        loading: false,
        errors: {},
      }
    case DATAVAULT_DATAINGESTIONURL_REQUEST:
    case DATAVAULT_DATAINGESTIONURL_FAILED:
      return {
        isAuthenticted: false,
        dataVaultIdList: null,
        loading: false,
        errors: {},
      }
    case DATAVAULT_DATAINGESTIONURL_RESET:
      return {}
    default:
      return state
  }
}

const initialState7 = {
  usersaveDetail: [],
  loading: false,
  errors: {},
}

export const saveuserreducer = (state = initialState7, action: { type: any; payload: any }) => {
  switch (action.type) {
    case CREATE_NEW_VAULT_SUCCESS:
      return {
        isAuthenticted: true,
        usersaveDetail: action.payload,
        loading: false,
        success: true,
        errors: {},
      }
    case CREATE_NEW_VAULT_REQUEST:
    case CREATE_NEW_VAULT_FAILED:
      return {
        isAuthenticted: false,
        usersaveDetail: null,
        loading: false,
        errors: {},
      }
    case CREATE_NEW_DATAVALUT_RESET:
      return {}
    default:
      return state
  }
}
