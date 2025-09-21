export const SET_API_STATUS_CODE = 'SET_API_STATUS_CODE'

export const setApiStatusCode = (statusCode: number) => ({
  type: SET_API_STATUS_CODE,
  payload: statusCode,
})
