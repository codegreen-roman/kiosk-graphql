import React, { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { pathOr } from 'ramda'
import { Layout } from '@components/Layout'
import { Box, CircularProgress } from '@material-ui/core'
import { BookingStepTitle } from '@components/BookingStepTitle'
import { DestinationSailPackage, SelectDestination } from '@components/SelectDestination'

import { useQuery } from 'urql'
import getKioskRoutes from '@gql/getKioskRoutes.graphql'
import { KioskInfoData } from '@interfaces/boraCore'
import { withUrqlClient } from 'next-urql'
import { urqlClientOptions } from '../urql/urlqlClient'
import { AppStateTypes, useAppState } from '../hooks/useAppState'

const getMunRoutes = (packages): DestinationSailPackage[] =>
  packages.map(({ code, route }) => ({
    code,
    routeCode: route.code,
    title: pathOr('', ['legs', 0, 'parts', 0, 'title'])(route),
  }))

const firstPort = 'MUN'

const SelectDestinationPage: FC = () => {
  const [result] = useQuery<KioskInfoData>({
    query: getKioskRoutes,
    variables: { port: firstPort },
  })

  const { dispatch, state } = useAppState()

  useEffect(() => {
    dispatch({ type: AppStateTypes.setPort, payload: firstPort })
    dispatch({ type: AppStateTypes.setToInitial })
  }, [])

  const { t } = useTranslation()

  const { data, fetching, error } = result

  const destinationSailPackages = data ? getMunRoutes(data.kiosk.sailPackages) : []

  return (
    <Layout step={0} title={state.port} isErrorOccurred={!!error}>
      <Box flexGrow="1" display="flex" flexDirection="column" overflow="hidden">
        <BookingStepTitle>{t('Choose destination')}</BookingStepTitle>
        {fetching && (
          <Box display="flex" flexGrow="1" justifyContent="center" alignItems="center" width="100%">
            <CircularProgress />
          </Box>
        )}
        <SelectDestination display-if={!fetching && data?.kiosk?.sailPackages} sailPackages={destinationSailPackages} />
      </Box>
    </Layout>
  )
}

export default withUrqlClient(() => urqlClientOptions, { ssr: false })(SelectDestinationPage)
