import Synth, { Prompt } from 'synth'
import local from '../../../utils/local'

export const CREATE_CONNECTOR_SUCCESS = 'CREATE_CONNECTOR_SUCCESS'
export const CREATE_CONNECTOR_FAILED = 'CREATE_CONNECTOR_FAILED'
export const EXECUTE_CONNECTOR_SUCCESS = 'EXECUTE_CONNECTOR_SUCCESS'
export const EXECUTE_CONNECTOR_FAILED = 'EXECUTE_CONNECTOR_FAILED'
export const IMPORT_CONNECTOR_MODULE_SUCCESS = 'IMPORT_CONNECTOR_MODULE_SUCCESS'
export const IMPORT_CONNECTOR_MODULE_FAILED = 'IMPORT_CONNECTOR_MODULE_FAILED'
export const LOAD_CONNECTOR_MODULE_SUCCESS = 'LOAD_CONNECTOR_MODULE_SUCCESS'
export const LOAD_CONNECTOR_MODULE_FAILED = 'LOAD_CONNECTOR_MODULE_FAILED'
export const LOAD_MODULE_DOCUMENTS_SUCCESS = 'LOAD_MODULE_DOCUMENTS_SUCCESS'
export const LOAD_MODULE_DOCUMENTS_FAILED = 'LOAD_MODULE_DOCUMENTS_FAILED'
export const UPLOAD_FILE_SUCESS = 'UPLOAD_FILE_SUCESS'
export const LOAD_DATA = 'LOAD_DATA'

export const createConnector = (credentials: any, callback: Function) => {
  return (dispatch: any) => {
    return Synth.connectors
      .createConnector(credentials)
      .then((response: any) => {
        local.setItem('auth_token', response.token)
        dispatch({ type: CREATE_CONNECTOR_SUCCESS, payload: response })
        callback(response.salesforceLoginUrl)
      })
      .catch((error: any) => {
        dispatch({ type: CREATE_CONNECTOR_FAILED, payload: error })
      })
  }
}

export const executeConnector = (userData: any) => {
  return (dispatch: any) => {
    return Synth.connectors
      .executeFlow(userData)
      .then((response: any) => {
        local.setItem('auth_token', response.token)
        dispatch({ type: EXECUTE_CONNECTOR_SUCCESS, payload: response })
      })
      .catch((error: any) => {
        dispatch({ type: EXECUTE_CONNECTOR_FAILED, payload: error })
      })
  }
}

export const fetchModules = (connectionProfileName: string) => {
  return (dispatch: any) => {
    dispatch({ type: LOAD_DATA })
    return Synth.connectors
      .getModules({ connectionProfileName })
      .then((response: any) => {
        dispatch({ type: IMPORT_CONNECTOR_MODULE_SUCCESS, payload: response })
      })
      .catch((error: any) => {
        dispatch({ type: IMPORT_CONNECTOR_MODULE_FAILED, payload: error })
      })
  }
}

export const imporModules = (req: any) => {
  return (dispatch: any) => {
    return Synth.connectors
      .importModule(req)
      .then((response: any) => {
        dispatch({ type: IMPORT_CONNECTOR_MODULE_SUCCESS, payload: response })
        Synth.connectors.executeFlow({ flowName: req.flowName })
      })
      .catch((error: any) => {
        dispatch({ type: IMPORT_CONNECTOR_MODULE_FAILED, payload: error })
      })
  }
}

export const fetchDocuments = (req: any) => {
  return (dispatch: any) => {
    dispatch({ type: LOAD_DATA })
    return Synth.connectors
      .getDocuments(req)
      .then((response: any) => {
        dispatch({ type: LOAD_MODULE_DOCUMENTS_SUCCESS, payload: response })
      })
      .catch((error: any) => {
        dispatch({ type: LOAD_MODULE_DOCUMENTS_FAILED, payload: error })
      })
  }
}

export const uploadPdf = (req: any, callback: Function) => {
  return (dispatch: any) => {
    return Prompt.prompter
      .uploadPdf(req)
      .then((response: any) => {
        dispatch({ type: UPLOAD_FILE_SUCESS, payload: response }).then(() => {
          callback()
        })
      })
      .catch(() => {
        callback()
      })
  }
}

export default {
  createConnector,
  executeConnector,
  imporModules,
  fetchModules,
  fetchDocuments,
  uploadPdf,
}
