import React, { FC } from 'react'
import { Grid, Box } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

import { Icon } from '@components/Icon'
import { Root, IconHolder, Paragraph, Title } from './SailDescriptionStyles'
import { formatDate, formatTime } from '@utils/formatters'
import { Route } from '@interfaces/boraCore'
import { pathOr } from 'ramda'
import TripDescription from '@components/TripDirection/themes/kihnuKiosk/TripDirection'

const getFirstTitle = pathOr('', ['legs', 0, 'title'])
const getSecondTitle = pathOr('', ['legs', 1, 'title'])

export interface SailDescriptionProps {
  roundTrip: boolean
  route: Route
  timeOfDepartureTo: Date
  timeOfDepartureFrom: Date
  port: string
  isExtraSpacing?: boolean
}

const SailDescription: FC<SailDescriptionProps> = ({
  roundTrip,
  route,
  timeOfDepartureTo,
  timeOfDepartureFrom,
  port,
  isExtraSpacing,
}) => {
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const indexOfCurrentPort = route?.legs?.findIndex((item) => {
    const currentCodeArray = item.code.split('-')
    return port === currentCodeArray[0]
  })

  let tripDirection: string[] | string = ''
  if (indexOfCurrentPort <= 0) {
    tripDirection = roundTrip ? [`${getFirstTitle(route)}`, `${getSecondTitle(route)}`] : getFirstTitle(route)
  } else {
    tripDirection = roundTrip ? [`${getSecondTitle(route)}`, `${getFirstTitle(route)}`] : getSecondTitle(route)
  }
  const isRoundTrip = Boolean(timeOfDepartureFrom)

  const formattedDate = (date, locale): string => {
    return `${formatTime(new Date(date), 'h:m', locale)}, ${formatDate(
      new Date(date),
      'dd:mm:yy:long',
      locale
    ).toUpperCase()}`
  }

  return (
    <Root isExtraSpacing={isExtraSpacing}>
      <Grid container spacing={isExtraSpacing ? 2 : 5} alignItems="center">
        <Grid item xs={6}>
          {roundTrip ? (
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" pr={2}>
              <Box display="flex" flexDirection="column">
                <TripDescription
                  departure={tripDirection[0].toString().split('-')[0]}
                  arrival={tripDirection[0].toString().split('-')[1]}
                />
                <Box display="flex">
                  <Paragraph>{formattedDate(timeOfDepartureTo, i18n.language)}</Paragraph>
                </Box>
              </Box>
              <IconHolder as={Icon['return']} display-if={isRoundTrip} />
              <Box display="flex" flexDirection="column">
                <TripDescription
                  departure={tripDirection[1].toString().split('-')[0]}
                  arrival={tripDirection[1].toString().split('-')[1]}
                  roundTrip={true}
                />
                <Box display="flex">
                  <Paragraph display-if={isRoundTrip}>{formattedDate(timeOfDepartureFrom, i18n.language)}</Paragraph>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-start">
              {/*<Paragraph>{tripDirection}</Paragraph>*/}
              <TripDescription
                departure={tripDirection.toString().split('-')[0]}
                arrival={tripDirection.toString().split('-')[1]}
              />
              <Box display="flex">
                <Paragraph>{formattedDate(timeOfDepartureTo, i18n.language)}</Paragraph>
              </Box>
            </Box>
          )}
        </Grid>
        <Grid item xs={6}>
          <Title>{t('Chosen tickets')}</Title>
        </Grid>
      </Grid>
    </Root>
  )
}

export default SailDescription
