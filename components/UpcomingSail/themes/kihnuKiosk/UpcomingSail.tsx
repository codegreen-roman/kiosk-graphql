import React, { FC, useContext, useEffect } from 'react'

import { Icon } from '@components/Icon'
import {
  Root,
  CustomWrapper,
  PrimaryNumber,
  SecondaryNumber,
  ThirdlyNumber,
  Clock,
  Vessel,
  IconHolder,
} from './UpcomingSailStyles'
import { Timer } from '@components/Timer'
import { Box, Container } from '@material-ui/core'
import { UpcomingSailProps } from '@components/UpcomingSail'
import { CurrentTimeContext, TimerContext } from '@components/Layout/themes/kihnuKiosk/Layout'
import { useAppState } from '../../../../hooks/useAppState'
import ATTRIBUTES from '@const/attributes'
import { SailDirection, SailStatus, ValueLevel } from '@interfaces/boraCore'
import TripDescription from '@components/TripDirection/themes/kihnuKiosk/TripDirection'

const UpcomingSail: FC<UpcomingSailProps> = ({
  time,
  direction,
  vessel,
  passengers,
  extraPassengers = 0,
  reservePassengers,
  bicycles,
  extraBicycles = 0,
  reserveBicycles,
  vehicles,
  extraVehicles = 0,
  reserveVehicles,
  extraTicketsAvailableTime,
  reserveTicketsAvailableTime,
  callBack,
  shouldReload,
  salesClosed,
  status,
  setReloadFlag,
}) => {
  const { state } = useAppState()
  const expirationTimeFromAttribute = state?.route?.attributes.find(
    (item) => item.code === ATTRIBUTES.KIOSK_CLOSE_SALES_IN_X_MINUTES_BEFORE_DEPARTURE
  )?.value
  const expirationTime =
    (expirationTimeFromAttribute && Number(expirationTimeFromAttribute)) ||
    Number(process.env.NEXT_PUBLIC_SAIL_AVAILABILITY_EXPIRATION)
  const [isTimeUp, setTimeIsUp] = useContext(TimerContext)
  const [currentTime] = useContext(CurrentTimeContext)

  const currentReservePassengersLevel = reservePassengers === 0 ? ValueLevel.LOW : ValueLevel.HIGH_UPCOMING
  const currentReserveBicyclesLevel = reserveBicycles === 0 ? ValueLevel.LOW : ValueLevel.HIGH_UPCOMING
  const currentReserveVehiclesLevel = reserveBicycles === 0 ? ValueLevel.LOW : ValueLevel.HIGH_UPCOMING

  const showTimer =
    extraTicketsAvailableTime &&
    new Date(extraTicketsAvailableTime).getTime() > Date.now() &&
    !isTimeUp.find((it) => it.direction === SailDirection.FORWARD && it.isTimeUpFlag === true) &&
    (extraPassengers > 0 || extraBicycles > 0 || extraVehicles > 0)

  useEffect(() => {
    if (isTimeUp.length) {
      if (isTimeUp.find((it) => it.direction === SailDirection.FORWARD && it.isTimeUpFlag === true)) {
        setTimeIsUp((prevArray) => {
          const array = [...prevArray].filter((item) => item.direction !== SailDirection.FORWARD)
          return array
        })
        callBack()
      }
    }
  }, [isTimeUp, setTimeIsUp])

  useEffect(() => {
    if (
      (Number(time.split(':')[0]) - Number(currentTime.split(':')[0]) === 0 &&
        // Checking if it is (expirationTime - 1) minutes 59 seconds remained
        (Number(time.split(':')[1]) - Number(currentTime.split(':')[1]) === expirationTime - 1 ||
          Number(time.split(':')[1]) - Number(currentTime.split(':')[1]) === 0)) ||
      (Number(reserveTicketsAvailableTime.split(':')[0]) - Number(currentTime.split(':')[0]) === 0 &&
        // Checking if it is time to reload for reserve tickets to be added to main inventory
        Number(reserveTicketsAvailableTime.split(':')[1]) - Number(currentTime.split(':')[1]) === 0)
    ) {
      if (!shouldReload) {
        callBack(true)
      }
    } else {
      setReloadFlag(false)
    }
  }, [currentTime, shouldReload])

  if (salesClosed || status === SailStatus.CANCELLED) {
    return null
  }
  return (
    <Root>
      <Container maxWidth="xl">
        <CustomWrapper>
          <Clock>{time}</Clock>
          <TripDescription isPrimary={true} departure={direction.split('-')[0]} arrival={direction.split('-')[1]} />
          <Box display="flex" alignItems="center">
            <IconHolder as={Icon['ship']} />
            <Vessel>{vessel}</Vessel>
          </Box>
          <Box display="flex" alignItems="center">
            <IconHolder as={Icon['passenger-ticket']} />
            <PrimaryNumber>{passengers}</PrimaryNumber>
            <ThirdlyNumber display-if={reservePassengers >= 0} level={currentReservePassengersLevel}>
              {`(${reservePassengers})`}
            </ThirdlyNumber>
            <SecondaryNumber display-if={showTimer}>{`+${extraPassengers}`}</SecondaryNumber>
          </Box>
          <Box display="flex" alignItems="center">
            <IconHolder as={Icon['car']} />
            <PrimaryNumber>{vehicles}</PrimaryNumber>
            <ThirdlyNumber display-if={reserveVehicles >= 0} level={currentReserveVehiclesLevel}>
              {`(${reserveVehicles})`}
            </ThirdlyNumber>
            <SecondaryNumber display-if={showTimer}>{`+${extraVehicles}`}</SecondaryNumber>
          </Box>
          <Box display="flex" alignItems="center">
            <IconHolder as={Icon['bike']} />
            <PrimaryNumber>{bicycles}</PrimaryNumber>
            <ThirdlyNumber display-if={reserveBicycles >= 0} level={currentReserveBicyclesLevel}>
              {`(${reserveBicycles})`}
            </ThirdlyNumber>
            <SecondaryNumber display-if={showTimer}>{`+${extraBicycles}`}</SecondaryNumber>
          </Box>
          <Timer
            display-if={showTimer}
            isUpcoming={true}
            date={new Date(extraTicketsAvailableTime).getTime()}
            direction={SailDirection.FORWARD}
            color="cerulean"
          />
        </CustomWrapper>
      </Container>
    </Root>
  )
}

export default UpcomingSail
