import React from 'react'
import ReactDOM from 'react-dom/client'
import { StyledEngineProvider } from '@mui/material/styles'
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from '@mui/material/styles'
import App from './app.tsx'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

let theme = createTheme({
  typography: {
    fontFamily: 'roboto',
  },
  palette: {
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 4.5,
  },
})

theme = responsiveFontSizes(theme)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* change the CSS injection order to give precedence our custom styles over MUI
     https://mui.com/material-ui/guides/interoperability/#css-injection-order
     */}
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
)
