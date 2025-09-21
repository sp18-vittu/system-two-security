import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createRootReducer from './reducers'
import local from './../utils/local'
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
  }
}
const initialState = {
  auth: local.getItem('auth') ? JSON.parse(local.getItem('auth') as any) : null,
  domainreducer: local.getItem('bearerToken')
    ? JSON.parse(local.getItem('bearerToken') as any)
    : null,
}

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const history = createBrowserHistory()
export default createStore(
  createRootReducer(history),
  initialState,
  composeEnhancer(applyMiddleware(routerMiddleware(history), thunk)),
)
