import {
  DASHBOARD_SIGMA_FAILED,
  DASHBOARD_SIGMA_REQUEST,
  DASHBOARD_SIGMA_RESET,
  DASHBOARD_SIGMA_SUCCESS,
} from './action'

const initialState5 = {
  documentdeleteDetail: [],
  loading: false,
  errors: {},
}
export const sigmaFilterReducer = (state = initialState5, action: { type: any; payload: any }) => {
  switch (action.type) {
    case DASHBOARD_SIGMA_SUCCESS:
      return {
        isAuthenticted: true,
        dataVaultIdList: action.payload,
        loading: false,
        errors: {},
      }
    case DASHBOARD_SIGMA_REQUEST:
    case DASHBOARD_SIGMA_FAILED:
      return {
        isAuthenticted: false,
        dataVaultIdList: null,
        loading: false,
        errors: {},
      }
    case DASHBOARD_SIGMA_RESET:
      return {}
    default:
      return state
  }
}
