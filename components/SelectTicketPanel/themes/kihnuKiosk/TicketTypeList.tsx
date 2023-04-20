import React, { FC, ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid } from '@material-ui/core'
import { Icon } from '@components/Icon'
import { IconHolder, StyledTicketType, PriceText } from './SelectTicketPanelStyles'
import { PassengerDeck, TripDeck, CarDeck } from '@interfaces/prices'
import { TicketType } from './selectTickets'
import { pathOr } from 'ramda'
import TICKET_TYPE from '@const/ticketTypes'
import { useAppState } from '../../../../hooks/useAppState'
import { useRouter } from 'next/router'
import {
  reducerForReservationTickets,
  ReservationAvailability,
  zeroAvailability,
} from '@components/SelectTicketPanel/themes/kihnuKiosk/AddedTicketsPanel'
import { Availability } from '@interfaces/salesCore'
import { asMoneyString } from '@utils/formatters'
import { logWithBeacon } from '@utils/logging'
import { extraordinaryStringLength } from '@const/common'
import ATTRIBUTES from '@const/attributes'

export interface TicketTypeListProps {
  data: TripDeck[]
  selectedTickets: TicketType[]
  onTicketTypeAdd: (param: TicketType) => void
  openAddIDMode: (type: string) => void
  openVehicleAddMode: () => void
  openTrailerAddMode: () => void
  handleExtraSpacing: (flag: boolean) => void
  openDriverFromReserveAlert: () => void
  isLocalCompanyVehicleHasBeenAdded: boolean
  handleAddingDriverFromReserve: (flag: boolean, ticket: TicketType) => void
  handleAddingResidentFromReserve: (flag: boolean) => void
}

const TicketTypeList: FC<TicketTypeListProps> = ({
  data,
  selectedTickets,
  onTicketTypeAdd,
  openAddIDMode,
  openVehicleAddMode,
  openTrailerAddMode,
  handleExtraSpacing,
  openDriverFromReserveAlert,
  isLocalCompanyVehicleHasBeenAdded,
  handleAddingDriverFromReserve,
  handleAddingResidentFromReserve,
}) => {
  const passengerTypes = data.filter(({ __typename }) =>
    __typename.startsWith(TICKET_TYPE.PASSENGER)
  ) as PassengerDeck[]
  const carDeckTypes = data.filter(({ __typename }) => __typename.startsWith(TICKET_TYPE.CAR)) as CarDeck[]
  const toType = (item): {} => {
    if (item.subType.toLowerCase() === TICKET_TYPE.BICYCLE) {
      const [realType] = item.types
      return {
        type: item.subType.toLowerCase(),
        text: item.subType.toLowerCase(),
        price: realType.price,
        priceCategory: realType.type,
      }
    }
    return { type: item.subType.toLowerCase(), text: item.subType.toLowerCase() }
  }
  const vehicleTypes = carDeckTypes[0].vehicleTypes.map(toType)

  const alreadyOnSail: ReservationAvailability = selectedTickets.reduce(reducerForReservationTickets, {
    ...zeroAvailability,
    passengerCategories: {},
    localPassengerCategories: {},
  })

  const renderDeckItem =
    (
      availableTickets: Availability,
      reservesTickets: Availability,
      deckTypesGroupsAmount: number,
      getTicketWithLocalInventoryAttribute: (ticket: TicketType) => void,
      // temporarily not used out until final test
      ticketWithLocalInventoryAttribute: TicketType
    ) =>
    (ticket: TicketType, idx, array): ReactElement => {
      const { type, text, resident, price, icon, virtual, seqN: ticketSeqN, attributes } = ticket
      const seqN = array.findIndex((it) => it.resident === false)
      const [maxReached, setMaxReached] = useState(array.reduce((acc, item) => ({ ...acc, [item.seqN]: false }), {}))
      const [isCategoryShownForLocalInventory, setCategoryShownForLocalInventory] = useState(false)
      const isNewGroup = (seqN > 1 ? [2, seqN + 1, 6, 11] : [2, 6, 11]).includes(idx)
      const isSelected =
        selectedTickets.map((item: TicketType) => item.type).includes(type) || selectedTickets.length >= 6
      const isCategoryShownForLocalInventoryFromAttributes =
        attributes?.find((attribute) => attribute.code === ATTRIBUTES.SHOW_ADULT_TICKET_LOCAL_INVENTORY_USAGE)
          ?.value === 'true'
      const vehiclesAreUnavailable = availableTickets.vehicles === 0 && reservesTickets.vehicles === 0

      const handleMaxReachingForBoundaries = (): void => {
        if (isCategoryShownForLocalInventoryFromAttributes || resident) {
          if (vehiclesAreUnavailable && !resident) {
            setMaxReached((prevState) => ({ ...prevState, [`${ticketSeqN}`]: true }))
          } else {
            setCategoryShownForLocalInventory(isCategoryShownForLocalInventoryFromAttributes)
            setMaxReached((prevState) => ({ ...prevState, [`${ticketSeqN}`]: false }))
          }
        } else if (!isCategoryShownForLocalInventoryFromAttributes && !resident) {
          setMaxReached((prevState) => ({ ...prevState, [`${ticketSeqN}`]: true }))
        }
      }

      useEffect(() => {
        if (availableTickets.passengers === 0 && reservesTickets.passengers === 0) {
          setMaxReached((prevState) => ({ ...prevState, [`${ticketSeqN}`]: true }))
        }
        if (isCategoryShownForLocalInventoryFromAttributes) {
          getTicketWithLocalInventoryAttribute(ticket)
        }
      }, [])

      useEffect(() => {
        if (
          availableTickets.passengers - alreadyOnSail.passengers <= 0 &&
          reservesTickets.passengers - alreadyOnSail.passengers > 0
        ) {
          handleMaxReachingForBoundaries()
        }
        if (availableTickets.passengers - alreadyOnSail.passengers > 0) {
          setCategoryShownForLocalInventory(false)
          setMaxReached((prevState) => ({ ...prevState, [`${ticketSeqN}`]: false }))
        }
        if (
          availableTickets.passengers - alreadyOnSail.passengers <= 0 &&
          reservesTickets.passengers - alreadyOnSail.passengers <= 0
        ) {
          if (availableTickets.passengers - alreadyOnSail.passengers <= -reservesTickets.passengers) {
            setMaxReached((prevState) => ({ ...prevState, [`${ticketSeqN}`]: true }))
          } else {
            handleMaxReachingForBoundaries()
          }
        }
      }, [alreadyOnSail.passengers, reservesTickets])

      let iconType = resident === true ? `ticket-citizen` : `ticket-adult`

      if (icon === TICKET_TYPE.VISUALLY_IMPAIRED_PERSON) {
        iconType = 'visually-impaired'
      } else if (icon === TICKET_TYPE.ACCOMPANYING_PERSON) {
        iconType = 'accompanying-impaired'
      } else if (icon === TICKET_TYPE.HANDICAPPED_PERSON) {
        iconType = 'handicapped-person'
      }

      const handleCheckIfResidentIsFromReserve = (): void => {
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

      const handleCheckIfDriverIsFromReserve = (): void => {
        if (
          availableTickets.passengers - alreadyOnSail.passengers <= 0 &&
          ((reservesTickets.passengers > availableTickets.passengers &&
            reservesTickets.passengers - alreadyOnSail.passengers >= 0) ||
            (reservesTickets.passengers < availableTickets.passengers && reservesTickets.passengers >= 1))
        ) {
          handleAddingDriverFromReserve(true, ticket)
        }
        // temporarily commented out until final test
        // if (availableTickets.passengers - alreadyOnSail.passengers === 1) {
        //   // preparing selected tickets component for watching at this price category if reserves are used further
        //   handleAddingDriverFromReserve(false, ticket)
        // }
      }

      // temporarily commented out until final test
      /*const handleCheckIfCategoryWithAttributeAdded = (): void => {
      if (
        availableTickets.passengers - alreadyOnSail.passengers === 1 &&
        reservesTickets.passengers >= 1 &&
        alreadyOnSail.passengerCategories[ticketWithLocalInventoryAttribute?.type]
      ) {
        handleAddingDriverFromReserve(false, ticketWithLocalInventoryAttribute)
      }
    }*/
      return (
        <React.Fragment key={idx}>
          {isNewGroup && (
            <Grid item xs={12}>
              <Box height={deckTypesGroupsAmount > 3 ? 1 : 6} />
            </Grid>
          )}
          <Grid item xs={6} key={idx}>
            <StyledTicketType
              isSelected={isSelected || maxReached[`${ticketSeqN}`]}
              extendedTicketsList={deckTypesGroupsAmount > 3}
              onClick={(): void => {
                if (isCategoryShownForLocalInventory && !isLocalCompanyVehicleHasBeenAdded) {
                  openDriverFromReserveAlert()
                  return
                }
                if (
                  isCategoryShownForLocalInventory ||
                  (!isCategoryShownForLocalInventory && isCategoryShownForLocalInventoryFromAttributes)
                ) {
                  handleCheckIfDriverIsFromReserve()
                }
                if (resident) {
                  handleCheckIfResidentIsFromReserve()
                }
                // temporarily commented out until final test
                // if (!isCategoryShownForLocalInventory && !isCategoryShownForLocalInventoryFromAttributes) {
                //   handleCheckIfCategoryWithAttributeAdded()
                // }
                logWithBeacon('addTicket', `ticket=${ticket.type}`)
                onTicketTypeAdd(ticket)
                resident === true && openAddIDMode(type)
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                fontSize={text?.length > extraordinaryStringLength ? '13px' : 'inherit'}
              >
                <IconHolder as={Icon[iconType]} type={type} isSelected={isSelected} />
                {text}
              </Box>
              <Box display-if={!virtual} display="flex" justifyContent="space-between" alignItems="center" pl={1.5}>
                <PriceText>{asMoneyString(price / 100)}</PriceText>
              </Box>
            </StyledTicketType>
          </Grid>
        </React.Fragment>
      )
    }

  const renderVehicleDeckItem =
    (availableTickets: Availability, reservesTickets: Availability, deckTypesGroupsAmount: number) =>
    (ticket, idx): ReactElement => {
      const { t } = useTranslation()
      const [maxReached, setMaxReached] = useState({ vehicle: false, trailer: false, bicycle: false })
      const { type, price } = ticket
      let text = ticket.text
      const isSelected =
        selectedTickets
          .map(({ type, priceCategory, text }: TicketType) => (priceCategory ? text : type))
          .includes(type) || selectedTickets.length >= 6
      if (type === TICKET_TYPE.VEHICLE) {
        text = t('Add vehicle')
      }

      if (type === TICKET_TYPE.TRAILER) {
        text = t('Add trailer')
      }

      if (type === TICKET_TYPE.BICYCLE) {
        text = t('Add bicycle')
      }
      useEffect(() => {
        if (type === TICKET_TYPE.VEHICLE || type === TICKET_TYPE.TRAILER) {
          setMaxReached((prevState) => ({
            ...prevState,
            vehicle: availableTickets.vehicles <= 0 && reservesTickets.vehicles <= 0,
          }))
        }

        if (type === TICKET_TYPE.BICYCLE) {
          setMaxReached((prevState) => ({
            ...prevState,
            bicycle: availableTickets.bicycles <= 0 && reservesTickets.bicycles <= 0,
          }))
        }
      }, [])

      useEffect(() => {
        if (
          availableTickets.vehicles - alreadyOnSail.vehicles <= 0 &&
          reservesTickets.vehicles - alreadyOnSail.vehicles <= 0
        ) {
          setMaxReached((prevState) => ({
            ...prevState,
            vehicle: true,
            trailer: true,
          }))
        } else {
          setMaxReached((prevState) => ({
            ...prevState,
            vehicle: false,
            trailer: false,
          }))
        }
      }, [alreadyOnSail.vehicles, reservesTickets])

      useEffect(() => {
        if (
          availableTickets.bicycles - alreadyOnSail.bicycles <= 0 &&
          reservesTickets.bicycles - alreadyOnSail.bicycles <= 0
        ) {
          setMaxReached((prevState) => ({
            ...prevState,
            bicycle: true,
          }))
        } else {
          setMaxReached((prevState) => ({
            ...prevState,
            bicycle: false,
          }))
        }
      }, [alreadyOnSail.bicycles, reservesTickets])

      return (
        <React.Fragment key={idx}>
          <Grid item xs={4} key={idx}>
            <StyledTicketType
              isSelected={isSelected || maxReached[`${type}`]}
              extendedTicketsList={deckTypesGroupsAmount > 3}
              onClick={(): void => {
                onTicketTypeAdd(ticket)
                type === TICKET_TYPE.VEHICLE && openVehicleAddMode()
                type === TICKET_TYPE.TRAILER && openTrailerAddMode()
              }}
            >
              {type === TICKET_TYPE.BICYCLE ? (
                <>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <IconHolder as={Icon[`ticket-${type}`]} type={type} isSelected={isSelected} />
                    {text}
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" pl={1.5}>
                    <PriceText>{asMoneyString(price / 100)}</PriceText>
                  </Box>
                </>
              ) : (
                <Box display="flex" justifyContent="flex-start" alignItems="center">
                  <IconHolder as={Icon[`ticket-${type}`]} type={type} isSelected={isSelected} />
                  {text}
                </Box>
              )}
            </StyledTicketType>
          </Grid>
        </React.Fragment>
      )
    }

  const passengerTypesProp = pathOr([], ['0', 'types'], passengerTypes)
  const localPassengers = passengerTypesProp.filter((item) => item.resident === true)
  const sortedPassengerTypesProp = [...localPassengers, ...passengerTypesProp.filter((item) => item.resident === false)]
  const deckTypes = [...sortedPassengerTypesProp]

  const {
    state: { availabilities, reserves },
  } = useAppState()

  const router = useRouter()
  const { query } = router
  const [deckTypesGroupsAmount, setDeckTypesGroupsAmount] = useState(0)
  const [ticketWithLocalInventoryAttribute, setTicketWithLocalInventoryAttribute] = useState({
    type: '',
    text: '',
  })
  const sailRefId: string = query.sailRefId.includes('>')
    ? (query.sailRefId as string).split('>')[0]
    : (query.sailRefId as string)

  const availableTickets = availabilities[sailRefId] || zeroAvailability
  const reservesTickets = reserves[sailRefId] || zeroAvailability

  useEffect(() => {
    const seqN = deckTypes.findIndex((it) => it.resident === false)
    deckTypes.forEach((item, idx) => {
      setDeckTypesGroupsAmount(
        (prevState) => prevState + Number((seqN > 1 ? [2, seqN + 1, 6, 11] : [2, 6, 11]).includes(idx))
      )
    })
  }, [])

  useEffect(() => {
    if (deckTypesGroupsAmount > 3) {
      handleExtraSpacing(true)
    }
  }, [deckTypesGroupsAmount])

  const getTicketWithLocalInventoryAttribute = (ticket: TicketType): void => {
    setTicketWithLocalInventoryAttribute(ticket)
  }

  return (
    <Grid container item xs={12} spacing={1}>
      {deckTypes.map(
        renderDeckItem(
          availableTickets,
          reservesTickets,
          deckTypesGroupsAmount,
          getTicketWithLocalInventoryAttribute,
          ticketWithLocalInventoryAttribute
        )
      )}
      <Grid item xs={12}>
        <Box height={deckTypesGroupsAmount > 3 ? 2 : 10} />
      </Grid>
      {vehicleTypes.map(renderVehicleDeckItem(availableTickets, reservesTickets, deckTypesGroupsAmount))}
    </Grid>
  )
}

export default TicketTypeList
