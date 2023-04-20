import React, { useState } from 'react'
import { FC } from 'react'
import { Layout } from '@components/Layout'
import { Box, Container } from '@material-ui/core'
import { BookingStepTitle } from '@components/BookingStepTitle'
import { useRouter } from 'next/router'
import { DateRoute } from '@components/DateRoutes'
import { useTranslation } from 'react-i18next'
import { withUrqlClient } from 'next-urql'
import { urqlClientOptions } from '../../urql/urlqlClient'
import { useAppState } from '../../hooks/useAppState'

export const ForwardDateContext = React.createContext(null)
export const BackDateContext = React.createContext(null)
const SelectDatePage: FC = () => {
  const [savedForwardDate, handleSavedForwardDateChange] = useState(new Date())
  const { t } = useTranslation()
  const router = useRouter()
  const { query } = router
  const { state } = useAppState()

  const { route } = query
  const routeLegs = query.all as string[]

  const handler = (date: Date): void => {
    handleSavedForwardDateChange(date)
  }
  return (
    <Layout step={1} title={state.port}>
      <BookingStepTitle totalAmount={0}>{t('Select sail title')}</BookingStepTitle>
      <Box display="flex" flex="1">
        <Container maxWidth="xl">
          <ForwardDateContext.Provider value={[savedForwardDate, handleSavedForwardDateChange]}>
            <DateRoute route={route as string} routeLegs={routeLegs} handleSavedDate={handler} />
          </ForwardDateContext.Provider>
        </Container>
      </Box>
    </Layout>
  )
}

export default withUrqlClient(() => urqlClientOptions, { ssr: false })(SelectDatePage)
