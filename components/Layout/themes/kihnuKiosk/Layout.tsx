import React, { FC, useEffect, useState } from 'react'
import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import { BookingProcessHeader } from '@components/BookingHeader'
import { Header } from '@components/Header'
import { LayoutProps } from '@components/Layout'
import { Box } from '@material-ui/core'
import { AlertPopup } from '@components/AlertPopup'
import { getCurrentTime } from '@utils/time'
import { AlertPopupType } from '@interfaces/popupStatus'
import { createGlobalStyle } from 'styled-components'
import { themeSettings } from '@themeSettings'
import { createFontFace } from '@styles/globalStyles'
import getConfig from 'next/config'
import { PublicConfig } from '@pages/info'
import { isProductionEnv } from '@utils/env'

const { publicRuntimeConfig } = getConfig()
const { env } = publicRuntimeConfig as PublicConfig

export const GlobalStyle = createGlobalStyle`
  ${themeSettings.fontFaces.map(createFontFace).join('')}
  html {
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    padding: 0;
    margin: 0;
    box-sizing: inherit;
  }

  * {
    -webkit-user-select: none;
    -khtml-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
  body {
    ${isProductionEnv() && 'cursor: none;'}
  }
`
interface LayoutContextProps {
  currentStep: number
}

export const LayoutContext = React.createContext<LayoutContextProps>({
  currentStep: 0,
})
export const TimerContext = React.createContext([])
export const CurrentTimeContext = React.createContext(null)

const Layout: FC<LayoutProps> = ({ children, title = 'Bora systems', step = 0, isErrorOccurred = false }) => {
  const [isTimeUp, setTimeIsUp] = useState([])
  const [currentTime, setCurrentTime] = useState(getCurrentTime('h:m'))
  const updateTime = (): void => setCurrentTime(getCurrentTime('h:m'))

  useEffect(() => {
    const intervalId = setInterval(updateTime, 1000)
    return (): void => clearInterval(intervalId)
  })

  useEffect(() => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
    function handleBackFromBackground(): void {
      !document.hidden && updateTime()
    }

    document.addEventListener('visibilitychange', handleBackFromBackground)

    return (): void => {
      document.removeEventListener('visibilitychange', handleBackFromBackground)
    }
  })
  const { t } = useTranslation()

  const [alertOpen, setAlertOpen] = React.useState(isErrorOccurred)
  const handleAlertOnClose = (): void => {
    setAlertOpen(false)
  }

  return (
    <div id="layout">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, maximum-scale=1"
        />
      </Head>
      <LayoutContext.Provider value={{ currentStep: step }}>
        <TimerContext.Provider value={[isTimeUp, setTimeIsUp]}>
          <CurrentTimeContext.Provider value={[currentTime, setCurrentTime]}>
            <GlobalStyle />
            <Box display="flex" flexDirection="column" minHeight="100vh" overflow="hidden">
              <Header />
              <BookingProcessHeader
                goToSchedules={(): void => void 0}
                isConfirmAndPayStepAvailable={true}
                isErrorOccurred={false}
                isSelectTicketsStepAvailable={true}
              />
              {children}
              <AlertPopup
                type={AlertPopupType.ERROR}
                alertOpen={alertOpen}
                handleAlertOnClose={handleAlertOnClose}
                message={t('Reservation error', {
                  tagStart: '<p>',
                  tagEnd: '</p>',
                  boldTagStart: '<strong>',
                  boldTagEnd: '</strong>',
                })}
              />
            </Box>
          </CurrentTimeContext.Provider>
        </TimerContext.Provider>
      </LayoutContext.Provider>
    </div>
  )
}

export default Layout
