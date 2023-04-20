import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid } from '@material-ui/core'
import {
  Circle,
  EditIconHolder,
  EmptyTicketsListPlaceholder,
  IconHolder,
  InsertedNumbers,
  InsertedRegNumbers,
  Number,
  PromotionText,
  StyledTicketType,
  SvgIconHolder,
  TicketWarning,
  TriangleShape,
} from '@components/SelectTicketPanel/themes/kihnuKiosk/SelectTicketPanelStyles'
import { Icon } from '@components/Icon'
import { SelectedTicketsPanelProps } from '@components/SelectTicketPanel/themes/kihnuKiosk/selectTickets'
import { useAppState } from '../../../../hooks/useAppState'
import { useRouter } from 'next/router'
import { Availability } from '@interfaces/salesCore'
import TICKET_TYPE from '@const/ticketTypes'
import { BUTTON_TICKET_TYPE } from '@const/buttonTypes'
import { compose, defaultTo, omit, sum, values } from 'ramda'
import { asMoneyString } from '@utils/formatters'

const isMonoType = (type: string): boolean => [TICKET_TYPE.VEHICLE, TICKET_TYPE.TRAILER].includes(type)

export const zeroAvailability: Availability = {
  passengers: 0,
  bicycles: 0,
  vehicles: 0,
  warnings: [],
  localPassengers: 0,
}

const sumOfValues = compose(defaultTo(0), sum, values)

const vehicleOrTrailerOrBicyclePredicate = (text: string): boolean =>
  text === TICKET_TYPE.VEHICLE || text === TICKET_TYPE.TRAILER || text === TICKET_TYPE.BICYCLE

export type ReservationAvailability = {
  passengerCategories: {
    [priceCategory: string]: number
  }
  localPassengerCategories: {
    [priceCategory: string]: number
  }
} & Availability

export const reducerForReservationTickets = (
  acc: ReservationAvailability,
  { text, resident, count, type }
): ReservationAvailability => {
  const prev = { ...acc }

  if (
    !resident &&
    !vehicleOrTrailerOrBicyclePredicate(text) &&
    type !== TICKET_TYPE.VEHICLE &&
    type !== TICKET_TYPE.TRAILER
  ) {
    prev.passengerCategories = {
      ...prev.passengerCategories,
      [type]: (prev.passengerCategories[type] || 0) + count,
    }
  } else if (
    resident &&
    !vehicleOrTrailerOrBicyclePredicate(text) &&
    type !== TICKET_TYPE.VEHICLE &&
    type !== TICKET_TYPE.TRAILER
  ) {
    prev.localPassengerCategories = {
      ...prev.localPassengerCategories,
      [type]: (prev.localPassengerCategories[type] || 0) + count,
    }
  }

  return {
    ...prev,
    ...(resident && { passengers: count + acc.passengers }),
    ...((text === TICKET_TYPE.VEHICLE || type === TICKET_TYPE.VEHICLE) && { vehicles: count + acc.vehicles }),
    ...((text === TICKET_TYPE.TRAILER || type === TICKET_TYPE.TRAILER) && { vehicles: count + acc.vehicles }),
    ...(text === TICKET_TYPE.BICYCLE && { bicycles: count + acc.bicycles }),
    ...(!resident &&
      !vehicleOrTrailerOrBicyclePredicate(text) &&
      type !== TICKET_TYPE.VEHICLE &&
      type !== TICKET_TYPE.TRAILER && { passengers: count + acc.passengers }),
  }
}

interface MaxCountInterface {
  maxReachedAmount: number
  count: number
  type: string
  resident: boolean
}
export interface ActionButtonProps {
  type: 'increase' | 'decrease' | 'remove' | 'disabled'
  onClick: () => void
  disabled?: boolean
}

const ActionButton: FC<ActionButtonProps> = ({ type, onClick, disabled }) => {
  const buttonTypes = {
    [BUTTON_TICKET_TYPE.INCREASE]: {
      color: '#0EB1BC',
      icon: 'plus',
    },
    [BUTTON_TICKET_TYPE.DECREASE]: {
      color: '#0EB1BC',
      icon: 'minus',
    },
    [BUTTON_TICKET_TYPE.REMOVE]: {
      color: '#d0021b',
      icon: 'close',
    },
    [BUTTON_TICKET_TYPE.DISABLED]: {
      color: '#D8D8D8',
      icon: 'plus',
    },
  }

  const { color, icon } = buttonTypes[type] || {}

  return (
    <Circle color={color} onClick={onClick} disabled={disabled}>
      <SvgIconHolder as={Icon[icon]} />
    </Circle>
  )
}

export const AddedTicketsPanel: FC<SelectedTicketsPanelProps> = ({
  tempTickets,
  carNumber,
  trailerNumber,
  onTicketCountIncrease,
  onTicketCountDecrease,
  onTicketTypeRemove,
  onTicketEdit,
  carTicket,
  trailerTicket,
  isDriverFromReserveAdded,
  isResidentFromReserveAdded,
  openDriverFromReserveAlert,
  isLocalCompanyVehicleHasBeenAdded,
  handleAddingDriverFromReserve,
  handleAddingResidentFromReserve,
}) => {
  const { t } = useTranslation()

  const {
    state: { availabilities, reserves },
  } = useAppState()

  const router = useRouter()
  const { query } = router

  const alreadyOnSail: ReservationAvailability = tempTickets.reduce(reducerForReservationTickets, {
    ...zeroAvailability,
    passengerCategories: {},
    localPassengerCategories: {},
  })
  const sailRefId: string = query.sailRefId.includes('>')
    ? (query.sailRefId as string).split('>')[0]
    : (query.sailRefId as string)

  const availableTickets = availabilities[sailRefId] || zeroAvailability
  const reservesTickets = reserves[sailRefId] || zeroAvailability

  const [reserveAndAvailabilityAmount, setReserveAndAvailabilityAmount] = useState(zeroAvailability)

  const priceCategoriesOnSail = Object.keys(alreadyOnSail?.passengerCategories)

  useEffect(() => {
    if (
      availableTickets.passengers - alreadyOnSail.passengers <= 0 &&
      reservesTickets.passengers - alreadyOnSail.passengers >= 0
    ) {
      if (priceCategoriesOnSail.find((priceCategory) => priceCategory === isDriverFromReserveAdded.ticket?.type)) {
        setReserveAndAvailabilityAmount((prevState) => ({ ...prevState, passengers: availableTickets.passengers }))
      } else {
        setReserveAndAvailabilityAmount((prevState) => ({ ...prevState, passengers: availableTickets.passengers }))
      }
    }
    if (
      availableTickets.passengers - alreadyOnSail.passengers <= 0 &&
      reservesTickets.passengers - alreadyOnSail.passengers <= 0
    ) {
      if (availableTickets.passengers - alreadyOnSail.passengers <= -reservesTickets.passengers) {
        setReserveAndAvailabilityAmount((prevState) => ({
          ...prevState,
          passengers: 0,
        }))
      } else {
        if (availableTickets.passengers - alreadyOnSail.passengers === 0 && reservesTickets.passengers >= 1) {
          if (priceCategoriesOnSail.find((priceCategory) => priceCategory === isDriverFromReserveAdded.ticket?.type)) {
            setReserveAndAvailabilityAmount((prevState) => ({
              ...prevState,
              passengers: !isDriverFromReserveAdded.flag ? availableTickets.passengers : 0,
            }))
          } else {
            setReserveAndAvailabilityAmount((prevState) => ({ ...prevState, passengers: 0 }))
          }
        }
      }
    }
    if (availableTickets.passengers - alreadyOnSail.passengers > 0) {
      setReserveAndAvailabilityAmount((prevState) => ({ ...prevState, passengers: availableTickets.passengers }))
    }
  }, [alreadyOnSail.passengers, reservesTickets])

  useEffect(() => {
    if (
      availableTickets.passengers - alreadyOnSail.passengers <= 0 &&
      reservesTickets.passengers - alreadyOnSail.passengers >= 0
    ) {
      if (
        isDriverFromReserveAdded.flag &&
        priceCategoriesOnSail.find((priceCategory) => priceCategory === isDriverFromReserveAdded.ticket?.type)
      ) {
        if (!isResidentFromReserveAdded) {
          setReserveAndAvailabilityAmount((prevState) => ({
            ...prevState,
            localPassengers: reservesTickets.passengers,
          }))
        } else {
          setReserveAndAvailabilityAmount((prevState) => ({
            ...prevState,
            localPassengers: reservesTickets.passengers - 1,
          }))
        }
      } else {
        setReserveAndAvailabilityAmount((prevState) => ({
          ...prevState,
          localPassengers: reservesTickets.passengers + 1,
        }))
      }
    }
    if (
      availableTickets.passengers - alreadyOnSail.passengers <= 0 &&
      reservesTickets.passengers - alreadyOnSail.passengers <= 0
    ) {
      if (availableTickets.passengers - alreadyOnSail.passengers <= -reservesTickets.passengers) {
        setReserveAndAvailabilityAmount((prevState) => ({
          ...prevState,
          localPassengers: 0,
        }))
      } else {
        const computedAmount =
          availableTickets.passengers > reservesTickets.passengers
            ? reservesTickets.passengers +
              (reservesTickets.passengers + availableTickets.passengers - alreadyOnSail.passengers)
            : reservesTickets.passengers
        setReserveAndAvailabilityAmount((prevState) => ({
          ...prevState,
          localPassengers:
            Object.keys(alreadyOnSail?.passengerCategories)?.length > 0 ? computedAmount : computedAmount + 1,
        }))
      }
    }
    if (availableTickets.passengers - alreadyOnSail.passengers > 0) {
      setReserveAndAvailabilityAmount((prevState) => ({
        ...prevState,
        localPassengers: availableTickets.passengers,
      }))
    }
  }, [alreadyOnSail.passengers, reservesTickets])

  useEffect(() => {
    if (
      availableTickets.bicycles - alreadyOnSail.bicycles <= 0 &&
      reservesTickets.bicycles - alreadyOnSail.bicycles > 0
    ) {
      setReserveAndAvailabilityAmount((prevState) => ({
        ...prevState,
        bicycles: reservesTickets.bicycles,
      }))
    }
    if (availableTickets.bicycles - alreadyOnSail.bicycles > 0) {
      setReserveAndAvailabilityAmount((prevState) => ({
        ...prevState,
        bicycles: availableTickets.bicycles,
      }))
    }
  }, [alreadyOnSail.bicycles, reservesTickets])

  useEffect(() => {
    if (
      availableTickets.vehicles - alreadyOnSail.vehicles <= 0 &&
      reservesTickets.vehicles - alreadyOnSail.vehicles > 0
    ) {
      setReserveAndAvailabilityAmount((prevState) => ({ ...prevState, vehicles: reservesTickets.vehicles }))
    }
    if (availableTickets.vehicles - alreadyOnSail.vehicles > 0) {
      setReserveAndAvailabilityAmount((prevState) => ({
        ...prevState,
        vehicles: availableTickets.vehicles,
      }))
    }
  }, [alreadyOnSail.vehicles, reservesTickets])

  const handleRemoveAction = (type: string, resident: boolean): void => {
    if (resident) {
      onTicketEdit(type)
    } else {
      onTicketTypeRemove(type)
    }
  }
  const handleIncreaseAction = (type: string, resident: boolean, priceCategoryInitial: string, text: string): void => {
    if (
      availableTickets.passengers - alreadyOnSail.passengers <= 0 &&
      reservesTickets.passengers >= 1 &&
      !isDriverFromReserveAdded.flag &&
      isDriverFromReserveAdded.ticket?.type === type
    ) {
      if (!isLocalCompanyVehicleHasBeenAdded) {
        openDriverFromReserveAlert()
        return
      }
      handleAddingDriverFromReserve(true, { type, text })
    }
    if (resident) {
      if (
        availableTickets.passengers - alreadyOnSail.passengers <= 0 &&
        reservesTickets.passengers - alreadyOnSail.passengers > 0
      ) {
        handleAddingResidentFromReserve(true)
      }
      if (availableTickets.passengers - alreadyOnSail.passengers > 0) {
        handleAddingResidentFromReserve(false)
      }
    }
    onTicketCountIncrease(type, resident, priceCategoryInitial)
  }
  const handleCheckIfMaxReached = ({ maxReachedAmount, count, type, resident }: MaxCountInterface): boolean => {
    if (
      !resident &&
      !isDriverFromReserveAdded.flag &&
      availableTickets.passengers - alreadyOnSail.passengers <= 0 &&
      reservesTickets.passengers >= 1
    ) {
      return type === isDriverFromReserveAdded.ticket?.type ? count >= maxReachedAmount : count >= maxReachedAmount - 1
    }
    return count >= maxReachedAmount
  }

  return (
    <>
      <Grid display-if={tempTickets.length} container item xs={12} spacing={1} alignItems="center">
        {tempTickets.map(
          (
            {
              type,
              text,
              count,
              priceCategory,
              priceCategoryInitial,
              resident,
              icon,
              promotion,
              promotionPrice,
              price,
              promotionText,
            },
            idx
          ) => {
            const isMinusShown = count > 1 && !isMonoType(type) && !resident
            const includesVehicles = [TICKET_TYPE.VEHICLE, TICKET_TYPE.BICYCLE, TICKET_TYPE.TRAILER].includes(type)

            let iconType = includesVehicles ? `ticket-${type}` : 'ticket-adult'
            if (icon === TICKET_TYPE.VISUALLY_IMPAIRED_PERSON) {
              iconType = 'visually-impaired'
            } else if (icon === TICKET_TYPE.ACCOMPANYING_PERSON) {
              iconType = 'accompanying-impaired'
            } else if (icon === TICKET_TYPE.HANDICAPPED_PERSON) {
              iconType = 'handicapped-person'
            }

            const calcOthersOccupied: (categories: { [priceCategory: string]: number }) => number = compose(
              sumOfValues,
              omit([type])
            )

            // const calcCurrentCategoryOccupied: (categories: { [priceCategory: string]: number }) => number = compose(
            //   sumOfValues,
            //   pick([type])
            // )

            let maxTicketsCount = reserveAndAvailabilityAmount.passengers
            // availableTickets.passengers !== 0 ? availableTickets.passengers : reservesTickets.passengers

            if (priceCategory !== type) {
              maxTicketsCount = maxTicketsCount - calcOthersOccupied(alreadyOnSail.passengerCategories)
            }

            if (resident) {
              iconType = 'ticket-citizen'
              maxTicketsCount =
                reserveAndAvailabilityAmount.localPassengers -
                calcOthersOccupied(alreadyOnSail.localPassengerCategories)
            }

            if (type === TICKET_TYPE.VEHICLE) {
              text = t('Added vehicle')
              // maxTicketsCount = availableTickets.vehicles !== 0 ? availableTickets.vehicles : reservesTickets.vehicles
              maxTicketsCount = reserveAndAvailabilityAmount.vehicles
            }

            if (type === TICKET_TYPE.TRAILER) {
              text = t('Added trailer')
              // maxTicketsCount = availableTickets.vehicles !== 0 ? availableTickets.vehicles : reservesTickets.vehicles
              maxTicketsCount = reserveAndAvailabilityAmount.vehicles
            }

            if (type === TICKET_TYPE.BICYCLE || priceCategory) {
              text = t('Added bicycle')
              iconType = 'ticket-bicycle'
              if (priceCategory === type) {
                // maxTicketsCount = availableTickets.bicycles !== 0 ? availableTickets.bicycles : reservesTickets.bicycles
                maxTicketsCount = reserveAndAvailabilityAmount.bicycles
              }
            }
            return (
              <React.Fragment key={idx}>
                <Grid item xs={9}>
                  <StyledTicketType>
                    <Box display="flex" justifyContent="space-between" width="100%" position="relative">
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={promotion ? 'space-between' : 'flex-start'}
                      >
                        <IconHolder
                          as={Icon[iconType]}
                          type={iconType === 'ticket-bicycle' ? TICKET_TYPE.BICYCLE : type}
                        />
                        {text}
                      </Box>
                      {promotion ? (
                        <PromotionText>
                          {promotionText ? promotionText : text}
                          {promotionPrice
                            ? ` (${asMoneyString(promotionPrice / 100)})`
                            : ` (${asMoneyString(price / 100)})`}
                        </PromotionText>
                      ) : null}
                      <Box display-if={resident} display="flex" alignItems="center" paddingLeft="10px">
                        <Box onClick={(): void => onTicketEdit(type)} display="flex" alignItems="center">
                          <EditIconHolder as={Icon['edit']} />
                        </Box>
                      </Box>
                      <Box
                        display-if={type === TICKET_TYPE.VEHICLE}
                        display="flex"
                        alignItems="center"
                        paddingLeft="10px"
                      >
                        <InsertedRegNumbers>{carNumber}</InsertedRegNumbers>
                        <InsertedNumbers description={carTicket.text}>{carTicket.text}</InsertedNumbers>
                      </Box>
                      <Box
                        display-if={type === TICKET_TYPE.TRAILER}
                        display="flex"
                        alignItems="center"
                        paddingLeft="10px"
                      >
                        <InsertedRegNumbers>{trailerNumber}</InsertedRegNumbers>
                        <InsertedNumbers description={trailerTicket.text}>{trailerTicket.text}</InsertedNumbers>
                      </Box>
                    </Box>
                  </StyledTicketType>
                </Grid>
                <Grid item xs={3}>
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    <div>
                      <ActionButton
                        display-if={!isMinusShown}
                        type="remove"
                        onClick={(): void => handleRemoveAction(type, resident)}
                      />
                      <ActionButton
                        display-if={isMinusShown}
                        type="decrease"
                        onClick={(): void => onTicketCountDecrease(type)}
                      />
                    </div>
                    <Box display="flex" justifyContent="center" width="80px" height="46px">
                      <Number>{count}</Number>
                    </Box>
                    <Box display="flex" justifyContent="center" width="46px" height="46px">
                      <ActionButton
                        display-if={!isMonoType(type)}
                        type={
                          handleCheckIfMaxReached({ maxReachedAmount: maxTicketsCount, count, type, resident })
                            ? 'disabled'
                            : 'increase'
                        }
                        onClick={(): void => handleIncreaseAction(type, resident, priceCategoryInitial, text)}
                        disabled={handleCheckIfMaxReached({ maxReachedAmount: maxTicketsCount, count, type, resident })}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid
                  display-if={handleCheckIfMaxReached({ maxReachedAmount: maxTicketsCount, count, type, resident })}
                  item
                  xs={12}
                >
                  <TicketWarning>
                    <TriangleShape isMonoType={isMonoType(type)} />
                    <p>{t('Maximum limit')}</p>
                  </TicketWarning>
                </Grid>
              </React.Fragment>
            )
          }
        )}
      </Grid>
      <Box display-if={!tempTickets.length} display="flex" justifyContent="center" alignItems="center" height="100%">
        <EmptyTicketsListPlaceholder>{t('Empty ticket list')}</EmptyTicketsListPlaceholder>
      </Box>
    </>
  )
}

export default AddedTicketsPanel
