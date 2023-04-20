import React, { FC } from 'react'
import {
  DepartureTime,
  ExtraTicketsWrapper,
  ExtraTicketsLabel,
  ExtraTicketsText,
  OkIcon,
  Root,
  DangerIcon,
  AnchorIcon,
  NoTrucksIcon,
} from './SailRowStyles'
import { ContentBlock } from '@components/ContentBlock'
import { Sail } from '@interfaces/salesCore'
import SeatsAvailable from './SeatsAvailable'
import { formatTime } from '@utils/formatters'
import { SailDirection, SailStatus } from '@interfaces/boraCore'
import { Timer } from '@components/Timer'
import { useTranslation } from 'react-i18next'
import { Box, Grid } from '@material-ui/core'

export interface SailRowProps {
  className?: string
  selected: boolean
  sail: Sail
  onSelect?: (sailRefId: number) => void
  isExtraTicketsInfoVisible: boolean
  isReserveTicketsVisible: boolean
  timer?: { date: number; direction: string }
}

export const SailRow: FC<SailRowProps> = ({
  className,
  sail: {
    status,
    sailRefId,
    departure,
    availableTickets,
    extraTickets,
    reserveTickets,
    maxTickets,
    dangerousGoods,
    restrictedPrices = false,
  },
  isExtraTicketsInfoVisible,
  selected,
  onSelect,
  timer,
}) => {
  const { t } = useTranslation()
  const isSailCanceled = status === SailStatus.CANCELLED
  const departureDate = new Date(departure.timestamp)
  const departureTimeFormatted = formatTime(departureDate, 'h:m')
  function handleClick(): void {
    !isSailCanceled && onSelect?.(sailRefId)
  }
  const { date, direction } = timer
  return (
    <Root className={className} disabled={Number(isSailCanceled)} onClick={handleClick}>
      <ContentBlock selected={selected}>
        <Grid container>
          <Grid item xs={4}>
            <Box height="100%" display="flex" alignItems="center">
              <DepartureTime>{departureTimeFormatted}</DepartureTime>
              <DangerIcon display-if={dangerousGoods} />
              <AnchorIcon display-if={isSailCanceled} />
              <NoTrucksIcon display-if={restrictedPrices} />
            </Box>
          </Grid>

          <Grid item xs={8}>
            <Grid container>
              <Grid item xs={4}>
                <SeatsAvailable
                  current={availableTickets.passengers}
                  local={availableTickets.localPassengers}
                  max={maxTickets.passengers}
                  reserve={reserveTickets?.passengers}
                />
              </Grid>

              <Grid item xs={4}>
                <SeatsAvailable
                  current={availableTickets.vehicles}
                  max={maxTickets.vehicles}
                  reserve={reserveTickets?.vehicles}
                />
              </Grid>

              <Grid item xs={4}>
                <SeatsAvailable
                  current={availableTickets.bicycles}
                  max={maxTickets.bicycles}
                  reserve={reserveTickets?.bicycles}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <ExtraTicketsWrapper
          display-if={timer && timer.direction === SailDirection.FORWARD && isExtraTicketsInfoVisible}
        >
          <Box paddingTop="20px">
            <Grid container>
              <Grid item xs={4}>
                <ExtraTicketsLabel>{t('Extra tickets label')}</ExtraTicketsLabel>
                <Timer isUpcoming={true} isTitleNeeded={false} date={date} direction={direction} color="indigo" />
              </Grid>
              <Grid item xs={8}>
                <Box height="100%" display="flex" alignItems="center">
                  <Grid container>
                    <Grid item xs={4}>
                      <ExtraTicketsText>{extraTickets.passengers ? `+${extraTickets.passengers}` : 0}</ExtraTicketsText>
                    </Grid>
                    <Grid item xs={4}>
                      <ExtraTicketsText>{extraTickets.vehicles ? `+${extraTickets.vehicles}` : 0}</ExtraTicketsText>
                    </Grid>
                    <Grid item xs={4}>
                      <ExtraTicketsText>{extraTickets.bicycles ? `+${extraTickets.bicycles}` : 0}</ExtraTicketsText>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </ExtraTicketsWrapper>

        <OkIcon display-if={selected} />
      </ContentBlock>
    </Root>
  )
}

export default SailRow
