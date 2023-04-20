import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef } from 'react'
import { KioskInfoData, KioskSailPackage, ReservationLoad, Route } from '@interfaces/boraCore'
import getConfig from 'next/config'
import { PublicConfig } from '@pages/info'
import { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from 'urql'
import getKioskRoutes from '@gql/getKioskRoutes.graphql'
import { useTranslation } from 'react-i18next'
import { Availability } from '@interfaces/salesCore'
import cancelReservationMutation from '@gql/mutation/cancelReservation.graphql'
import { useHotkeys } from 'react-hotkeys-hook'
import { isProductionEnv } from '@utils/env'

const { publicRuntimeConfig } = getConfig()
const { idleTimeout, env } = publicRuntimeConfig as PublicConfig

export enum ReservationStatus {
  cleared,
  started,
  initial,
}

export interface SailAvailability {
  [key: string]: Availability
}

export interface AppState {
  port: string
  selectedDate: Date
  selectedDateFrom?: Date
  locale: string
  route?: Route
  reservationStatus: ReservationStatus
  sailPackages: KioskSailPackage[]
  total: number
  preferredLocale: string
  startAgain: boolean
  currentResId: string
  availabilities: SailAvailability
  reserves: SailAvailability
  openedPaymentPopup: boolean
  cursorHidden: boolean
}

export const defaultAppState: AppState = {
  port: '',
  selectedDate: new Date(),
  locale: 'en',
  reservationStatus: ReservationStatus.initial,
  sailPackages: [],
  total: 0,
  preferredLocale: 'et',
  startAgain: false,
  currentResId: '',
  availabilities: {},
  reserves: {},
  openedPaymentPopup: false,
  cursorHidden: isProductionEnv(),
}

export enum AppStateTypes {
  setLocale = 'SetLocale',
  setSelectedDate = 'SetSelectedDate',
  setSelectedDateFrom = 'SetSelectedDateFrom',
  setRoute = 'SetRoute',
  startReservation = 'StartReservation',
  flushReservation = 'FlushReservation',
  setToInitial = 'SetToInitial',
  setPort = 'SetPort',
  setSailPackages = 'SetSailPackages',
  setPreferredLocale = 'SetPreferredLocale',
  setTotal = 'SetTotal',
  startAgain = 'StartAgain',
  addAvailability = 'AddAvailability',
  addReserve = 'AddReserve',
  setOpenedPaymentPopup = 'SetOpenedPaymentPopup',
  cursorEnable = 'cursorEnable',
}

export interface SetLocaleAction {
  type: AppStateTypes.setLocale
  payload: string
}

export interface SetSelectedDateAction {
  type: AppStateTypes.setSelectedDate
  payload: Date
}

export interface SetSelectedFromDateAction {
  type: AppStateTypes.setSelectedDateFrom
  payload: Date
}

export interface AddRouteLegAction {
  type: AppStateTypes.setRoute
  payload: Route
}

export interface StartReservationAction {
  type: AppStateTypes.startReservation
  payload: string
}

export interface FlushReservationAction {
  type: AppStateTypes.flushReservation
  payload: string
}

export interface SetReservationToInitialAction {
  type: AppStateTypes.setToInitial
}

export interface SetPortAction {
  type: AppStateTypes.setPort
  payload: string
}

export interface SetSailPackagesAction {
  type: AppStateTypes.setSailPackages
  payload: KioskSailPackage[]
}

export interface SetPreferredLocaleAction {
  type: AppStateTypes.setPreferredLocale
  payload: string
}

export interface SetTotalAction {
  type: AppStateTypes.setTotal
  payload: number
}

export interface StartAgainAction {
  type: AppStateTypes.startAgain
  payload: boolean
}

export interface AddAvailabilityAction {
  type: AppStateTypes.addAvailability
  payload: SailAvailability
}

export interface AddReserveAction {
  type: AppStateTypes.addReserve
  payload: SailAvailability
}

export interface SetOpenedPaymentPopupAction {
  type: AppStateTypes.setOpenedPaymentPopup
  payload: boolean
}

export interface SetCursorEnabled {
  type: AppStateTypes.cursorEnable
  payload: boolean
}

export type AppAction =
  | SetLocaleAction
  | SetSelectedFromDateAction
  | SetSelectedDateAction
  | AddRouteLegAction
  | StartReservationAction
  | FlushReservationAction
  | SetReservationToInitialAction
  | SetPortAction
  | SetSailPackagesAction
  | SetTotalAction
  | SetPreferredLocaleAction
  | StartAgainAction
  | AddAvailabilityAction
  | AddReserveAction
  | SetOpenedPaymentPopupAction
  | SetCursorEnabled

export interface AppStateContextProps {
  state: AppState
  dispatch: React.Dispatch<AppAction>
}

const neverError = (message: string, token: never): void => {
  throw new Error(`${message} : ${token} should not exist`)
}

const appStateReducer = (state: AppState, action: AppAction): AppState => {
  // eslint-disable-next-line no-console
  // console.log(
  //   `${new Intl.DateTimeFormat('et-EE', { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(
  //     new Date()
  //   )} action: `,
  //   action
  // )
  switch (action.type) {
    case AppStateTypes.setSelectedDate: {
      const selectedDate = action.payload
      return { ...state, selectedDate }
    }
    case AppStateTypes.setLocale: {
      const locale = action.payload
      return { ...state, locale }
    }
    case AppStateTypes.setRoute: {
      return { ...state, route: action.payload }
    }
    case AppStateTypes.setToInitial: {
      return { ...state, reservationStatus: ReservationStatus.initial, currentResId: '' }
    }
    case AppStateTypes.flushReservation: {
      return { ...state, reservationStatus: ReservationStatus.cleared, total: 0, currentResId: action.payload }
    }
    case AppStateTypes.startReservation: {
      return { ...state, reservationStatus: ReservationStatus.started, total: 0, currentResId: action.payload }
    }
    case AppStateTypes.setPort: {
      return { ...state, port: action.payload }
    }
    case AppStateTypes.setSailPackages: {
      return { ...state, sailPackages: action.payload }
    }
    case AppStateTypes.setPreferredLocale: {
      return { ...state, preferredLocale: action.payload }
    }
    case AppStateTypes.setTotal: {
      return { ...state, total: action.payload }
    }
    case AppStateTypes.startAgain: {
      return { ...state, startAgain: action.payload }
    }
    case AppStateTypes.addAvailability: {
      return {
        ...state,
        availabilities: {
          ...state.availabilities,
          ...action.payload,
        },
      }
    }
    case AppStateTypes.addReserve: {
      return {
        ...state,
        reserves: {
          ...state.reserves,
          ...action.payload,
        },
      }
    }
    case AppStateTypes.setOpenedPaymentPopup: {
      return { ...state, openedPaymentPopup: action.payload }
    }
    case AppStateTypes.setSelectedDateFrom: {
      return state
    }
    case AppStateTypes.cursorEnable: {
      return { ...state, cursorHidden: !action.payload }
    }
    default:
      neverError('Irrelevant type', action)
  }
}

export const AppStateContext = createContext<AppStateContextProps>({} as AppStateContextProps)

export const AppStateProvider = ({ children }: React.PropsWithChildren<{}>): JSX.Element => {
  const router: NextRouter = useRouter()

  const [, cancelReservation] = useMutation<ReservationLoad>(cancelReservationMutation)

  const [state, dispatch] = useReducer(appStateReducer, defaultAppState)
  const { port = state.port, route = '' } = router.query

  const { i18n } = useTranslation()

  const [kioskInfoResult] = useQuery<KioskInfoData>({
    query: getKioskRoutes,
    variables: { port },
    requestPolicy: 'cache-first',
  })

  const resetProcess = useCallback(
    (delay = 0): void => {
      const port = window.localStorage.getItem('port')
      const initialPage = port.includes('MUN') ? `/select-destination/?port=${port}` : `/?port=${port}`
      setTimeout(() => {
        try {
          window.location.href = `${window.location.origin}${initialPage}`
        } catch (e) {
          router.push(initialPage)
          i18n.changeLanguage(state.preferredLocale).catch(console.error)
        }
      }, delay)
    },
    [router, i18n]
  )

  useEffect(() => {
    if (port && port.length) {
      dispatch({ type: AppStateTypes.setPort, payload: port as string })
      if (window.localStorage) {
        window.localStorage.setItem('port', port as string)
      }
      if (port === 'MUN' && router.pathname === '/') {
        router.push(`/select-destination?port=${port}`)
      }
    }
  }, [port])

  const resId = useRef<string>()
  const openedPaymentPopup = useRef<boolean>()

  useEffect(() => {
    openedPaymentPopup.current = state.openedPaymentPopup
  }, [state.openedPaymentPopup])

  useEffect(() => {
    let timeout

    const handleClick = (): void => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (openedPaymentPopup.current) {
          return clearTimeout(timeout)
        }

        dispatch({ type: AppStateTypes.flushReservation, payload: resId.current })
        if (!router.route.includes('translate')) {
          resetProcess(1300)
        }
        clearTimeout(timeout)
      }, idleTimeout)
    }

    document.addEventListener('click', handleClick)

    return (): void => {
      clearTimeout(timeout)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  useEffect(() => {
    if (kioskInfoResult.data) {
      const [sailPackage] = kioskInfoResult.data.kiosk.sailPackages
      dispatch({
        type: AppStateTypes.setSailPackages,
        payload: kioskInfoResult.data.kiosk.sailPackages,
      })
      dispatch({ type: AppStateTypes.setRoute, payload: sailPackage.route })
    }
  }, [dispatch, kioskInfoResult.data])

  useEffect(() => {
    if (route && state.sailPackages) {
      const sailPackage = state.sailPackages.find((sp) => sp.route.code === route)
      sailPackage && dispatch({ type: AppStateTypes.setRoute, payload: sailPackage.route })
    }
  }, [route, state.sailPackages])

  useEffect(() => {
    if (state.startAgain) {
      resetProcess()
      dispatch({ type: AppStateTypes.startAgain, payload: false })
      dispatch({ type: AppStateTypes.cursorEnable, payload: false })
    }
  }, [state.startAgain, resetProcess])

  useEffect(() => {
    const { reservationStatus, currentResId } = state
    resId.current = currentResId
    if (reservationStatus === ReservationStatus.cleared && currentResId !== '') {
      cancelReservation({ reservationId: currentResId }).catch(console.error)
      dispatch({ type: AppStateTypes.setToInitial })
    }
  }, [state.reservationStatus, state.currentResId, dispatch])

  useHotkeys('ctrl+shift+f', () => {
    dispatch({ type: AppStateTypes.cursorEnable, payload: true })
  })

  useEffect(() => {
    document.body.style.cursor = state.cursorHidden ? 'none' : 'auto'
  }, [state.cursorHidden])

  return <AppStateContext.Provider value={{ state, dispatch }}>{children}</AppStateContext.Provider>
}

export const useAppState = (): AppStateContextProps => {
  return useContext(AppStateContext)
}
