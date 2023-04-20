import React, { FC, useContext, useEffect, useState } from 'react'
import { SailRow } from './SailsTableStyles'
import SailsTableHead from './SailsTableHead'
import SailsTableFoot from './SailsTableFoot'
import { SailsTableProps } from '@components/SailsTable'
import { SailDirection, SailStatus } from '@interfaces/boraCore'
import { Sail } from '@interfaces/salesCore'
import { formatTime, isToday } from '@utils/formatters'
import { CurrentTimeContext, TimerContext } from '@components/Layout/themes/kihnuKiosk/Layout'
import { Message } from '@components/SailsTable/themes/kihnuKiosk/SailsTableFootStyles'
import { useTranslation } from 'react-i18next'
import { Box, Grid } from '@material-ui/core'
import { datesDiff } from '@utils/time'
import { useAppState } from '../../../../hooks/useAppState'
import ATTRIBUTES from '@const/attributes'
import NoSails from '@components/DateRoutes/themes/kihnuKiosk/NoSails'

const SailsTable: FC<SailsTableProps> = ({
  sails,
  direction,
  onSelectSail,
  leg,
  savedSailRefId,
  callbackForTriggerReloadSails,
  shouldReload,
  setReloadFlag,
}) => {
  const { state } = useAppState()
  const { t, i18n } = useTranslation()

  const currentLanguage = i18n.language.toUpperCase()
  const noLocalsWarningFromAttributes = state?.sailPackages[0]?.route?.attributes?.find(
    (item) => item.code === `${ATTRIBUTES.KIOSK_SOLD_OUT_INFO_RESIDENT}_${currentLanguage}`
  )?.value
  const expirationTimeFromAttribute = state?.route?.attributes.find(
    (item) => item.code === ATTRIBUTES.KIOSK_CLOSE_SALES_IN_X_MINUTES_BEFORE_DEPARTURE
  )?.value
  const expirationTime =
    (expirationTimeFromAttribute && Number(expirationTimeFromAttribute)) ||
    Number(process.env.NEXT_PUBLIC_SAIL_AVAILABILITY_EXPIRATION)
  const [selectedSailRefId, setSelectedSaleRefId] = useState(null)
  // const [reloadingSailsForReserveTickets, setReloadingSailsForReserveTickets] = useState(false)

  const [isTimeUp] = useContext(TimerContext)
  const [currentTime] = useContext(CurrentTimeContext)
  const currentTimeFormatted = new Date()
  currentTimeFormatted.setHours(currentTime.split(':')[0])
  currentTimeFormatted.setMinutes(currentTime.split(':')[1])

  // the comment bellow will be removed after verification
  // const availableSails = sails.filter((sail) => new Date().getTime() < new Date(sail.departure.timestamp).getTime())
  const availableSails = sails.filter((sail) => {
    const { isFirstDateNewer, days, hours, minutes } = datesDiff(
      new Date(sail.departure.timestamp),
      currentTimeFormatted
    )
    if (isFirstDateNewer) {
      // Checking if it is (expirationTime - 1) minutes 59 seconds remained
      return !(days === 0 && hours === 0 && minutes <= expirationTime - 1)
    } else {
      return false
    }
  })

  const isSomeTicketsSoldOut = availableSails.find(
    ({ availableTickets: { passengers, vehicles, bicycles } }) => !passengers || !vehicles || !bicycles
  )
  const isSomeReserveTicketsSoldOut = availableSails.some(
    (sail) => sail.reserveTickets && (!sail.reserveTickets.passengers || !sail.reserveTickets.vehicles)
  )
  let warnings = []
  if (isSomeTicketsSoldOut) {
    warnings = isSomeTicketsSoldOut?.availableTickets?.warnings
  }
  const hasLocalPassengers = availableSails.some(({ availableTickets: { localPassengers } }) => !!localPassengers)
  const hasDangerGoods = availableSails.some(({ dangerousGoods }) => dangerousGoods)
  const hasCanceledSails = availableSails.some(({ status }) => status === SailStatus.CANCELLED)
  const hasRestrictedPrices = availableSails.some(({ restrictedPrices }) => restrictedPrices)

  const checkIfShowExtraTickets = (sail: Sail, direction: string): boolean => {
    return (
      sail.status !== SailStatus.CANCELLED &&
      direction !== SailDirection.BACKWARD &&
      isToday(new Date(sail.departure.timestamp)) &&
      sail?.extraTicketsAvailableTime &&
      (sail?.extraTickets?.passengers > 0 || sail?.extraTickets?.bicycles > 0 || sail?.extraTickets?.vehicles > 0) &&
      new Date(sail?.extraTicketsAvailableTime).getTime() > Date.now() &&
      !isTimeUp.find((it) => it.direction === direction && it.isTimeUpFlag === true)
    )
  }

  const checkIfShowReserveTickets = (sail: Sail): boolean => {
    return (
      sail.status !== SailStatus.CANCELLED &&
      direction !== SailDirection.BACKWARD &&
      sail?.reserveTicketsAvailableTime &&
      new Date(sail?.reserveTicketsAvailableTime).getTime() > Date.now()
    )
  }
  useEffect(() => {
    if (selectedSailRefId) {
      onSelectSail(selectedSailRefId, leg)
    }
  }, [selectedSailRefId])

  useEffect(() => {
    if (savedSailRefId && direction === SailDirection.FORWARD) {
      setSelectedSaleRefId(savedSailRefId)
    } else if (availableSails?.length && savedSailRefId === 0 && direction === SailDirection.FORWARD) {
      setSelectedSaleRefId(availableSails[0].sailRefId)
    }
  }, [savedSailRefId])

  useEffect(() => {
    if (
      availableSails?.find(
        (sail) =>
          Number(formatTime(new Date(sail.reserveTicketsAvailableTime), 'h:m').split(':')[0]) -
            Number(currentTime.split(':')[0]) ===
            0 &&
          Number(formatTime(new Date(sail.reserveTicketsAvailableTime), 'h:m').split(':')[1]) -
            Number(currentTime.split(':')[1]) ===
            0
      )
    ) {
      if (!shouldReload) {
        callbackForTriggerReloadSails(true)
      }
    } else {
      setReloadFlag(false)
    }
  }, [currentTime, shouldReload])

  return (
    <Grid container spacing={1}>
      {!availableSails.length ? (
        <Box display="flex" height="100%" alignItems="flex-start" justifyContent="center">
          <NoSails />
        </Box>
      ) : (
        <>
          <SailsTableHead />
          {availableSails.map((sail, index) => {
            const selected = selectedSailRefId === sail.sailRefId
            return (
              <Grid item xs={12} key={sail.sailRefId}>
                <SailRow
                  sail={sail}
                  isExtraTicketsInfoVisible={index === 0 ? checkIfShowExtraTickets(sail, direction) : false}
                  isReserveTicketsVisible={checkIfShowReserveTickets(sail)}
                  timer={{ date: new Date(sail?.extraTicketsAvailableTime).getTime(), direction }}
                  //   Lower line is for debugging different times left for forward and backward sail
                  // timer={{ date: direction === SailDirection.FORWARD ? Date.now() + 10000 : Date.now() + 15000, direction }}
                  selected={selected}
                  onSelect={setSelectedSaleRefId}
                />
                <Message
                  data-test="extra"
                  display-if={index === 0 ? checkIfShowExtraTickets(sail, direction) : false}
                  type="info"
                >
                  {t('Extra ticket prompt')}
                </Message>
              </Grid>
            )
          })}
          <SailsTableFoot
            isTicketsSoldOut={!!isSomeTicketsSoldOut}
            hasLocalPassengers={hasLocalPassengers}
            hasDangerGoods={hasDangerGoods}
            hasCanceledSails={hasCanceledSails}
            hasRestrictedPrice={hasRestrictedPrices}
            hasReserveTickets={
              availableSails.some((sail) => sail.reserveTickets)
                ? checkIfShowReserveTickets(availableSails.find((sail) => sail.reserveTickets))
                : false
            }
            isSomeReserveTicketsSoldOut={isSomeReserveTicketsSoldOut}
            noLocalsWarningFromAttributes={noLocalsWarningFromAttributes}
            warnings={warnings}
          />
        </>
      )}
    </Grid>
  )
}

export default SailsTable
