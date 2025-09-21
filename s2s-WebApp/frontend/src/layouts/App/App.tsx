import React, { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../../redux/store'

import routes from '../../routes'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorPage from '../../pages/errors/ErrrorPage'
import DataProvider from '../shared/DataProvider'
import { Provider as AlertProvider } from 'react-alert'
import CustomAlertTemplate from './CustomAlertTemplate'
import { Toaster } from 'react-hot-toast'

function App() {
  const options = {
    timeout: 5000,
    position: 'top center',
  }

  return (
    <Provider store={store}>
      <AlertProvider template={CustomAlertTemplate} {...options}>
        <DataProvider>
          <ErrorBoundary FallbackComponent={ErrorPage}>
            <Suspense fallback={<div className='loader'></div>}>
              <RouterProvider router={routes} />
              <Toaster />
            </Suspense>
          </ErrorBoundary>
        </DataProvider>
      </AlertProvider>
    </Provider>
  )
}

export default App
