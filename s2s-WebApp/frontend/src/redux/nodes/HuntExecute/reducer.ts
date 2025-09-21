import {
  HUNT_RESULT_FAILED,
  HUNT_RESULT_REQUEST,
  HUNT_RESULT_RESET,
  HUNT_RESULT_SUCCESS,
} from './action'

const initialState2 = {
  roleDetail: [],
  loading: false,
  errors: {},
}
export const huntResultReducer = (state = initialState2, action: { type: any; payload: any }) => {
  switch (action.type) {
    case HUNT_RESULT_SUCCESS:
      return {
        isAuthenticted: true,
        roleDetail: action.payload,
        loading: false,
        errors: {},
      }
    case HUNT_RESULT_REQUEST:
    case HUNT_RESULT_FAILED:
      return {
        isAuthenticted: false,
        roleDetail: null,
        loading: false,
        errors: {},
      }
    case HUNT_RESULT_RESET:
      return {}
    default:
      return state
  }
}
