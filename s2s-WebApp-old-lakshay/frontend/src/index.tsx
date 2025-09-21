import { createRoot } from 'react-dom/client'
import './index.css'
import './CustomMUI.css'
import App from './layouts/App/App'
import { unregister } from './serviceWorker'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/styles'
import theme from './theme'
import { history } from './redux/store'
import { PostHogProvider } from 'posthog-js/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const options = {
  api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST,
}
const queryClient = new QueryClient()
const rootElement = document.getElementById('root')

if (rootElement) {
  const root = createRoot(rootElement)
  root.render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PostHogProvider apiKey={process.env.REACT_APP_PUBLIC_POSTHOG_KEY} options={options}>
          <App history={history} />
        </PostHogProvider>
      </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>,
  )

  unregister()
}
