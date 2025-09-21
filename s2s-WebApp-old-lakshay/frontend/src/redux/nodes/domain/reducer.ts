import {
  DOMAIN_FAILED,
  DOMAIN_REQUEST,
  DOMAIN_SUCCESS,
  TOKEN_FAILED,
  TOKEN_REQUEST,
  TOKEN_SUCCESS,
} from './action'

const initialState = {
  domainDetail: null,
  loading: false,
  errors: {},
}

const domainreducer = (state = initialState, action: { type: any; payload: any }) => {
  switch (action.type) {
    case DOMAIN_SUCCESS:
      return {
        isAuthenticted: true,
        domainDetail: action.payload,
        loading: false,
        errors: {},
      }
    case DOMAIN_REQUEST:
    case DOMAIN_FAILED:
      return {
        isAuthenticted: false,
        domainDetail: null,
        loading: false,
        errors: {},
      }

    case TOKEN_REQUEST:
    case TOKEN_SUCCESS:
      return {
        isAuthenticated: true,
        loading: false,
        errors: {},
        messages: {},
        data: action.payload,
      }
    case TOKEN_FAILED:
      return {
        loading: false,
        errors: action.payload,
        messages: {},
      }

    default:
      return state
  }
}

export default domainreducer
