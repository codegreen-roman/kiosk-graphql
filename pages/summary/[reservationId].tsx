import React, { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Layout } from '@components/Layout'
import { Container } from '@material-ui/core'
import { BookingStepTitle } from '@components/BookingStepTitle'
import { PaymentPanel } from '@components/PaymentPanel'
import { useRouter } from 'next/router'
import { useQuery } from 'urql'
import getReservation from '@gql/getReservation.graphql'
import { withUrqlClient } from 'next-urql'
import { urqlClientOptions } from '../../urql/urlqlClient'
import { AppStateTypes, useAppState } from '../../hooks/useAppState'
import { ReservationLoad, BoraReservationStatus } from '@interfaces/boraCore'

const PaymentPage: FC = () => {
  const { t, i18n } = useTranslation()
  const {
    state: { port },
    dispatch,
  } = useAppState()

  const router = useRouter()
  const { query } = router
  const { reservationId } = query
  const [result, queryAgain] = useQuery<{ reservation: ReservationLoad }>({
    requestPolicy: 'cache-and-network',
    query: getReservation,
    variables: { reservationId: reservationId },
  })

  const totalAmount = result.data ? result.data?.reservation?.paymentInfo.totalPrice.amount : 0

  useEffect(() => {
    if (result.data) {
      const reservation = result.data.reservation as ReservationLoad
      dispatch({ type: AppStateTypes.startReservation, payload: reservationId as string })
      if (!reservation || !reservation.sailPackages.length || reservation.status === BoraReservationStatus.DELETED) {
        dispatch({ type: AppStateTypes.startAgain, payload: true })
      }
    }
  }, [result.data])

  useEffect(() => {
    queryAgain()
  }, [i18n.language])

  return (
    <Layout step={2} title={port}>
      <BookingStepTitle totalAmount={totalAmount}>{t('Proceed to payment')}</BookingStepTitle>
      <Container
        display-if={
          !result.fetching &&
          result.data?.reservation &&
          result.data?.reservation.sailPackages &&
          result.data?.reservation.sailPackages.length
        }
        maxWidth="xl"
      >
        <PaymentPanel serverData={result.data.reservation} />
      </Container>
    </Layout>
  )
}

export default withUrqlClient(() => urqlClientOptions, { ssr: false })(PaymentPage)
