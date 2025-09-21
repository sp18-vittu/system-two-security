import Axios from 'axios'
import { environment } from '../../../environment/environment'
import local from '../../../utils/local'

export const INSPECT_GENERATED_SIGMA_iD_REQUEST = 'INSPECT_GENERATED_SIGMA_iD_REQUEST'
export const INSPECT_GENERATED_SIGMA_iD_SUCCESS = 'INSPECT_GENERATED_SIGMA_iD_SUCCESS'
export const INSPECT_GENERATED_SIGMA_iD_FAILED = 'INSPECT_GENERATED_SIGMA_iD_FAILED'
export const INSPECT_GENERATED_SIGMA_iD_RESET = 'INSPECT_GENERATED_SIGMA_iD_RESET'

export const INSPECT_FACTORY_SIGMA_iD_REQUEST = 'INSPECT_FACTORY_SIGMA_iD_REQUEST'
export const INSPECT_FACTORY_SIGMA_iD_SUCCESS = 'INSPECT_FACTORY_SIGMA_iD_SUCCESS'
export const INSPECT_FACTORY_SIGMA_iD_FAILED = 'INSPECT_FACTORY_SIGMA_iD_FAILED'
export const INSPECT_FACTORY_SIGMA_iD_RESET = 'INSPECT_FACTORY_SIGMA_iD_RESET'

export const INSPECT_CTI_URL_REQUEST = 'INSPECT_CTI_URL_REQUEST'
export const INSPECT_CTI_URL_SUCCESS = 'INSPECT_CTI_URL_SUCCESS'
export const INSPECT_CTI_URL_FAILED = 'INSPECT_CTI_URL_FAILED'
export const INSPECT_CTI_URL_RESET = 'INSPECT_CTI_URL_RESET'

export const INSPECT_CTI_SECTION_REQUEST = 'INSPECT_CTI_SECTION_REQUEST'
export const INSPECT_CTI_SECTION_SUCCESS = 'INSPECT_CTI_SECTION_SUCCESS'
export const INSPECT_CTI_SECTION_FAILED = 'INSPECT_CTI_SECTIONL_FAILED'
export const INSPECT_CTI_SECTION_RESET = 'INSPECT_CTI_SECTION_RESET'

export const inspectGeneratedSigmaId = (id: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({
    type: INSPECT_GENERATED_SIGMA_iD_REQUEST,
  })
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/opensearch/get-generated-sigma-for-sigma-id/`,
      id,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({ type: INSPECT_GENERATED_SIGMA_iD_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: INSPECT_GENERATED_SIGMA_iD_FAILED, payload: error.message })
  }
}

export const inspectFactorySigmaId = (id: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({
    type: INSPECT_FACTORY_SIGMA_iD_REQUEST,
  })
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/opensearch/get-factory-sigma-for-sigma-id/`,
      id,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({ type: INSPECT_FACTORY_SIGMA_iD_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: INSPECT_FACTORY_SIGMA_iD_FAILED, payload: error.message })
  }
}

export const inspectUrlSigmaId = (id: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({
    type: INSPECT_CTI_URL_REQUEST,
  })
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/opensearch/get-cti-for-url/`,
      { url: id },
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({ type: INSPECT_CTI_URL_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: INSPECT_CTI_URL_FAILED, payload: error.message })
  }
}

export const inspectCtiSectionId = (id: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({
    type: INSPECT_CTI_SECTION_REQUEST,
  })
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/opensearch/get-cti-for-cti-section/`,
      id,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({ type: INSPECT_CTI_SECTION_SUCCESS, payload: data })
  } catch (error: any) {
    return dispatch({ type: INSPECT_CTI_SECTION_FAILED, payload: error.message })
  }
}
