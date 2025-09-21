class BaseConfig {
  entityName: any
  loadAllFunc: any
  loadFunc: any
  client: any

  constructor(args: any) {
    this.entityName = args.entityName
    this.loadAllFunc = args.loadAllFunc
    this.loadFunc = args.loadFunc
    this.client = args.client
  }

  static initialState = {
    loading: false,
    errors: {},
    data: [],
    selected: {},
  }

  static TYPES = {
    LOAD: 'LOAD',
    LOAD_ALL: 'LOAD_ALL',
    SEND_QUERY: 'SEND_QUERY',
  }

  get allActions() {
    const { TYPES } = BaseConfig

    return {
      LoadAll: this._genericThunkAction(TYPES.LOAD_ALL),
      Load: this._genericThunkAction(TYPES.LOAD),
      SEND_QUERY: this._genericThunkAction(TYPES.SEND_QUERY),
    }
  }

  get actionTypes() {
    return {
      LOAD_DATA: 'LOAD_DATA',
      LOAD_SUCCESS: `${this.entityName}_LOAD_SUCCESS`,
      LOAD_ALL_SUCCESS: `${this.entityName}_LOAD_ALL_SUCCESS`,
    }
  }

  static successActionTypeFor(type: string, actionTypes: any) {
    const { TYPES } = BaseConfig

    switch (type) {
      case TYPES.LOAD:
        return actionTypes.LOAD_SUCCESS
      case TYPES.LOAD_ALL:
        return actionTypes.LOAD_ALL_SUCCESS
      default:
        throw new Error(`Unkown success type ${type}`)
    }
  }

  apiCallFor(type: string) {
    const { TYPES } = BaseConfig
    switch (type) {
      case TYPES.LOAD_ALL:
        return this.loadAllFunc
      case TYPES.LOAD:
        return this.loadFunc
      default:
        return {}
    }
  }

  successAction(response: any, thunk: any) {
    if (!response) {
      response = {}
    }

    return thunk(response)
  }

  _genericThunkAction(type: any, option = {}) {
    return (...args: any) => {
      return (dispatch: any) => {
        dispatch({ type: 'LOAD_ALL' })
        const apiCall = this.apiCallFor(type)
        return apiCall(...args)
          .then((response: any) => {
            const thunk = this._genericSuccess(type)

            dispatch(this.successAction(response, thunk))

            return response
          })
          .catch((error: any) => {
            // this.genericFailure(error);

            return error
          })
      }
    }
  }

  _genericSuccess(type: any) {
    const { actionTypes } = this

    return (data: any) => {
      return {
        type: BaseConfig.successActionTypeFor(type, actionTypes),
        payload: data,
      }
    }
  }
}

export default BaseConfig
