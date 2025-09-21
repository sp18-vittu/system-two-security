import {
  ADD_BULK_CTI_REPORT_FAILED,
  ADD_BULK_CTI_REPORT_REQUEST,
  ADD_BULK_CTI_REPORT_RESET,
  ADD_BULK_CTI_REPORT_SUCCESS,
} from './action'

const initialStateOfBulkCti = {
  bulkSaveDetail: [],
  loading: false,
  errors: {},
}

export const bulkCtiReportReducer = (state = initialStateOfBulkCti, action: any) => {
  switch (action.type) {
    case ADD_BULK_CTI_REPORT_REQUEST:
    case ADD_BULK_CTI_REPORT_SUCCESS:
      return {
        bulkSaveDetail: action.payload,
        loading: false,
        errors: {},
      }
    case ADD_BULK_CTI_REPORT_FAILED:
      return {
        bulkSaveDetail: [],
        loading: false,
        errors: action.payload,
      }
    case ADD_BULK_CTI_REPORT_RESET:
      return {}
    default:
      return state
  }
}
