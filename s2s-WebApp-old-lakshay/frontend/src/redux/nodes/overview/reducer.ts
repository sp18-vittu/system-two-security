import {
  DASHBOARD_HOMEPAGE_FAILED,
  DASHBOARD_HOMEPAGE_REQUEST,
  DASHBOARD_HOMEPAGE_RESET,
  DASHBOARD_HOMEPAGE_SUCCESS,
} from './action'

const initialState5 = {
  documentdeleteDetail: [],
  loading: false,
  errors: {},
}
export const overviewDashboardreducer = (
  state = initialState5,
  action: { type: any; payload: any },
) => {
  switch (action.type) {
    case DASHBOARD_HOMEPAGE_SUCCESS:
      return {
        isAuthenticted: true,
        dataVaultIdList: action.payload,
        loading: false,
        errors: {},
      }
    case DASHBOARD_HOMEPAGE_REQUEST:
    case DASHBOARD_HOMEPAGE_FAILED:
      return {
        isAuthenticted: false,
        dataVaultIdList: null,
        loading: false,
        errors: {},
      }
    case DASHBOARD_HOMEPAGE_RESET:
      return {}
    default:
      return state
  }
}
