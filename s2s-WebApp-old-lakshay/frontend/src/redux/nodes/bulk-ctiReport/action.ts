import Axios from 'axios'
import { environment } from '../../../environment/environment'
import local from '../../../utils/local'

export const ADD_BULK_CTI_REPORT_REQUEST = 'ADD_BULK_CTI_REPORT_REQUEST'
export const ADD_BULK_CTI_REPORT_SUCCESS = 'ADD_BULK_CTI_REPORT_SUCCESS'
export const ADD_BULK_CTI_REPORT_FAILED = 'ADD_BULK_CTI_REPORT_FAILED'
export const ADD_BULK_CTI_REPORT_RESET = 'ADD_BULK_CTI_REPORT_RESET'

export const addBulkCtiReport = (body: any, vaultId: number) => async (dispatch: any) => {
  console.log('obj====>', body)
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: ADD_BULK_CTI_REPORT_REQUEST })

  try {
    const { data } = await Axios.post(`${environment.baseUrl}/data/upload-bulk-cti`, body, {
      headers: { Authorization: `${token.bearerToken}`, 'Content-Type': 'multipart/form-data' },
      params: { vaultId: vaultId },
    })
    return dispatch({ type: ADD_BULK_CTI_REPORT_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: ADD_BULK_CTI_REPORT_FAILED, payload: error })
  }
}
