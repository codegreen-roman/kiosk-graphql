import React, { useEffect } from 'react'
import { FC } from 'react'
import { Layout } from '@components/Layout'
import { Container } from '@material-ui/core'
import { BookingStepTitle } from '@components/BookingStepTitle'
import { ConfirmationPanel } from '@components/ConfirmationPanel'
import { useTranslation } from 'react-i18next'
import { withUrqlClient } from 'next-urql'
import { urqlClientOptions } from '../../urql/urlqlClient'
import { useRouter } from 'next/router'
import { useAppState } from '../../hooks/useAppState'
import getConfig from 'next/config'
import { PublicConfig } from '@pages/info'

const { publicRuntimeConfig } = getConfig()
const { confirmationRedirectTimout } = publicRuntimeConfig as PublicConfig

export type ConfirmationQuery = {
  all: string
}

const ThankYouPage: FC = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { query } = router
  const { all } = query as ConfirmationQuery
  const [vessel, reservationId] = all.split('-')
  const { state } = useAppState()
  const { i18n } = useTranslation()

  useEffect(() => {
    const timeout = setTimeout(() => {
      const port = window.localStorage.getItem('port')
      const initialPage = port.includes('MUN') ? `/select-destination/?port=${port}` : `/?port=${port}`
      setTimeout(() => {
        router.push(initialPage)
        i18n.changeLanguage(state.preferredLocale).catch(console.error)
      }, 1500)
      clearTimeout(timeout)
    }, confirmationRedirectTimout)

    return (): void => clearTimeout(timeout)
  }, [])

  return (
    <Layout step={3} title={vessel}>
      <BookingStepTitle finalStep={'finalStep'}>
        {t('Ticket is printed', { ...(reservationId ? { reservationId } : { reservationId: 0 }) })}
      </BookingStepTitle>
      <Container maxWidth="xl">
        <ConfirmationPanel vessel={vessel} />
      </Container>
    </Layout>
  )
}

export default withUrqlClient(() => urqlClientOptions, { ssr: true })(ThankYouPage)
