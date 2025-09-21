import Axios from 'axios'
import local from '../../../utils/local'
import { environment } from '../../../environment/environment'
import api from '../api'

export const GET_THREAT_BRIEF_REQUEST = 'GET_THREAT_BRIEF_REQUEST'
export const GET_THREAT_BRIEF_SUCCESS = 'GET_THREAT_BRIEF_SUCCESS'
export const GET_THREAT_BRIEF_FAILURE = 'GET_THREAT_BRIEF_FAILURE'
export const GET_THREAT_BRIEF_RESET = 'GET_THREAT_BRIEF_REQUEST'

export const GET_THREAT_BRIEF_SUMMARY_REQUEST = 'GET_THREAT_BRIEF_SUMMARY_REQUEST'
export const GET_THREAT_BRIEF_SUMMARY_SUCCESS = 'GET_THREAT_BRIEF_SUMMARY_SUCCESS'
export const GET_THREAT_BRIEF_SUMMARY_FAILURE = 'GET_THREAT_BRIEF_SUMMARY_FAILURE'
export const GET_THREAT_BRIEF_SUMMARY_RESET = 'GET_THREAT_BRIEF_SUMMARY_RESET'

export const GET_THREATBRIEF_AOD_PACKAGE_REQUEST = 'GET_THREATBRIEF_AOD_PACKAGE_REQUEST'
export const GET_THREATBRIEF_AOD_PACKAGE_SUCCESS = 'GET_THREATBRIEF_AOD_PACKAGE_SUCCESS'
export const GET_THREATBRIEF_AOD_PACKAGE_FAILURE = 'GET_THREATBRIEF_AOD_PACKAGE_FAILURE'
export const GET_THREATBRIEF_AOD_PACKAGE_RESET = 'GET_THREATBRIEF_AOD_PACKAGE_RESET'

export const getAllThreatbrief = () => async (dispatch: any) => {
  const token = JSON.parse(local.getItem('bearerToken') as any)
  dispatch({ type: GET_THREAT_BRIEF_REQUEST })
  try {
    const { data } = await api.get(`/data/threatbriefs`, {
      headers: { Authorization: token.bearerToken },
    })
    return dispatch({ type: GET_THREAT_BRIEF_SUCCESS, payload: data })
  } catch (err: any) {
    return dispatch({ type: GET_THREAT_BRIEF_FAILURE, payload: err })
  }
}

export const getThreatBriefSummary = (id: any) => async (dispatch: any) => {
  const token = JSON.parse(local.getItem('bearerToken') as any)
  dispatch({ type: GET_THREAT_BRIEF_SUMMARY_REQUEST })
  try {
    const { data } = await api.get(`/data/threatbriefs/${id}/summary`, {
      headers: {
        Authorization: token.bearerToken,
        'Content-Type': 'application/json',
      },
    })
    return dispatch({ type: GET_THREAT_BRIEF_SUMMARY_SUCCESS, payload: data })
  } catch (err: any) {
    return dispatch({ type: GET_THREAT_BRIEF_SUMMARY_FAILURE, payload: err })
  }
}

export const downloadThreatAODPackage = (id: any) => async (dispatch: any) => {
  const token = JSON.parse(local.getItem('bearerToken') as any)

  dispatch({ type: GET_THREATBRIEF_AOD_PACKAGE_REQUEST })
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/threatbriefs/${id}/aod-package`,
      {},
      {
        responseType: 'blob',
        headers: {
          Authorization: `${token.bearerToken}`,
          'Content-Type': 'application/octet-stream',
        },
      },
    )

    return dispatch({ type: GET_THREATBRIEF_AOD_PACKAGE_SUCCESS, payload: data })
  } catch (err: any) {
    return dispatch({ type: GET_THREATBRIEF_AOD_PACKAGE_FAILURE, payload: err })
  }
}
