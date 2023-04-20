import React, { FC, useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { Box, Grid } from '@material-ui/core'

import { CarTicketType, SelectTicketPanelProps } from '@components/SelectTicketPanel'
import { PolygonGraphic, Root, Wrapper } from './SelectTicketPanelStyles'

import { AddIdCardPopup } from '@components/AddIdCardPopup'
import { AddVehiclePopup } from '@components/AddVehiclePopupUpd'
import { EditIdCardPopup } from '@components/EditIdCardPopup'
import { ActionPanel } from '@components/ActionPanel'
import { AlertPopup } from '@components/AlertPopup'

import SailDescription from './SailDescription'
import TicketTypeList from './TicketTypeList'
import SelectedTicketsPanel from './AddedTicketsPanel'

import { TicketType } from '@components/SelectTicketPanel/themes/kihnuKiosk/selectTickets'
import { useSelectTicket } from '@components/SelectTicketPanel/themes/kihnuKiosk/useSelectTicket'

import { CarDeck } from '@interfaces/prices'
import TICKET_TYPE from '@const/ticketTypes'
import { compose, filter, map, prop, reduce, reject, indexBy, isEmpty, propOr, pathOr, head } from 'ramda'
import { AppStateTypes, ReservationStatus, useAppState } from '../../../../hooks/useAppState'
import { useMutation, useQuery } from 'urql'
import cancelReservationMutation from '@gql/mutation/cancelReservation.graphql'
import reservationModification from '@gql/getReservationModification.graphql'
import { useAvailability } from '../../../../hooks/useAvailability'
import { ReservationLoad } from '@interfaces/boraCore'
import { formatItemsWithPromotions, itemToTickets } from '@utils/reservation'
import { logWithBeacon } from '@utils/logging'
import { AlertPopupType } from '@interfaces/popupStatus'

type VehicleTicket = { text: string; price: number }

type ReservationFinishResult = { reservationId: number; status: string }

const withoutZeroCounts = reject<TicketType>(({ count = 0 }) => count === 0)

const citizenOrVehicleOrTrailerPredicate = ({ type, resident = false }: TicketType): boolean =>
  type === TICKET_TYPE.VEHICLE || type === TICKET_TYPE.TRAILER || resident

const bicycleOrVehicleOrTrailerPredicate = ({ type, text }: TicketType): boolean =>
  type === TICKET_TYPE.VEHICLE || type === TICKET_TYPE.TRAILER || text === TICKET_TYPE.BICYCLE

interface TicketsState {
  editMode: boolean
  addMode: boolean
  addVehicleMode: boolean
  addVehicleStep: number
  tickets: TicketType[]
  idNumbers: string[]
  vehicleNumber: string
  carTicket: VehicleTicket
  currentIdNumberIdx: number
  chosenCarTicketIdx: number
  total: number
  roundTrip: boolean
}

export enum Types {
  setTotal,
  addTicket,
  remTicket,
  increase,
  decrease,
  addIdNumber,
  remIdNumber,
  addCarTicket,
  remCarTicket,
  setRoundTrip,
  setTickets,
}

export interface AddTicketAction {
  type: Types.addTicket
  payload: TicketType
}

export interface RemoveTicketAction {
  type: Types.remTicket
  payload: { type: string }
}

export interface IncQuantity {
  type: Types.increase
  payload: { type: string }
}

export interface DecQuantity {
  type: Types.decrease
  payload: { type: string }
}

export interface SetTotalAction {
  type: Types.setTotal
  payload: number
}

export interface SetRoundTripAction {
  type: Types.setRoundTrip
  payload: boolean
}

export interface SetTicketsAction {
  type: Types.setTickets
  payload: TicketType[]
}

export interface DriverTicketFromReserve {
  flag: boolean
  ticket: TicketType
}

export type SelectTicketAction =
  | AddTicketAction
  | RemoveTicketAction
  | DecQuantity
  | IncQuantity
  | SetTotalAction
  | SetRoundTripAction
  | SetTicketsAction

const initialState: TicketsState = {
  editMode: false,
  addMode: false,
  addVehicleMode: false,
  addVehicleStep: 0,
  idNumbers: [],
  vehicleNumber: '',
  carTicket: { text: '', price: 0 },
  currentIdNumberIdx: -1,
  chosenCarTicketIdx: -1,
  tickets: [],
  total: 0,
  roundTrip: false,
}

type countable = { price: number; count: number }

const calcTotal: (list: TicketType[]) => number = compose(
  reduce((total: number, val: countable): number => total + val.count * val.price, 0),
  map(({ count = 1, price }: TicketType) => ({ count, price }))
)
// Currently (fx8uRtbT) the tickets' order should not be sorted by price
/*const sortByPriceType = sortBy(compose(toLower, prop('type')))*/

const reducer: (s: TicketsState, a: SelectTicketAction) => TicketsState = (
  state: TicketsState = initialState,
  action: SelectTicketAction
) => {
  if (action.type === Types.setTotal) {
    return {
      ...state,
      total: action.payload,
    }
  }
  if (action.type === Types.setRoundTrip) {
    return {
      ...state,
      roundTrip: action.payload,
    }
  }
  if (action.type === Types.setTickets) {
    return {
      ...state,
      tickets: action.payload,
    }
  }

  const withoutThisType = state.tickets.filter(({ type }) => type !== action.payload.type)
  const ticket = state.tickets.find(({ type }) => type === action.payload.type)
  const factor = state.roundTrip ? 2 : 1

  switch (action.type) {
    case Types.addTicket: {
      const tickets = [
        ...state.tickets.filter((item) => item.type !== action.payload.type),
        { ...action.payload, count: 1 },
      ]
      const total = state.total + calcTotal([action.payload]) * factor
      return { ...state, tickets, total }
    }
    case Types.remTicket: {
      const tickets = [...withoutThisType, { ...ticket, count: 0 }]
      const total = state.total - calcTotal([ticket]) * factor
      return {
        ...state,
        total,
        tickets,
      }
    }
    case Types.increase: {
      const tickets = state.tickets.map((item) => {
        if (item.type === ticket.type) {
          return { ...item, count: ticket.count + 1 }
        } else return item
      })
      const total = state.total + ticket.price * factor
      return {
        ...state,
        total,
        tickets,
      }
    }
    case Types.decrease: {
      const tickets = state.tickets.map((item) => {
        if (item.type === ticket.type) {
          return { ...item, count: ticket.count - 1 }
        } else return item
      })
      const total = state.total - ticket.price * factor
      return {
        ...state,
        total,
        tickets,
      }
    }
    default:
      throw new Error(`Action Type ${action} cannot be handled`)
  }
}

const SelectTicketPanel: FC<SelectTicketPanelProps> = ({ sailRefId, tripSummary, ticketDecks, setGrandTotal }) => {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const { query } = router
  const { leg } = query

  const [firstLeg, secondLeg] = leg.toString().split('>')
  const firstSailRefId = sailRefId[0] || sailRefId
  const secondSailRefId = sailRefId[1] || undefined

  const port = leg.toString().split('-')[0]
  const { route = { code: '' } } = tripSummary
  const { state, dispatch: dispatchApp } = useAppState()
  const [ticketsState, dispatch] = useReducer(reducer, initialState)
  const [isIdle, setIdle] = useState(true)

  const { runQuery: reExecAvailabilityCheck } = useAvailability({
    port: state.port,
    sailRefId: firstSailRefId,
    ...(secondSailRefId && { backwardSailRefId: secondSailRefId }),
    dispatch: dispatchApp,
  })

  const [, cancelReservation] = useMutation<ReservationLoad>(cancelReservationMutation)

  const [openEditMode, setEditModeOpen] = useState(false)
  const [openAddMode, setAddModeOpen] = useState(false)
  const [openAddVehicleMode, setAddVehicleModeOpen] = useState(false)
  const [openAddTrailerMode, setAddTrailerModeOpen] = useState(false)
  const [selectedTickets, setSelectedTickets] = useState<TicketType[]>([])
  const [errorMessage, setErrorMessage] = useState({ flag: false, message: '', code: '' })
  const [selectedIdNumberIdx, setSelectedIdNumberIdx] = useState(-1)
  const [idNumbers, setIdNumbers] = useState([])
  const [isResidentAdded, setResidentAdded] = useState({ flag: false, type: '' })
  const [isResidentEdited, setResidentEdited] = useState({ type: '' })
  const [isVehicleRemoved, setVehicleRemoved] = useState('')
  const [isVehicleAdded, setVehicleAdded] = useState({
    flag: false,
    type: '',
    data: {},
    ticket: {
      type: '',
      text: '',
      count: 0,
    },
  })
  const [carNumber, setCarNumber] = useState('')
  const [trailerNumber, setTrailerNumber] = useState('')
  const [carTicket, setCarTicket] = useState({ text: '', price: 0 })
  const [trailerTicket, setTrailerTicket] = useState({ text: '', price: 0 })
  const [chosenCarTicketIdx, setChosenCarTicketIdx] = useState(-1)
  const [chosenTrailerTicketIdx, setChosenTrailerTicketIdx] = useState(-1)
  const [reservationId, setReservationId] = useState<number>()
  const [seqN, setSeqN] = useState([])
  const [vehicleSeqN, setVehicleSeqN] = useState([])
  const [dataForMutation, setDataForMutation] = useState({
    reservationId: 0,
    leg: '',
    sailRefId: 0,
    port: port,
    newRequestsAmount: {
      amount: 0,
      ticket: {
        type: '',
        text: '',
        count: 0,
      },
      reset: {
        flag: false,
        idNumbers: [],
      },
    },
    removing: false,
  })
  const [isAlertVehicleOnlyOpen, setAlertVehicleOnlyOpen] = useState(false)
  const [isAlertDriverFromReserveOpen, setAlertDriverFromReserveOpen] = useState(false)
  const [isSkipped, setIsSkipped] = useState(false)
  const [reTranslate, setReTranslate] = useState(false)
  const [, setPriceCategoryInitial] = useState('')
  const [PromotionShouldBeAddedToReservation, setPromotionShouldBeAddedToReservation] = useState(false)
  const [isExtraSpacing, setExtraSpacing] = useState(false)
  const [isDriverFromReserveAdded, setDriverFromReserveAdded] = useState<DriverTicketFromReserve>({
    flag: false,
    ticket: {
      type: '',
      text: '',
    },
  })
  const [isResidentFromReserveAdded, setResidentFromReserveAdded] = useState(false)
  const [typeFromIdManualInput, setTypeFromIdManualInput] = useState(undefined)

  const [modificationReservationResult, reQueryModification] = useQuery<{ modification: ReservationLoad }>({
    query: reservationModification,
    variables: {
      reservationId,
    },
    requestPolicy: 'network-only',
    pause: true,
  })

  useEffect(() => {
    if (reservationId)
      logWithBeacon(openAddMode ? 'openIdCardWindow' : 'closeIdCardWindow', `reservationId=${reservationId}`)
  }, [openAddMode])

  useEffect(() => {
    if (reservationId)
      logWithBeacon(openAddMode ? 'openVehicleWindow' : 'closeVehicleWindow', `reservationId=${reservationId}`)
  }, [openAddVehicleMode])

  useEffect(() => {
    if (reservationId)
      logWithBeacon(openAddMode ? 'openTrailerWindow' : 'closeTrailerWindow', `reservationId=${reservationId}`)
  }, [openAddTrailerMode])

  const setTotalPrice = useCallback((total: number): void => {
    dispatch({ type: Types.setTotal, payload: total })
    setGrandTotal(total)
  }, [])

  const interval = useRef<any>()

  useEffect(() => {
    setIdle(withoutZeroCounts(ticketsState.tickets).length === 0)
    dispatchApp({ type: AppStateTypes.setTotal, payload: ticketsState.total })
    clearTimeout(interval.current)

    if (withoutZeroCounts(ticketsState.tickets).length === 0 && ticketsState.tickets.length !== 0) {
      // console.log('sending 0 count tickets', ticketsState.tickets)
      return setSelectedTickets((prev: TicketType[]) => {
        return [...prev.filter(citizenOrVehicleOrTrailerPredicate), ...ticketsState.tickets]
      })
    }

    interval.current = setTimeout(() => {
      clearTimeout(interval.current)
      setIdle(true)
      if (withoutZeroCounts(ticketsState.tickets).length !== 0) {
        // console.log('✈️ Sending state tickets to backend', ticketsState.tickets)
        setSelectedTickets((prev: TicketType[]) => {
          return [...prev.filter(citizenOrVehicleOrTrailerPredicate), ...ticketsState.tickets]
        })
      }
    }, 1100)

    return (): void => clearInterval(interval.current)
  }, [ticketsState.tickets, setIdle, setSelectedTickets])

  const returnToSelectDateAndClearReservation = (): void => {
    dispatchApp({ type: AppStateTypes.flushReservation, payload: `${reservationId}` })
    router.push(`/select-date/${firstLeg}/?route=${state.route?.code}`)
  }

  const handleReservationModificationError = (): void => {
    reQueryModification({
      pause: false,
      requestPolicy: 'network-only',
    })
  }

  const cancelAddingTicketToState = (type: string): void => {
    dispatch({ type: Types.remTicket, payload: { type } })
  }

  useEffect(() => {
    if (modificationReservationResult.data) {
      const { data } = modificationReservationResult

      // eslint-disable-next-line no-console
      console.log('Handling modification error', data)
      if (isEmpty(data)) {
        // meaning there are no modifications / not in mod status
        returnToSelectDateAndClearReservation()
      }
    }
  }, [modificationReservationResult])

  const {
    initialReservation,
    selectTicketCallback,
    requestFinishReservation,
    requestRemoveResident,
    requestRemoveVehicle,
    isFetching,
    isVehicleAddedToReservation,
    isLocalCompanyVehicleHasBeenAdded,
    setVehicleAddedToReservation,
    isCitizenAddedToReservation,
    setCitizenAddedToReservation,
    isVehicleRemovedFromReservation,
    setVehicleRemovedFromReservation,
    setPromotionAddedToReservation,
    isPromotionAddedToReservation,
  } = useSelectTicket(handleReservationModificationError, returnToSelectDateAndClearReservation)

  useEffect(() => {
    if (state.reservationStatus === ReservationStatus.cleared) {
      cancelReservation({ reservationId }).catch(console.error)
    }
  }, [reservationId, state.reservationStatus])

  const carDeckTypes = ticketDecks.filter(({ __typename }) => __typename.startsWith(TICKET_TYPE.CAR)) as CarDeck[]

  const getXDeckTypesByVehicleType =
    (type: string) =>
    (carDeckTypes: CarDeck[]): CarTicketType[] => {
      const app = compose(
        propOr([], 'types'),
        head,
        filter(({ subType }) => subType.startsWith(type)),
        pathOr([], [0, 'vehicleTypes'])
      )
      return app(carDeckTypes) as CarTicketType[]
    }

  const carTickets = getXDeckTypesByVehicleType(TICKET_TYPE.VEHICLE.toUpperCase())(carDeckTypes)
  const trailerTickets = getXDeckTypesByVehicleType(TICKET_TYPE.TRAILER.toUpperCase())(carDeckTypes)

  useEffect(() => {
    if (calcTotal(selectedTickets) === 0) {
      dispatchApp({ type: AppStateTypes.setTotal, payload: 0 })
    }

    if (!selectedTickets.length) return

    const residentIdData = isResidentAdded.flag && idNumbers.find((item) => item.type === isResidentAdded.type)
    setVehicleAddedToReservation(false)
    setVehicleRemovedFromReservation(false)
    setCitizenAddedToReservation(false)
    setPromotionAddedToReservation(false)
    selectTicketCallback({
      isSkipped,
      setIsSkipped,
      leg: firstLeg,
      backLeg: secondLeg,
      reservationId,
      selectedTickets,
      setSelectedTickets,
      setErrorMessage,
      setReservationId,
      sailRefId: firstSailRefId,
      backSailRefId: secondSailRefId,
      setGrandTotal: setTotalPrice,
      setSeqN,
      setVehicleSeqN,
      residentId: residentIdData,
      vehicle: isVehicleAdded,
      shouldBePromoted: PromotionShouldBeAddedToReservation,
      dispatchForRemovingTicket: cancelAddingTicketToState,
    })
      .then(() => {
        // setTimeout(reExecAvailabilityCheck, 1500)
      })
      .catch(console.error)
    setResidentAdded({ flag: false, type: '' })
    setIsSkipped(false)
    if (openAddVehicleMode || openAddTrailerMode) {
      setVehicleAdded((prevState) => ({
        ...prevState,
        flag: false,
        data: {},
      }))
    } else {
      setVehicleAdded((prevState) => ({
        ...prevState,
        flag: false,
        type: '',
        data: {},
        ticket: {
          type: '',
          text: '',
          count: 0,
        },
      }))
    }
  }, [setReservationId, selectedTickets, firstSailRefId, secondSailRefId, setTotalPrice, reExecAvailabilityCheck])

  useEffect(() => {
    initialReservation(setReservationId, setTotalPrice).catch(console.error)
    if (secondSailRefId) {
      dispatch({ type: Types.setRoundTrip, payload: true })
    }
    reExecAvailabilityCheck()
  }, [])

  useEffect(() => {
    reQueryModification({
      pause: false,
      requestPolicy: 'network-only',
    })
    setReTranslate(true)
  }, [i18n.language])

  useEffect(() => {
    if (
      isCitizenAddedToReservation ||
      isVehicleAddedToReservation ||
      isLocalCompanyVehicleHasBeenAdded ||
      isVehicleRemovedFromReservation ||
      isPromotionAddedToReservation
    ) {
      reQueryModification({
        pause: false,
        requestPolicy: 'network-only',
      })
      if (isVehicleRemovedFromReservation && isDriverFromReserveAdded.flag) {
        setDriverFromReserveAdded((prevState) => ({
          ...prevState,
          flag: false,
          ticket: {
            text: '',
            type: '',
          },
        }))
        return
      }
      if (typeFromIdManualInput) {
        setTypeFromIdManualInput(undefined)
      }
      setReTranslate(true)
      if (isPromotionAddedToReservation) {
        setPromotionShouldBeAddedToReservation(false)
      }
    }
  }, [
    isCitizenAddedToReservation,
    isVehicleAddedToReservation,
    isVehicleRemovedFromReservation,
    isPromotionAddedToReservation,
  ])

  useEffect(() => {
    if (modificationReservationResult.data && modificationReservationResult.data.modification?.sailPackages?.length) {
      const { sailPackages } = modificationReservationResult.data.modification
      const [sp] = sailPackages
      if (sp.sailRefs.length) {
        // assuming same items for round trip
        const [firstSailRef] = sp.sailRefs
        let ticketsFromReservation = itemToTickets(firstSailRef.items)
        const typesFromReservation = ticketsFromReservation.map((item) => item.type)
        const typesWithPromotion = typesFromReservation.filter((item, idx) => typesFromReservation.indexOf(item) != idx)

        if (typesWithPromotion.length) {
          ticketsFromReservation = formatItemsWithPromotions({ typesWithPromotion, ticketsFromReservation })
        }
        const mapByType = indexBy(prop('type'), ticketsFromReservation)
        const mapBySubType = indexBy(prop('subType'), ticketsFromReservation)

        if (reTranslate) {
          setReTranslate(false)
          dispatch({
            type: Types.setTickets,
            payload: ticketsState.tickets.map((ticket) => {
              let t = mapByType[ticket.type]
              if (ticket.type === TICKET_TYPE.VEHICLE || ticket.type === TICKET_TYPE.TRAILER) {
                t = mapBySubType[ticket.type.toUpperCase()]
                ticket.type === TICKET_TYPE.VEHICLE
                  ? setCarTicket((prevState) => ({ ...prevState, ...(t && { text: t.text }) }))
                  : setTrailerTicket((prevState) => ({ ...prevState, ...(t && { text: t.text }) }))
              }
              return {
                ...ticket,
                ...(t && { text: t.text }),
                ...(t && { count: t.count }),
                ...(t && { price: t.price }),
                ...(t && { promotion: t.promotion }),
                ...(t && { promotionText: t.promotionText }),
                ...(t && { promotionPrice: t.promotionPrice }),
              }
            }),
          })
        }
      }
    }
  }, [setSelectedTickets, setReTranslate, modificationReservationResult.data])

  const handleCheckout = async (): Promise<ReservationFinishResult> => requestFinishReservation(reservationId, port)

  const { push }: NextRouter = useRouter()

  const handleAlertVehicleOnlyOnClose = (): void => {
    setAlertVehicleOnlyOpen(false)
  }

  const handleAlertVehicleOnlyOnSubmit = async (): Promise<void> => {
    try {
      const { reservationId }: ReservationFinishResult = await handleCheckout()
      logWithBeacon('proceedToSummary', `reservationId=${reservationId}`)
      await push(`/summary/${reservationId}`)
    } catch (e) {
      dispatchApp({ type: AppStateTypes.startAgain, payload: true })
    }
  }

  const onClickAsync = async (tickets): Promise<void> => {
    const transportTypeTickets = filter(bicycleOrVehicleOrTrailerPredicate)(tickets)
    const realTickets = withoutZeroCounts(tickets)

    if (transportTypeTickets.length && transportTypeTickets.length === realTickets.length) {
      setAlertVehicleOnlyOpen(true)
    } else {
      try {
        const { reservationId }: ReservationFinishResult = await handleCheckout()
        logWithBeacon('proceedToSummary', `reservationId=${reservationId}`)
        await push(`/summary/${reservationId}`)
      } catch (e) {
        dispatchApp({ type: AppStateTypes.startAgain, payload: true })
      }
    }
  }

  const handleAddModeOpen = async (): Promise<void> => {
    setAddModeOpen(true)
    if (reservationId && open) {
      setDataForMutation((prevState) => ({
        ...prevState,
        leg: firstLeg,
        sailRefId: firstSailRefId,
        backLeg: secondLeg,
        backSailRefId: secondSailRefId,
        reservationId: reservationId,
        newRequestsAmount: {
          ...prevState.newRequestsAmount,
          amount: prevState.newRequestsAmount.amount + 1,
        },
      }))
    }
  }

  const handleTicketTypeClick = async (ticketType: TicketType): Promise<void> => {
    const newTicketType = { ...ticketType, count: 1 }
    if (ticketType.resident === true) {
      setDataForMutation((prevState) => ({
        ...prevState,
        newRequestsAmount: {
          ...prevState.newRequestsAmount,
          amount: 0,
          ticket: newTicketType,
          reset: idNumbers.find((item) => item.type === ticketType.type)
            ? {
                flag: true,
                idNumbers: [],
              }
            : {
                flag: false,
                idNumbers: [],
              },
        },
        removing: false,
      }))
      return
    }
    if (ticketType.type === TICKET_TYPE.VEHICLE || ticketType.type === TICKET_TYPE.TRAILER) {
      setVehicleAdded((prevState) => ({
        ...prevState,
        ticket: newTicketType,
      }))
      return
    }

    if (ticketType.type === TICKET_TYPE.BICYCLE) {
      return dispatch({ type: Types.addTicket, payload: { ...ticketType, type: ticketType.priceCategory } })
    }
    if (
      ticketType.type !== TICKET_TYPE.VEHICLE &&
      ticketType.type !== TICKET_TYPE.TRAILER &&
      ticketsState.tickets &&
      ticketsState.tickets.some((item) => item.type === TICKET_TYPE.VEHICLE)
    ) {
      setPromotionShouldBeAddedToReservation(true)
    }
    dispatch({ type: Types.addTicket, payload: ticketType })
  }

  const handleTicketCountIncrease = (type: string, resident: boolean, priceCategoryInitial?: string): void => {
    if (resident) {
      const currentResidentType = selectedTickets.find((item) => item.priceCategoryInitial === priceCategoryInitial)
      if (currentResidentType) {
        setDataForMutation((prevState) => ({
          ...prevState,
          newRequestsAmount: {
            ...prevState.newRequestsAmount,
            ticket: {
              ...currentResidentType,
              count: currentResidentType.count + 1,
              type: priceCategoryInitial ? priceCategoryInitial : currentResidentType.type,
            },
            reset: {
              flag: false,
              idNumbers: [],
            },
          },
          removing: false,
        }))
      }

      handleAddModeOpen().catch(console.error)
      return
    }
    dispatch({ type: Types.increase, payload: { type: priceCategoryInitial ? priceCategoryInitial : type } })
  }

  const handleTicketCountDecrease = (type: string): void => {
    dispatch({ type: Types.decrease, payload: { type } })
  }

  const handleTicketRemove = (type: string): void => {
    // setIsSkipped(false)
    if (type === TICKET_TYPE.VEHICLE || type === TICKET_TYPE.TRAILER) {
      setVehicleRemoved(type)
      const currentVehicleSeqN = vehicleSeqN.find((item) => item.type === type)
      requestRemoveVehicle(reservationId, currentVehicleSeqN.seqN, seqN, setTotalPrice).catch(console.error)
      setVehicleSeqN((prevState) => {
        return prevState.filter((item) => item.type !== type)
      })
      if (type === TICKET_TYPE.TRAILER) {
        setChosenTrailerTicketIdx(-1)
        setTrailerTicket({ text: '', price: 0 })
      } else if (type === TICKET_TYPE.VEHICLE) {
        setChosenCarTicketIdx(-1)
        setCarTicket({ text: '', price: 0 })
      }
      dispatch({ type: Types.remTicket, payload: { type } })
      if (isDriverFromReserveAdded.flag) {
        if (ticketsState?.tickets.find((ticket) => ticket.type === isDriverFromReserveAdded.ticket?.type)?.count > 1) {
          dispatch({ type: Types.decrease, payload: { type: isDriverFromReserveAdded?.ticket?.type } })
        } else {
          dispatch({ type: Types.remTicket, payload: { type: isDriverFromReserveAdded?.ticket?.type } })
        }
      }
    } else {
      if (isDriverFromReserveAdded.flag && isDriverFromReserveAdded.ticket?.type === type) {
        setDriverFromReserveAdded((prevState) => ({
          ...prevState,
          flag: false,
          ticket: {
            text: '',
            type: '',
          },
        }))
      }
      dispatch({ type: Types.remTicket, payload: { type } })
    }
  }

  const handleEditModeOpen = (type: string): void => {
    setResidentEdited((prevState) => ({ ...prevState, type }))
    setEditModeOpen(true)
  }

  const handleEditModeClose = (): void => {
    setEditModeOpen(false)
    setSelectedIdNumberIdx(-1)
  }

  const handleAddModeClose = (): void => {
    setAddModeOpen(false)
  }

  const handleAddVehicleModeOpen = (): void => {
    setAddVehicleModeOpen(true)
  }

  const handleAddTrailerModeOpen = (): void => {
    setAddTrailerModeOpen(true)
  }

  const handleAddVehicleModeClose = (): void => {
    setAddVehicleModeOpen(false)
  }

  const handleAddTrailerModeClose = (): void => {
    setAddTrailerModeOpen(false)
  }

  const handleConfirmDeletion = (type: string): void => {
    const idNumbersFilteredByType = [...idNumbers].find((item) => item.type === type)
    const selectedItem = idNumbersFilteredByType?.idNumbers[selectedIdNumberIdx]
    const detectNumber = idNumbersFilteredByType?.idNumbers.filter((number) => number !== selectedItem)
    setSelectedIdNumberIdx(-1)
    setIdNumbers((prevState) => {
      const idx = [...prevState].findIndex((item) => item.type === type)
      return prevState.map((item, index) => (index === idx ? { ...item, idNumbers: detectNumber } : item))
    })
    requestRemoveResident(reservationId, selectedItem, seqN, setTotalPrice).catch(console.error)
    if (
      dataForMutation.newRequestsAmount.ticket?.count <= 1 &&
      dataForMutation.newRequestsAmount.ticket.type === type
    ) {
      setDataForMutation((prevState) => ({
        ...prevState,
        newRequestsAmount: {
          ...prevState.newRequestsAmount,
          ticket: {
            ...prevState.newRequestsAmount.ticket,
            count: 0,
          },
          amount: 0,
        },
        removing: true,
      }))
      setSelectedTickets((prev: TicketType[]) => {
        return prev.filter((ticket) => ticket.type !== type)
      })
      dispatch({ type: Types.remTicket, payload: { type } })
    } else if (dataForMutation.newRequestsAmount.ticket.type !== type && detectNumber.length < 1) {
      setSelectedTickets((prev: TicketType[]) => {
        return prev.filter((ticket) => ticket.type !== type)
      })
      dispatch({ type: Types.remTicket, payload: { type } })
    } else {
      const newArray = selectedTickets.map((ticket: TicketType) => {
        return ticket.type === dataForMutation.newRequestsAmount.ticket.type
          ? { ...ticket, count: ticket.count - 1 }
          : ticket
      })
      setDataForMutation((prevState) => ({
        ...prevState,
        newRequestsAmount: {
          ...prevState.newRequestsAmount,
          ticket: {
            ...prevState.newRequestsAmount.ticket,
            count: prevState.newRequestsAmount.ticket.count - 1,
          },
          amount: prevState.newRequestsAmount.amount - 1,
          reset: idNumbers.find((item) => item.type === type)
            ? {
                flag: true,
                idNumbers: detectNumber,
              }
            : {
                flag: false,
                idNumbers: [],
              },
        },
        removing: true,
      }))
      setSelectedTickets(newArray)
      dispatch({ type: Types.decrease, payload: { type } })
    }
  }

  const handleOnAddCarTicketIdx = (idx: number): void => {
    setChosenCarTicketIdx(idx)
    setCarTicket({
      text: carTickets[idx].text,
      price: carTickets[idx].price,
    })
  }

  const handleOnAddTrailerTicketIdx = (idx: number): void => {
    setChosenTrailerTicketIdx(idx)
    setTrailerTicket({
      text: trailerTickets[idx].text,
      price: trailerTickets[idx].price,
    })
  }

  const handleExtraSpacing = (flag: boolean): void => {
    setExtraSpacing(flag)
  }

  const manageIdNumbers = (array, type, isFailed = false, isManual = false): void => {
    if (isManual) {
      setTypeFromIdManualInput(type)
    }
    if (isFailed) {
      setIsSkipped(false)
      if (dataForMutation.newRequestsAmount.ticket?.count <= 1) {
        setDataForMutation((prevState) => ({
          ...prevState,
          newRequestsAmount: {
            ...prevState.newRequestsAmount,
            ticket: {
              ...prevState.newRequestsAmount.ticket,
              count: 0,
            },
            amount: 0,
          },
          removing: true,
        }))
        if (isManual) {
          dispatch({ type: Types.remTicket, payload: { type: typeFromIdManualInput } })
          setTypeFromIdManualInput(undefined)
        }
      } else {
        setDataForMutation((prevState) => ({
          ...prevState,
          newRequestsAmount: {
            ...prevState.newRequestsAmount,
            ticket: {
              ...prevState.newRequestsAmount.ticket,
              count: prevState.newRequestsAmount.ticket.count - 1,
            },
            amount: prevState.newRequestsAmount.amount - 1,
          },
          removing: true,
        }))
        if (isManual) {
          dispatch({ type: Types.decrease, payload: { type: typeFromIdManualInput } })
          setTypeFromIdManualInput(undefined)
        }
      }
      return
    }
    setIsSkipped(false)
    setIdNumbers([...array])
    setPriceCategoryInitial(dataForMutation.newRequestsAmount.ticket.type)
    setResidentAdded((prevState) => ({ ...prevState, flag: true, type }))
    if (
      dataForMutation.newRequestsAmount.ticket?.count <= 1 ||
      (dataForMutation.newRequestsAmount.ticket?.count > 1 && dataForMutation.newRequestsAmount.ticket.type !== type)
    ) {
      dispatch({
        type: Types.addTicket,
        payload: {
          ...dataForMutation.newRequestsAmount.ticket,
          type,
          priceCategoryInitial: dataForMutation.newRequestsAmount.ticket.type,
        },
      })
      setSelectedTickets((prev: TicketType[]) => {
        return [
          ...prev,
          {
            ...dataForMutation.newRequestsAmount.ticket,
            type,
            priceCategoryInitial: dataForMutation.newRequestsAmount.ticket.type,
          },
        ]
      })
    } else {
      dispatch({ type: Types.increase, payload: { type } })
      const newArray = selectedTickets.map((ticket: TicketType) => {
        return ticket.type === type ? { ...ticket, count: ticket.count + 1 } : ticket
      })
      setSelectedTickets(newArray)
    }
  }
  const manageVehicleNumbers = (
    vehicleNumber: string,
    type: string,
    data: {
      automatic?: {
        companyRegistrationNumber?: string
        handicapped?: boolean
        priceCategoryTitle: string
        price: number
      }
      manual?: {
        priceCategory: string
        heightInCm: number
        lengthInCm: number
        widthInCm: number
        weightInKg: number
        price: number
        companyRegistrationNumber?: string
      }
    }
  ): void => {
    setIsSkipped(false)
    if (type === TICKET_TYPE.VEHICLE) {
      setCarNumber(vehicleNumber)
      if (data.automatic) {
        setCarTicket({
          text: data.automatic.priceCategoryTitle,
          price: data.automatic.price,
        })
      }
    } else {
      setTrailerNumber(vehicleNumber)
      if (data.automatic) {
        setTrailerTicket({
          text: data.automatic.priceCategoryTitle,
          price: data.automatic.price,
        })
      }
    }
    setVehicleAdded((prevState) => ({
      ...prevState,
      flag: true,
      type: type,
      data: data.manual
        ? {
            manual: {
              licencePlate: vehicleNumber,
              priceCategory: data.manual.priceCategory,
              heightInCm: data.manual.heightInCm,
              lengthInCm: data.manual.lengthInCm,
              widthInCm: data.manual.widthInCm,
              weightInKg: data.manual.weightInKg,
              companyRegistrationNumber: data.manual.companyRegistrationNumber,
            },
          }
        : {
            automatic: {
              licencePlate: vehicleNumber,
              companyRegistrationNumber: data.automatic.companyRegistrationNumber,
              handicapped: data.automatic.handicapped,
            },
          },
    }))

    if (isVehicleAdded.ticket) {
      dispatch({
        type: Types.addTicket,
        payload: {
          type,
          text: isVehicleAdded.ticket.text,
          count: 1,
          price: 0,
        },
      })
    }
  }
  const handleAddingDriverFromReserve = (flag: boolean, ticket: TicketType): void => {
    setDriverFromReserveAdded({ flag, ticket })
  }
  const handleAddingResidentFromReserve = (flag: boolean): void => {
    setResidentFromReserveAdded(flag)
  }
  const handleAlertDriverFromReserveOnClose = (): void => {
    setAlertDriverFromReserveOpen(false)
  }
  const handleAlertDriverFromReserveOnOpen = (): void => {
    setAlertDriverFromReserveOpen(true)
  }
  const handleAlertDriverFromReserveOnAccept = (): void => {
    handleAlertDriverFromReserveOnClose()
    handleAddVehicleModeOpen()
  }

  /*const ticketsToShow = [
    ...withoutZeroCounts(ticketsState.tickets.filter((ticket) => ticket.type !== typeFromIdManualInput)),
  ]*/
  const ticketsToShow = [...withoutZeroCounts(ticketsState.tickets)]

  return (
    <Root>
      <AlertPopup
        type={AlertPopupType.ALERT}
        alertOpen={isAlertVehicleOnlyOpen}
        handleAlertOnClose={handleAlertVehicleOnlyOnClose}
        handleOnSubmit={handleAlertVehicleOnlyOnSubmit}
        message={t('Without driver', {
          tagStart: '<p>',
          tagEnd: '</p>',
        })}
      />
      <AlertPopup
        type={AlertPopupType.ALERT}
        alertOpen={isAlertDriverFromReserveOpen}
        handleAlertOnClose={handleAlertDriverFromReserveOnClose}
        handleOnSubmit={handleAlertDriverFromReserveOnAccept}
        message={t('Driver From Reserve', {
          tagStart: '<p>',
          tagEnd: '</p>',
        })}
      />
      <Box display="flex" flexDirection="column" alignContent="space-between" height="100%">
        <Box marginBottom="auto">
          <SailDescription
            roundTrip={ticketsState.roundTrip}
            {...tripSummary}
            port={port}
            isExtraSpacing={isExtraSpacing}
          />
          <Wrapper>
            <Grid container spacing={7}>
              <Grid item xs={6}>
                <TicketTypeList
                  data={ticketDecks}
                  selectedTickets={ticketsToShow}
                  onTicketTypeAdd={handleTicketTypeClick}
                  openAddIDMode={handleAddModeOpen}
                  openVehicleAddMode={handleAddVehicleModeOpen}
                  openTrailerAddMode={handleAddTrailerModeOpen}
                  handleExtraSpacing={handleExtraSpacing}
                  openDriverFromReserveAlert={handleAlertDriverFromReserveOnOpen}
                  isLocalCompanyVehicleHasBeenAdded={isLocalCompanyVehicleHasBeenAdded}
                  handleAddingDriverFromReserve={handleAddingDriverFromReserve}
                  handleAddingResidentFromReserve={handleAddingResidentFromReserve}
                />
              </Grid>
              <Grid item xs={6}>
                <Box position="relative" height="100%">
                  <PolygonGraphic />
                  <SelectedTicketsPanel
                    tempTickets={ticketsToShow}
                    carNumber={carNumber}
                    trailerNumber={trailerNumber}
                    carTicket={carTicket}
                    trailerTicket={trailerTicket}
                    onTicketCountDecrease={handleTicketCountDecrease}
                    onTicketCountIncrease={handleTicketCountIncrease}
                    onTicketTypeRemove={handleTicketRemove}
                    onVehicleTicketView={handleAddVehicleModeOpen}
                    onTicketEdit={handleEditModeOpen}
                    isDriverFromReserveAdded={isDriverFromReserveAdded}
                    isResidentFromReserveAdded={isResidentFromReserveAdded}
                    isLocalCompanyVehicleHasBeenAdded={isLocalCompanyVehicleHasBeenAdded}
                    openDriverFromReserveAlert={handleAlertDriverFromReserveOnOpen}
                    handleAddingDriverFromReserve={handleAddingDriverFromReserve}
                    handleAddingResidentFromReserve={handleAddingResidentFromReserve}
                  />
                </Box>
              </Grid>
            </Grid>
          </Wrapper>
        </Box>
        <ActionPanel
          backText={t('Go back to change date and time')}
          cancelText={t('Cancel and restart')}
          handleCancelButton={returnToSelectDateAndClearReservation}
          submitText={t('Proceed to checkout', {
            tagLowercaseStart: '<span class="lowercase-text">',
            tagUppercaseStart: '<span class="uppercase-text">',
            tagEnd: '</span>',
          })}
          submitHref={`/summary/${reservationId}`}
          isEnabled={Boolean(ticketsToShow.length) && !isFetching && isIdle}
          isBusy={isFetching || !isIdle}
          onClickAsync={async (): Promise<void> => await onClickAsync(ticketsToShow)}
        />
      </Box>
      <EditIdCardPopup
        open={openEditMode}
        handleOnClose={handleEditModeClose}
        data={[...idNumbers].find((item) => item.type === isResidentEdited.type) || []}
        selectedIdNumberIdx={selectedIdNumberIdx}
        setSelectedIdNumberIdx={setSelectedIdNumberIdx}
        handleConfirmDeletion={handleConfirmDeletion}
      />
      <AddIdCardPopup
        display-if={reservationId}
        open={openAddMode}
        handleOnClose={handleAddModeClose}
        dataForMutation={dataForMutation}
        manageIds={manageIdNumbers}
        reservationError={errorMessage}
        isCitizenAddedToReservation={isCitizenAddedToReservation}
      />
      <AddVehiclePopup
        dataForVehicleQuery={{
          type: TICKET_TYPE.VEHICLE,
          route: route.code,
          sailRefId: firstSailRefId,
          backSailRefId: secondSailRefId,
          reservationId,
          isRoundTrip: Boolean(secondSailRefId && secondLeg),
        }}
        open={openAddVehicleMode}
        handleOnClose={handleAddVehicleModeClose}
        isVehicleRemoved={isVehicleRemoved}
        manageVehicleNumbers={manageVehicleNumbers}
        chosenVehicleTicketIdx={chosenCarTicketIdx}
        setChosenVehicleTicketIdx={handleOnAddCarTicketIdx}
        tickets={carTickets}
        selectedTicket={carTicket}
        setSelectedTicket={setCarTicket}
        reservationError={errorMessage}
        timeOfDeparture={
          tripSummary.timeOfDepartureFrom
            ? {
                to: tripSummary.timeOfDepartureTo,
                from: tripSummary.timeOfDepartureFrom,
              }
            : {
                to: tripSummary.timeOfDepartureTo,
              }
        }
        isVehicleAddedToReservation={isVehicleAddedToReservation}
      />
      <AddVehiclePopup
        dataForVehicleQuery={{
          type: TICKET_TYPE.TRAILER,
          route: route.code,
          sailRefId: firstSailRefId,
          backSailRefId: secondSailRefId,
          reservationId,
          isRoundTrip: Boolean(secondSailRefId && secondLeg),
        }}
        open={openAddTrailerMode}
        handleOnClose={handleAddTrailerModeClose}
        isVehicleRemoved={isVehicleRemoved}
        manageVehicleNumbers={manageVehicleNumbers}
        chosenVehicleTicketIdx={chosenTrailerTicketIdx}
        setChosenVehicleTicketIdx={handleOnAddTrailerTicketIdx}
        tickets={trailerTickets}
        selectedTicket={trailerTicket}
        setSelectedTicket={setTrailerTicket}
        reservationError={errorMessage}
        timeOfDeparture={
          tripSummary.timeOfDepartureFrom
            ? {
                to: tripSummary.timeOfDepartureTo,
                from: tripSummary.timeOfDepartureFrom,
              }
            : {
                to: tripSummary.timeOfDepartureTo,
              }
        }
        isVehicleAddedToReservation={isVehicleAddedToReservation}
      />
    </Root>
  )
}

export default SelectTicketPanel
