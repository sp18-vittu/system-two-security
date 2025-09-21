import Axios from 'axios'
import local from '../../../utils/local'
import { environment } from '../../../environment/environment'
import api from '../api'

export const COLLECTION_POST_REQUEST = 'COLLECTION_POST_REQUEST'
export const COLLECTION_POST_SUCCESS = 'COLLECTION_POST_SUCCESS'
export const COLLECTION_POST_FAILED = 'COLLECTION_POST_FAILED'
export const COLLECTION_POST_RESET = 'COLLECTION_POST_RESET'

export const COLLECTION_COPY_POST_REQUEST = 'COLLECTION_COPY_POST_REQUEST'
export const COLLECTION_COPY_POST_SUCCESS = 'COLLECTION_COPY_POST_SUCCESS'
export const COLLECTION_COPY_POST_FAILED = 'COLLECTION_COPY_POST_FAILED'
export const COLLECTION_COPY_POST_RESET = 'COLLECTION_COPY_POST_RESET'

export const MULTIPLE_COLLECTION_COPY_POST_REQUEST = 'MULTIPLE_COLLECTION_COPY_POST_REQUEST'
export const MULTIPLE_COLLECTION_COPY_POST_SUCCESS = 'MULTIPLE_COLLECTION_COPY_POST_SUCCESS'
export const MULTIPLE_COLLECTION_COPY_POST_FAILED = 'MULTIPLE_COLLECTION_COPY_POST_FAILED'
export const MULTIPLE_COLLECTION_COPY_POST_RESET = 'COLLECTION_COPY_POST_RESET'

export const COLLECTION_TO_COLLECTION_MOVE_POST_REQUEST =
  'COLLECTION_TO_COLLECTION_MOVE_POST_REQUEST'
export const COLLECTION_TO_COLLECTION_MOVE_POST_SUCCESS =
  'COLLECTION_TO_COLLECTION_MOVE_POST_SUCCESS'
export const COLLECTION_TO_COLLECTION_MOVE_POST_FAILED = 'COLLECTION_TO_COLLECTION_MOVE_POST_FAILED'
export const COLLECTION_TO_COLLECTION_MOVE_POST_RESET = 'COLLECTION_TO_COLLECTION_MOVE_POST_RESET'

export const MULTIPLE_COLLECTION_TO_COLLECTION_MOVE_POST_REQUEST =
  'MULTIPLE_COLLECTION_TO_COLLECTION_MOVE_POST_REQUEST'
export const MULTIPLE_COLLECTION_TO_COLLECTION_MOVE_POST_SUCCESS =
  'MULTIPLE_COLLECTION_TO_COLLECTION_MOVE_POST_SUCCESS'
export const MULTIPLE_COLLECTION_TO_COLLECTION_MOVE_POST_FAILED =
  'MULTIPLE_COLLECTION_TO_COLLECTION_MOVE_POST_FAILED'
export const MULTIPLE_COLLECTION_TO_COLLECTION_MOVE_POST_RESET =
  'MULTIPLE_COLLECTION_TO_COLLECTION_MOVE_POST_RESET'

export const THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_REQUEST =
  'THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_REQUEST'
export const THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS =
  'THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS'
export const THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_FAILED =
  'THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_FAILED'
export const THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_RESET =
  'THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_RESET'

export const COLLECTION_TO_COLLECTION_COPY_POST_REQUEST =
  'COLLECTION_TO_COLLECTION_COPY_POST_REQUEST'
export const COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS =
  'COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS'
export const COLLECTION_TO_COLLECTION_COPY_POST_FAILED = 'COLLECTION_TO_COLLECTION_COPY_POST_FAILED'
export const COLLECTION_TO_COLLECTION_COPY_POST_RESET = 'COLLECTION_TO_COLLECTION_COPY_POST_RESET'

export const MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_REQUEST =
  'MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_REQUEST'
export const MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS =
  'MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS'
export const MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_FAILED =
  'MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_FAILED'
export const MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_RESET =
  'MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_RESET'

export const COLLECTION_PUT_REQUEST = 'COLLECTION_PUT_REQUEST'
export const COLLECTION_PUT_SUCCESS = 'COLLECTION_PUT_SUCCESS'
export const COLLECTION_PUT_FAILED = 'COLLECTION_PUT_FAILED'
export const COLLECTION_PUT_RESET = 'COLLECTION_POST_RESET'

export const COLLECTION_GET_REQUEST = 'COLLECTION_GET_REQUEST'
export const COLLECTION_GET_SUCCESS = 'COLLECTION_GET_SUCCESS'
export const COLLECTION_GET_FAILED = 'COLLECTION_GET_FAILED'
export const COLLECTION_GET_RESET = 'COLLECTION_GET_RESET'

export const INBOX_COLLECTION_GET_REQUEST = 'INBOX_COLLECTION_GET_REQUEST'
export const INBOX_COLLECTION_GET_SUCCESS = 'INBOX_COLLECTION_GET_SUCCESS'
export const INBOX_COLLECTION_GET_FAILED = 'INBOX_COLLECTION_GET_FAILED'
export const INBOX_COLLECTION_GET_RESET = 'INBOX_COLLECTION_GET_RESET'

export const COLLECTION_DELETE_REQUEST = 'COLLECTION_DELETE_REQUEST'
export const COLLECTION_DELETE_SUCCESS = 'COLLECTION_DELETE_SUCCESS'
export const COLLECTION_DELETE_FAILED = 'COLLECTION_DELETE_FAILED'
export const COLLECTION_DELETE_RESET = 'COLLECTION_DELETE_RESET'

export const COLLECTION_RULE_DELETE_REQUEST = 'COLLECTION_RULE_DELETE_REQUEST'
export const COLLECTION_RULE_DELETE_SUCCESS = 'COLLECTION_RULE_DELETE_SUCCESS'
export const COLLECTION_RULE_DELETE_FAILED = 'COLLECTION_RULE_DELETE_FAILED'
export const COLLECTION_RULE_DELETE_RESET = 'COLLECTION_RULE_DELETE_RESET'

export const COLLECTION_RULE_MULTIPLE_DELETE_REQUEST = 'COLLECTION_RULE_MULTIPLE_DELETE_REQUEST'
export const COLLECTION_RULE_MULTIPLE_DELETE_SUCCESS = 'COLLECTION_RULE_MULTIPLE_DELETE_SUCCESS'
export const COLLECTION_RULE_MULTIPLE_DELETE_FAILED = 'COLLECTION_RULE_MULTIPLE_DELETE_FAILED'
export const COLLECTION_RULE_MULTIPLE_DELETE_RESET = 'COLLECTION_RULE_MULTIPLE_DELETE_RESET'

export const COLLECTION_ID_GET_REQUEST = 'COLLECTION_ID_GET_REQUEST'
export const COLLECTION_ID_GET_SUCCESS = 'COLLECTION_ID_GET_SUCCESS'
export const COLLECTION_ID_GET_FAILED = 'COLLECTION_ID_GET_FAILED'
export const COLLECTION_ID_GET_RESET = 'COLLECTION_ID_GET_RESET'

export const ALL_RULE_GET_REQUEST = 'ALL_RULE_GET_REQUEST'
export const ALL_RULE_GET_SUCCESS = 'ALL_RULE_GET_SUCCESS'
export const ALL_RULE_GET_FAILED = 'ALL_RULE_GET_FAILED'
export const ALL_RULE_GET_RESET = 'COLLECTION_GET_RESET'

export const UPDATE_YAML_FILE_REQUEST = 'UPDATE_YAML_FILE_REQUEST'
export const UPDATE_YAML_FILE_SUCCESS = 'UPDATE_YAML_FILE_SUCCESS'
export const UPDATE_YAML_FILE_FAILED = 'UPDATE_YAML_FILE_FAILED'
export const UPDATE_YAML_FILE_RESET = 'UPDATE_YAML_FILET_RESET'

export const UPDATE_YAML_MULTI_FILE_REQUEST = 'UPDATE_YAML_MULTI_FILE_REQUEST'
export const UPDATE_YAML_MULTI_FILE_SUCCESS = 'UPDATE_YAML_MULTI_FILE_SUCCESS'
export const UPDATE_YAML_MULTI_FILE_FAILED = 'UPDATE_YAML_MULTI_FILE_FAILED'
export const UPDATE_YAML_MULTI_FILE_RESET = 'UPDATE_YAML_MULTI_FILET_RESET'

export const VALIDATION_YAML_FILE_REQUEST = 'VALIDATION_YAML_FILE_REQUEST'
export const VALIDATION_YAML_FILE_SUCCESS = 'VALIDATION_YAML_FILE_SUCCESS'
export const VALIDATION_YAML_FILE_FAILED = 'VALIDATION_YAML_FILE_FAILED'
export const VALIDATION_YAML_FILE_RESET = 'VALIDATION_YAML_FILET_RESET'

export const FILE_LOCK_POST_REQUEST = 'FILE_LOCK_POST_REQUEST'
export const FILE_LOCK_POST_SUCCESS = 'FILE_LOCK_POST_SUCCESS'
export const FILE_LOCK_POST_FAILED = 'FILE_LOCK_POST_FAILED'
export const FILE_LOCK_POST_RESET = 'FILE_LOCK_POST_RESET'

export const FILE_UNLOCK_POST_REQUEST = 'FILE_UNLOCK_POST_REQUEST'
export const FILE_UNLOCK_POST_SUCCESS = 'FILE_UNLOCK_POST_SUCCESS'
export const FILE_UNLOCK_POST_FAILED = 'FILE_UNLOCK_POST_FAILED'
export const FILE_UNLOCK_POST_RESET = 'FILE_UNLOCK_POST_RESET'

export const FILE_LOCK_STATUS_POST_REQUEST = 'FILE_LOCK_STATUS_POST_REQUEST'
export const FILE_LOCK_STATUS_POST_SUCCESS = 'FILE_LOCK_STATUS_POST_SUCCESS'
export const FILE_LOCK_STATUS_POST_FAILED = 'FILE_LOCK_STATUS_POST_FAILED'
export const FILE_LOCK_STATUS_POST_RESET = 'FILE_LOCK_STATUS_POST_RESET'

export const CollectiondataPost = (colldata: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: COLLECTION_POST_REQUEST })
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/data/collection`, colldata, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: COLLECTION_POST_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: COLLECTION_POST_FAILED, payload: message })
  }
}

export const CollectiondataCopyPost =
  (collectionId: any, ctiId: any, docIds: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: COLLECTION_COPY_POST_REQUEST })
    try {
      const { data } = await Axios.post(
        `${environment.baseUrl}/data/collection/${collectionId}/${ctiId}/addRule`,
        docIds,
        {
          headers: { Authorization: `${token.bearerToken}` },
        },
      )
      return dispatch({
        type: COLLECTION_COPY_POST_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      return dispatch({ type: COLLECTION_COPY_POST_FAILED, payload: message })
    }
  }

export const CollectiondataMultipleCopyPost =
  (ctiId: any, collectionId: any, docIds: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: MULTIPLE_COLLECTION_COPY_POST_REQUEST })
    try {
      const { data } = await Axios.post(
        `${environment.baseUrl}/data/collection/${ctiId}/addRule?collectionIds=${collectionId}`,
        docIds,
        {
          headers: { Authorization: `${token.bearerToken}` },
        },
      )
      return dispatch({
        type: MULTIPLE_COLLECTION_COPY_POST_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      return dispatch({ type: MULTIPLE_COLLECTION_COPY_POST_FAILED, payload: message })
    }
  }

export const CollectiondtoCollectionMovePost =
  (fromid: any, toid: any, docIds: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: COLLECTION_TO_COLLECTION_MOVE_POST_REQUEST })
    try {
      const { data } = await Axios.post(
        `${environment.baseUrl}/data/collection/${fromid}/${toid}/moveRule`,
        docIds,
        {
          headers: { Authorization: `${token.bearerToken}` },
        },
      )
      return dispatch({
        type: COLLECTION_TO_COLLECTION_MOVE_POST_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      return dispatch({ type: COLLECTION_TO_COLLECTION_MOVE_POST_FAILED, payload: message })
    }
  }

export const CollectiondtoCollectionCopyPost =
  (fromid: any, toid: any, docIds: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: COLLECTION_TO_COLLECTION_COPY_POST_REQUEST })
    try {
      const { data } = await Axios.post(
        `${environment.baseUrl}/data/collection/${fromid}/${toid}/copyRule`,
        docIds,
        {
          headers: { Authorization: `${token.bearerToken}` },
        },
      )
      return dispatch({
        type: COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      return dispatch({ type: COLLECTION_TO_COLLECTION_COPY_POST_FAILED, payload: message })
    }
  }

export const CollectiondtoCollectionMultipleCopyPost =
  (fromid: any, toid: any, docIds: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_REQUEST })
    try {
      const { data } = await Axios.post(
        `${environment.baseUrl}/data/collection/${fromid}/copyRule?toCollectionIds=${toid}`,
        docIds,
        {
          headers: { Authorization: `${token.bearerToken}` },
        },
      )
      return dispatch({
        type: MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      return dispatch({
        type: MULTIPLE_COLLECTION_TO_COLLECTION_COPY_POST_FAILED,
        payload: message,
      })
    }
  }

export const CollectiondtoCollectionMultipleMovePost =
  (fromid: any, toid: any, docIds: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: MULTIPLE_COLLECTION_TO_COLLECTION_MOVE_POST_REQUEST })
    try {
      const { data } = await Axios.post(
        `${environment.baseUrl}/data/collection/${fromid}/moveRule?toCollectionIds=${toid}`,
        docIds,
        {
          headers: { Authorization: `${token.bearerToken}` },
        },
      )
      return dispatch({
        type: MULTIPLE_COLLECTION_TO_COLLECTION_MOVE_POST_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      return dispatch({
        type: MULTIPLE_COLLECTION_TO_COLLECTION_MOVE_POST_FAILED,
        payload: message,
      })
    }
  }

export const CollectiondtoCollectionThreatbreifPost =
  (collectionIds: any, docIds: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_REQUEST })
    try {
      const { data } = await Axios.post(
        `${environment.baseUrl}/data/collection/addGlobalRule?collectionIds=${collectionIds}`,
        docIds,
        {
          headers: { Authorization: `${token.bearerToken}` },
        },
      )
      return dispatch({
        type: THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      return dispatch({
        type: THREAT_BREIF_COLLECTION_TO_COLLECTION_COPY_POST_FAILED,
        payload: message,
      })
    }
  }

export const CollectiondataPut = (collectionId: any, colldata: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: COLLECTION_PUT_REQUEST })
  try {
    const { data } = await Axios.put(
      `${environment.baseUrl}/data/collection/${collectionId}`,
      colldata,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({
      type: COLLECTION_PUT_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: COLLECTION_PUT_FAILED, payload: message })
  }
}

export const CollectiondataDelete = (collectionId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: COLLECTION_DELETE_REQUEST })
  try {
    const { data } = await Axios.delete(`${environment.baseUrl}/data/collection/${collectionId}`, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: COLLECTION_DELETE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: COLLECTION_DELETE_FAILED, payload: message })
  }
}

export const CollectionruleDelete = (collectionId: any, ruleId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: COLLECTION_RULE_DELETE_REQUEST })
  try {
    const { data } = await Axios.delete(
      `${environment.baseUrl}/data/collection/${collectionId}/rule/${ruleId}`,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({
      type: COLLECTION_RULE_DELETE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: COLLECTION_RULE_DELETE_FAILED, payload: message })
  }
}

export const CollectioMultipleDelete =
  (collectionId: any, ruleId: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: COLLECTION_RULE_MULTIPLE_DELETE_REQUEST })
    try {
      const { data } = await Axios.post(
        `${environment.baseUrl}/data/collection/${collectionId}/rule`,
        ruleId,
        {
          headers: { Authorization: `${token.bearerToken}` },
        },
      )
      return dispatch({
        type: COLLECTION_RULE_MULTIPLE_DELETE_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      return dispatch({ type: COLLECTION_RULE_MULTIPLE_DELETE_FAILED, payload: message })
    }
  }

export const getallCollection = () => async (dispatch: any, getState: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: COLLECTION_GET_REQUEST })
  try {
    const { data } = await api.get(`/data/collection`, {
      headers: { Authorization: `${token.bearerToken}` },
    })

    return dispatch({ type: COLLECTION_GET_SUCCESS, payload: data })
  } catch (error: any) {
    dispatch({ type: COLLECTION_GET_FAILED, payload: error.message })
  }
}

export const getinboxCollection = () => async (dispatch: any, getState: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: INBOX_COLLECTION_GET_REQUEST })
  try {
    const { data } = await api.get(`/data/collection/inbox`, {
      headers: { Authorization: `${token.bearerToken}` },
    })

    return dispatch({ type: INBOX_COLLECTION_GET_SUCCESS, payload: data })
  } catch (error: any) {
    dispatch({ type: INBOX_COLLECTION_GET_FAILED, payload: error.message })
  }
}

export const getallRuleFiles = () => async (dispatch: any, getState: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: ALL_RULE_GET_REQUEST })
  try {
    const { data } = await api.get(`/data/collection/rule`, {
      headers: { Authorization: `${token.bearerToken}` },
    })

    return dispatch({ type: ALL_RULE_GET_SUCCESS, payload: data })
  } catch (error: any) {
    dispatch({ type: ALL_RULE_GET_FAILED, payload: error.message })
  }
}

export const getcollectionidRuleFiles =
  (collectionId: any) => async (dispatch: any, getState: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: COLLECTION_ID_GET_REQUEST })
    try {
      const { data } = await api.get(`/data/collection/${collectionId}/rule`, {
        headers: { Authorization: `${token.bearerToken}` },
      })

      return dispatch({ type: COLLECTION_ID_GET_SUCCESS, payload: data })
    } catch (error: any) {
      dispatch({ type: COLLECTION_ID_GET_FAILED, payload: error.message })
    }
  }

export const yamlFileUpdate =
  (collectionId: any, docIdId: any, files: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: UPDATE_YAML_FILE_REQUEST })
    try {
      const { data } = await Axios.put(
        `${environment.baseUrl}/data/collection/${collectionId}/rule/${docIdId}`,
        files,
        {
          headers: { Authorization: `${token.bearerToken}`, 'Content-Type': 'multipart/form-data' },
        },
      )
      return dispatch({
        type: UPDATE_YAML_FILE_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      return dispatch({ type: UPDATE_YAML_FILE_FAILED, payload: message })
    }
  }

export const workbenchyamlFileUpdate =
  (collectionId: any, sessionId: any, files: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: UPDATE_YAML_FILE_REQUEST })
    try {
      const { data } = await Axios.post(
        `${environment.baseUrl}/data/collection/${collectionId}/${sessionId}/uploadRule`,
        files,
        {
          headers: { Authorization: `${token.bearerToken}`, 'Content-Type': 'multipart/form-data' },
        },
      )
      return dispatch({
        type: UPDATE_YAML_FILE_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      return dispatch({ type: UPDATE_YAML_FILE_FAILED, payload: message })
    }
  }

export const workbenchMultiyamlFileUpdate =
  (collectionId: any, sessionId: any, files: any) => async (dispatch: any) => {
    const localStorage = local.getItem('bearerToken')
    const token = JSON.parse(localStorage as any)
    dispatch({ type: UPDATE_YAML_MULTI_FILE_REQUEST })
    try {
      const { data } = await Axios.post(
        `${environment.baseUrl}/data/collection/${collectionId}/${sessionId}/uploadRules`,
        files,
        {
          headers: { Authorization: `${token.bearerToken}`, 'Content-Type': 'multipart/form-data' },
        },
      )
      return dispatch({
        type: UPDATE_YAML_MULTI_FILE_SUCCESS,
        payload: data,
      })
    } catch (error: any) {
      const message =
        error.response && error.response.data.message ? error.response.data.message : error.message
      return dispatch({ type: UPDATE_YAML_MULTI_FILE_FAILED, payload: message })
    }
  }

export const yamlFileValidation = (files: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: VALIDATION_YAML_FILE_REQUEST })
  try {
    const { data } = await Axios.post(`${environment.baseUrl}/data/document/validate`, files, {
      headers: { Authorization: `${token.bearerToken}` },
    })
    return dispatch({
      type: VALIDATION_YAML_FILE_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: VALIDATION_YAML_FILE_FAILED, payload: message })
  }
}

export const fileLocksUpdate = (docIdId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: FILE_LOCK_POST_REQUEST })
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/document/lock/${docIdId}`,
      null,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({
      type: FILE_LOCK_POST_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: FILE_LOCK_POST_FAILED, payload: message })
  }
}

export const fileUnLocksUpdate = (docIdId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: FILE_UNLOCK_POST_REQUEST })
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/document/unlock/${docIdId}`,
      null,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({
      type: FILE_UNLOCK_POST_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: FILE_UNLOCK_POST_FAILED, payload: message })
  }
}

export const fileStatusLocksUpdate = (docIdId: any) => async (dispatch: any) => {
  const localStorage = local.getItem('bearerToken')
  const token = JSON.parse(localStorage as any)
  dispatch({ type: FILE_LOCK_STATUS_POST_REQUEST })
  try {
    const { data } = await Axios.post(
      `${environment.baseUrl}/data/document/lock-status/${docIdId}`,
      null,
      {
        headers: { Authorization: `${token.bearerToken}` },
      },
    )
    return dispatch({
      type: FILE_LOCK_STATUS_POST_SUCCESS,
      payload: data,
    })
  } catch (error: any) {
    const message =
      error.response && error.response.data.message ? error.response.data.message : error.message
    return dispatch({ type: FILE_LOCK_STATUS_POST_FAILED, payload: message })
  }
}
