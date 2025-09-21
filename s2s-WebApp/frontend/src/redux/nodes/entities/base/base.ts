import BaseConfig from './base_config'

class Config extends BaseConfig {
  get actions() {
    return super.allActions
  }

  get reducer() {
    const { actionTypes } = this
    return (state = BaseConfig.initialState, action: { type: string; payload: any }) => {
      switch (action.type) {
        case actionTypes.LOAD_DATA:
          return {
            loading: true,
            error: {},
            list: [],
          }
        case actionTypes.LOAD_ALL_SUCCESS:
          return {
            loading: false,
            error: {},
            list: action.payload ? action.payload : [],
          }
        case actionTypes.LOAD_SUCCESS:
          return {
            ...state,
            selected: action.payload,
          }
        default:
          return []
      }
    }
  }
}

export default Config
