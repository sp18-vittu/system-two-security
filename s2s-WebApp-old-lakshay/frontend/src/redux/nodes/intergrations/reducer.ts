import {
  CREATE_CONNECTOR_SUCCESS,
  CREATE_CONNECTOR_FAILED,
  EXECUTE_CONNECTOR_SUCCESS,
  EXECUTE_CONNECTOR_FAILED,
  IMPORT_CONNECTOR_MODULE_SUCCESS,
  IMPORT_CONNECTOR_MODULE_FAILED,
  LOAD_CONNECTOR_MODULE_SUCCESS,
  LOAD_CONNECTOR_MODULE_FAILED,
  LOAD_MODULE_DOCUMENTS_SUCCESS,
  LOAD_MODULE_DOCUMENTS_FAILED,
  LOAD_DATA,
} from './actions'

const initialState = {
  loading: false,
  errors: {},
}

const reducer = (state = initialState, action: { type: any; payload: any }) => {
  switch (action.type) {
    case LOAD_DATA:
      return {
        loading: true,
        ...state,
      }
    case CREATE_CONNECTOR_SUCCESS:
      return {
        loading: false,
        errors: {},
      }
    case CREATE_CONNECTOR_FAILED:
      return {
        loading: false,
        errors: action.payload,
      }
    case EXECUTE_CONNECTOR_SUCCESS:
      return {
        loading: false,
        errors: {},
      }
    case EXECUTE_CONNECTOR_FAILED:
      return {
        loading: false,
        errors: action.payload,
      }
    case IMPORT_CONNECTOR_MODULE_SUCCESS:
      return {
        loading: false,
        modules: action.payload,
      }
    case IMPORT_CONNECTOR_MODULE_FAILED:
      return {
        loading: false,
        errors: {},
        modules: action.payload,
      }
    case LOAD_CONNECTOR_MODULE_SUCCESS:
      return {
        loading: false,
        modules: action.payload.objects,
      }
    case LOAD_CONNECTOR_MODULE_FAILED:
      return {
        loading: false,
        errors: {},
        modules: [],
      }
    case LOAD_MODULE_DOCUMENTS_SUCCESS:
      return {
        loading: false,
        errors: {},
        documents: action.payload,
      }
    case LOAD_MODULE_DOCUMENTS_FAILED:
      return {
        loading: false,
        errors: 'Failed to load documents',
        modules: [],
      }
    default:
      return state
  }
}

export default reducer
