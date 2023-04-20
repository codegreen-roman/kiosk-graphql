import React, { FC, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Layout } from '@components/Layout'
import { Box, Container } from '@material-ui/core'
import { BookingStepTitle } from '@components/BookingStepTitle'
import { SelectTicketPanel } from '@components/SelectTicketPanel'
import { useRouter } from 'next/router'
import { NextRouter } from 'next/router'
import { useQuery } from 'urql'
import getPrices from '@gql/getPrices.graphql'
import { SailPrices } from '@interfaces/prices'
import { withUrqlClient } from 'next-urql'
import { urqlClientOptions } from '../../urql/urlqlClient'
import { AppStateTypes, useAppState } from '../../hooks/useAppState'
import { useAvailability } from '../../hooks/useAvailability'

const selectedSail = {
  idCards: ['491X73XX251', '391X73XX252', '491X73XX255', '391X73XX232'],
}

const SelectTicketsPage: FC = () => {
  const { t } = useTranslation()

  const { state, dispatch } = useAppState()
  const router: NextRouter = useRouter()
  const { sailRefId = '' } = router.query
  const sailRefIdArray = (sailRefId as string).split('>')
  const setTotal = useCallback((amount: number): void => {
    dispatch({ type: AppStateTypes.setTotal, payload: amount })
  }, [])

  const [forwardSailRefId, backwardSailRefId] = sailRefIdArray

  const [result, queryAgain] = useQuery<SailPrices>({
    query: getPrices,
    requestPolicy: 'cache-and-network',
    variables: {
      port: state.port,
      forwardSailRefId,
      ...(backwardSailRefId && { backwardSailRefId }),
    },
  })

  const { fetching: fetchingAvailability } = useAvailability({
    port: state.port,
    sailRefId: parseFloat(forwardSailRefId),
    ...(backwardSailRefId && { backwardSailRefId: parseFloat(backwardSailRefId) }),
    dispatch,
  })

  const { i18n } = useTranslation()
  useEffect(() => {
    queryAgain()
  }, [i18n.language])

  const { data, fetching } = result
  return (
    <Layout step={2} title={state.port}>
      <BookingStepTitle totalAmount={state.total}>{t('Choose tickets')}</BookingStepTitle>
      <Box display="flex" flex="1">
        <Container maxWidth="xl" display-if={!fetchingAvailability && !fetching && data}>
          <SelectTicketPanel
            sailRefId={
              sailRefIdArray.length > 1 ? sailRefIdArray.map((item) => parseFloat(item)) : parseFloat(sailRefIdArray[0])
            }
            tripSummary={data.sailPricing.tripSummary}
            ticketDecks={data.sailPricing.ticketDecks}
            idCards={selectedSail.idCards}
            setGrandTotal={setTotal}
          />
        </Container>
      </Box>
    </Layout>
  )
}
export default withUrqlClient(() => urqlClientOptions, { ssr: false })(SelectTicketsPage)
