import Axios from 'axios'
import local from '../../../utils/local'
import { environment } from '../../../environment/environment'
import api from '../api'

export const TARGETS_FILE_REQUEST = ' TARGETS_FILE_REQUEST'
export const TARGETS_FILE_SUCCESS = 'TARGETS_FILE_SUCCESS'
export const TARGETS_FILE_FAILED = 'TARGETS_FILE__FAILED'
export const TARGETS_FILE_RESET = 'TARGETS_FILE__RESET'

export const BULK_TRANSLATE_FILE_REQUEST = ' BULK_TRANSLATE_FILE_REQUEST'
export const BULK_TRANSLATE_FILE_SUCCESS = 'BULK_TRANSLATE_FILE_SUCCESS'
export const BULK_TRANSLATE_FILE_FAILED = 'BULK_TRANSLATE_FILE_FAILED'
export const BULK_TRANSLATE_FILE_RESET = 'BULK_TRANSLATE_FILE_RESET'

export const SINGLE_TRANSLATE_FILE_REQUEST = ' SINGLE_TRANSLATE_FILE_REQUEST'
export const SINGLE_TRANSLATE_FILE_SUCCESS = 'SINGLE_TRANSLATE_FILE_SUCCESS'
export const SINGLE_TRANSLATE_FILE_FAILED = 'SINGLE_TRANSLATE_FILE_FAILED'
export const SINGLE_TRANSLATE_FILE_RESET = 'SINGLE_TRANSLATE_FILE_RESET'

export const CTI_BULK_TRANSLATE_FILE_REQUEST = 'CTI_BULK_TRANSLATE_FILE_REQUEST'
export const CTI_BULK_TRANSLATE_FILE_SUCCESS = 'CTI_BULK_TRANSLATE_FILE_SUCCESS'
export const CTI_BULK_TRANSLATE_FILE_FAILED = 'CTI_BULK_TRANSLATE_FILE_FAILED'
export const CTI_BULK_TRANSLATE_FILE_RESET = 'CTI_BULK_TRANSLATE_FILE_RESET'

export const CTI_REP_BULK_TRANSLATE_FILE_REQUEST = 'CTI_BULK_TRANSLATE_FILE_REQUEST'
export const CTI_REP_BULK_TRANSLATE_FILE_SUCCESS = 'CTI_REP_BULK_TRANSLATE_FILE_SUCCESS'
export const CTI_REP_BULK_TRANSLATE_FILE_FAILED = 'CTI_REP_BULK_TRANSLATE_FILE_FAILED'
export const CTI_REP_BULK_TRANSLATE_FILE_RESET = 'CTI_REP_BULK_TRANSLATE_FILE_RESET'

export const GET_EXECUTE_QUERY_REQUEST = 'GET_EXECUTE_QUERY_REQUEST'
export const GET_EXECUTE_QUERY_SUCCESS = 'GET_EXECUTE_QUERY_SUCCESS'
export const GET_EXECUTE_QUERY_FAILED = 'GET_EXECUTE_QUERY_FAILED'
export const GET_EXECUTE_QUERY_RESET = 'GET_EXECUTE_QUERY_RESET'

export const TargetFileList = () => async (dispatch: any, getState: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: TARGETS_FILE_REQUEST })
  try {
    const { data } = await api.get(`/data/pysigma/targets`, {
      headers: { Authorization: `${token.bearerToken}` },
    })

    return dispatch({ type: TARGETS_FILE_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: TARGETS_FILE_FAILED, payload: error.message })
  }
}

export const BulkTranslateFileList =
  (bulckTransalate: any, vault: any) => async (dispatch: any, getState: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: BULK_TRANSLATE_FILE_REQUEST })
    try {
      const { data } = await Axios.post(
        `${environment.baseUrl}/data/pysigma/bulk-translate`,
        bulckTransalate,
        {
          headers: { Authorization: `${token.bearerToken}` },
          params: { global: vault.global },
        },
      )

      return dispatch({ type: BULK_TRANSLATE_FILE_SUCCESS, payload: data })
    } catch (error: any) {
      return dispatch({ type: BULK_TRANSLATE_FILE_FAILED, payload: error.message })
    }
  }

export const SingleTranslateFileList =
  (singleTransalate: any, translatedata: any) => async (dispatch: any, getState: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: SINGLE_TRANSLATE_FILE_REQUEST })
    try {
      const { data } = await Axios.post(
        `${environment.baseUrl}/data/pysigma/translate-and-get-query`,
        singleTransalate,
        {
          headers: { Authorization: `${token.bearerToken}` },
          params: { global: translatedata.global },
        },
      )

      return dispatch({ type: SINGLE_TRANSLATE_FILE_SUCCESS, payload: data })
    } catch (error: any) {
      return dispatch({ type: SINGLE_TRANSLATE_FILE_FAILED, payload: error.message })
    }
  }

export const citBulkTranslateFileList =
  (bulckTransalate: any) => async (dispatch: any, getState: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: CTI_BULK_TRANSLATE_FILE_REQUEST })
    try {
      const { data } = await Axios.post(
        `${environment.baseUrl}/data/pysigma/bulk-translate`,
        bulckTransalate,
        {
          headers: { Authorization: `${token.bearerToken}` },
        },
      )

      return dispatch({ type: CTI_BULK_TRANSLATE_FILE_SUCCESS, payload: data })
    } catch (error: any) {
      return dispatch({ type: CTI_BULK_TRANSLATE_FILE_FAILED, payload: error.message })
    }
  }

export const repBulkTranslateFileList =
  (bulckTransalate: any, bulkdata: any) => async (dispatch: any, getState: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    let params = { ctiId: 15, target: 'splunk' }
    dispatch({ type: CTI_REP_BULK_TRANSLATE_FILE_REQUEST })
    try {
      const { data } = await Axios.post(`${environment.baseUrl}/data/pysigma/translate`, null, {
        params: {
          ctiId: bulckTransalate.ctiId,
          target: bulckTransalate.target,
          global: bulkdata.global,
        },
        headers: { Authorization: `${token.bearerToken}` },
      })

      return dispatch({ type: CTI_REP_BULK_TRANSLATE_FILE_SUCCESS, payload: data })
    } catch (error: any) {
      return dispatch({ type: CTI_REP_BULK_TRANSLATE_FILE_FAILED, payload: error.message })
    }
  }

export const getExecuteQuery = (executeQuery: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: GET_EXECUTE_QUERY_REQUEST })
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/siem/splunk/execute-query`,
      { query: executeQuery?.query },
      {
        responseType: 'blob',
        params: { target: executeQuery?.target },
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({
      type: GET_EXECUTE_QUERY_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: GET_EXECUTE_QUERY_FAILED, payload: message })
  }
}
