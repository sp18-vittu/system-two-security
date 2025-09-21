import { red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    // Name of the component
    MuiDrawer: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          color: 'white',
        },
      },
    },
  },
})

export default theme
