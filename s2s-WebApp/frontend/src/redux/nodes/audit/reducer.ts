import {
  AUDIT_DETAILS_FAILED,
  AUDIT_DETAILS_REQUEST,
  AUDIT_DETAILS_RESET,
  AUDIT_DETAILS_SUCCESS,
  FEEDBACK_FAILED,
  FEEDBACK_REQUEST,
  FEEDBACK_RESET,
  FEEDBACK_SUCCESS,
} from './action'

const initialState1 = {
  auditDetail: [],
  loading: false,
  errors: {},
}
export const AuditDetailreducer = (state = initialState1, action: { type: any; payload: any }) => {
  switch (action.type) {
    case AUDIT_DETAILS_SUCCESS:
      return {
        isAuthenticted: true,
        auditDetail: action.payload,
        loading: false,
        errors: {},
      }
    case AUDIT_DETAILS_REQUEST:
    case AUDIT_DETAILS_FAILED:
      return {
        isAuthenticted: false,
        auditDetail: null,
        loading: false,
        errors: {},
      }
    case AUDIT_DETAILS_RESET:
      return {}
    default:
      return state
  }
}

const initialState2 = {
  feedbacklist: [],
  loading: false,
  errors: {},
}
export const feedbackreducer = (state = initialState2, action: { type: any; payload: any }) => {
  switch (action.type) {
    case FEEDBACK_SUCCESS:
      return {
        isAuthenticted: true,
        feedbacklist: action.payload,
        loading: true,
        success: true,
        errors: {},
      }
    case FEEDBACK_REQUEST:
    case FEEDBACK_FAILED:
      return {
        isAuthenticted: false,
        feedbacklist: null,
        loading: false,
        errors: {},
      }
    case FEEDBACK_RESET:
      return {}
    default:
      return state
  }
}
