import {
  COMPANY_PROFILE_FAILED,
  COMPANY_PROFILE_GET_FAILED,
  COMPANY_PROFILE_GET_REQUEST,
  COMPANY_PROFILE_GET_RESET,
  COMPANY_PROFILE_GET_SUCCESS,
  COMPANY_PROFILE_REQUEST,
  COMPANY_PROFILE_RESET,
  COMPANY_PROFILE_SUCCESS,
} from './action'

const initialState1 = {
  companyProfileDetail: [],
  loading: false,
  errors: {},
}

export const companyProfileDetail = (
  state = initialState1,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case COMPANY_PROFILE_SUCCESS:
      return {
        isAuthenticted: true,
        domainDetail: action.payload,
        loading: false,
        errors: {},
      }
    case COMPANY_PROFILE_REQUEST:
    case COMPANY_PROFILE_FAILED:
      return {
        isAuthenticted: false,
        domainDetail: null,
        loading: false,
        errors: {},
      }
    case COMPANY_PROFILE_RESET:
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
    case COMPANY_PROFILE_GET_SUCCESS:
      return {
        isAuthenticted: true,
        roleDetail: action.payload,
        loading: false,
        errors: {},
      }
    case COMPANY_PROFILE_GET_REQUEST:
    case COMPANY_PROFILE_GET_FAILED:
      return {
        isAuthenticted: false,
        roleDetail: null,
        loading: false,
        errors: {},
      }
    case COMPANY_PROFILE_GET_RESET:
      return {}
    default:
      return state
  }
}
