import { SET_API_STATUS_CODE } from './actions'

interface ApiState {
  statusCode: number | null
}

const initialState: ApiState = {
  statusCode: null,
}

export const apiReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_API_STATUS_CODE:
      return {
        ...state,
        statusCode: action.payload,
      }
    default:
      return state
  }
}
