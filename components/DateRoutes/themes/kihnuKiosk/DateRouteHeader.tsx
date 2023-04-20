import React, { FC } from 'react'
import { Icon } from '@components/Icon'
import { ShipIconHolder, SubTitle, TimeStamp, VesselName, CloseButtonText } from './DateRouteStyles'
import { CloseButton, CloseIconHolder } from 'styles/buttonStyles'
import { Box, Grid } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@utils/formatters'
import TripDescription from '@components/TripDirection/themes/kihnuKiosk/TripDirection'

export type LocationAndTitle = {
  location: string
  title: string
}

interface DateRouteHeaderProps {
  pointOfDeparture: LocationAndTitle
  pointOfDestination: LocationAndTitle
  vessel: string
  timeOfDeparture: string
  travelTimeInMinutes: number
  returnOneWayTrip?: () => void
}

const DateRouteHeader: FC<DateRouteHeaderProps> = ({
  returnOneWayTrip,
  pointOfDeparture,
  pointOfDestination,
  vessel,
  timeOfDeparture,
  travelTimeInMinutes,
}) => {
  const { t, i18n } = useTranslation()

  const duration = {
    hours: Math.floor(travelTimeInMinutes / 60),
    minutes: travelTimeInMinutes % 60,
  }

  const formattedDate = `${formatDate(new Date(timeOfDeparture), 'dd:mm:yy:long', i18n.language).toUpperCase()}`

  return (
    <Box height="130px" width="100%" display="flex" flexDirection="row" alignItems="center" paddingRight="16px">
      <Grid container alignItems={'center'} spacing={5}>
        <Grid item xs={returnOneWayTrip ? 5 : 4}>
          <Box display="flex" justifyContent={returnOneWayTrip ? 'space-between' : 'center'} alignItems="center">
            <Box
              display-if={returnOneWayTrip}
              display="flex"
              flexDirection="column"
              alignItems="center"
              paddingRight="10px"
            >
              <CloseButton onClick={returnOneWayTrip}>
                <CloseIconHolder as={Icon['close']} />
              </CloseButton>
              <CloseButtonText>{t('Remove return route')}</CloseButtonText>
            </Box>
            <Box display="flex" justifyContent="center">
              <TripDescription departure={pointOfDeparture.title} arrival={pointOfDestination.title} />
            </Box>
          </Box>
        </Grid>
        <Grid item xs={returnOneWayTrip ? 7 : 8}>
          <Box display="flex" flexDirection="column" alignItems="strech">
            <Box display="flex" justifyContent="space-between" paddingBottom="5px">
              <TimeStamp>{formattedDate}</TimeStamp>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <ShipIconHolder as={Icon['ship']} />
                <VesselName>{vessel}</VesselName>
              </Box>
            </Box>
            <SubTitle display-if={duration.hours && duration.minutes}>
              {t('ETA hours and minutes', {
                hours: duration.hours,
                minutes: duration.minutes,
              })}
            </SubTitle>
            <SubTitle display-if={duration.hours && !duration.minutes}>
              {t('ETA hours', {
                hours: duration.hours,
              })}
            </SubTitle>
            <SubTitle display-if={!duration.hours && duration.minutes}>
              {t('ETA minutes', {
                minutes: duration.minutes,
              })}
            </SubTitle>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DateRouteHeader
