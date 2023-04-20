import React, { useEffect } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { createTheme, ThemeProvider as MaterialThemeProvider } from '@material-ui/core/styles'
import getConfig from 'next/config'
import { PublicConfig } from '@pages/info'
import { withUrqlClient } from 'next-urql'
import { AppStateProvider } from '../hooks/useAppState'
import { urqlClientOptions } from '../urql/urlqlClient'
import { getTextColors } from '@themeSettings'
import { useHotkeys } from 'react-hotkeys-hook'

const { publicRuntimeConfig } = getConfig()
const { env } = publicRuntimeConfig as PublicConfig
const textColors = getTextColors()

const theme = {
  primary: '#f2f2f2',
  ...createTheme({
    palette: {
      primary: {
        main: textColors.info,
      },
      secondary: {
        main: '#fff',
      },
    },
  }),
}

const App = ({ Component, pageProps }) => {
  useHotkeys('ctrl+shift+r', () => window.location.reload())

  useEffect(() => {
    if (env !== 'development') {
      document.addEventListener('contextmenu', (event) => event.preventDefault())
    }

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
          function (registration) {
            registration.update()
          },
          function (err) {
            // eslint-disable-next-line no-console
            console.log('Service Worker registration failed: ', err)
          }
        )
      })
    }
  }, [])

  return (
    <StyledThemeProvider theme={theme}>
      <MaterialThemeProvider theme={theme}>
        <AppStateProvider>
          <Component {...pageProps} />
        </AppStateProvider>
      </MaterialThemeProvider>
    </StyledThemeProvider>
  )
}

export default withUrqlClient(() => urqlClientOptions, { ssr: true })(App)
