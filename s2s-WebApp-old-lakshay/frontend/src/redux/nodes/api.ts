import axios from 'axios'
import { environment } from '../../environment/environment'
import { navigateTo } from './navigationHelper'
import localforage from 'localforage'

const api = axios.create({
  baseURL: environment.baseUrl,
  timeout: 10000,
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: any) => {
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || 'An error occurred'

      switch (status) {
        case 401:
          localforage.removeItem('notification')
          localStorage.clear()
          navigateTo('/')
          console.error('Unauthorized, redirecting...')
          break
        case 403:
          console.error('Forbidden')
          break
        case 404:
          console.error('Resource not found')
          break
        case 500:
          console.error('Internal server error')
          break
        default:
          console.error(`Error: ${status} - ${message}`)
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received')
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request', error.message)
    }

    // Optionally, you can return a rejected promise to allow further handling in specific components
    return Promise.reject(error)
  },
)

export default api
