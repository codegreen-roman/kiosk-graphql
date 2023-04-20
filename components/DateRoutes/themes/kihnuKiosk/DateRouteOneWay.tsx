import React, { FC, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import getDepartureDates from '@gql/getDepartureDates.graphql'
import getSails from '@gql/getSails.graphql'
import { SailsTable } from '@components/SailsTable'
import { DatePicker } from '@components/DatePicker'
import { useQuery } from 'urql'
import { compose, defaultTo, find, pathOr, prop } from 'ramda'
import { departureDateTransform, formatDateForQuery, swapArrayElements } from '@utils/formatters'
import { DateRouteProps } from '@components/DateRoutes'
import { isDateDisabledForDates } from '@components/DateRoutes/themes/kihnuKiosk/DateRouteRoundTrip'
import { ActionPanel } from '@components/ActionPanel'
import { Box, CircularProgress, Grid } from '@material-ui/core'
import { TimerContext } from '@components/Layout/themes/kihnuKiosk/Layout'
import { ContinueButton } from 'styles/buttonStyles'
import { Icon } from '@components/Icon'
import { AddIconHolder, BorderRight } from './DateRouteStyles'
import { useTranslation } from 'react-i18next'
import DateRouteHeader, { LocationAndTitle } from './DateRouteHeader'
import { Route, RouteLeg, SailDirection } from '@interfaces/boraCore'
import { AppStateTypes, useAppState } from '../../../../hooks/useAppState'
import { mergeAvailabilities } from 'hooks/useAvailability'
import { ForwardDateContext } from '@pages/select-date/[...all]'
import { Sail } from '@interfaces/salesCore'
import { usePreviousType } from '../../../../hooks/usePrevious'
import getConfig from 'next/config'
import { PublicConfig } from '@pages/info'
const { publicRuntimeConfig } = getConfig()
const { routeHasChangedTimeout } = publicRuntimeConfig as PublicConfig

const defaultLocationAndTitle: LocationAndTitle = { location: '', title: '' }

const getLegByPort: (p: string) => (route: Route) => RouteLeg = (port: string) =>
  compose(
    find((leg: RouteLeg) => leg.code.startsWith(port)),
    defaultTo([]),
    prop('legs')
  )

export const getDeparturePoint: (p: string) => (route: Route) => LocationAndTitle = (port: string) =>
  compose(pathOr(defaultLocationAndTitle, ['parts', 0]), getLegByPort(port))

export const getDestinationsPoint: (p: string) => (route: Route) => LocationAndTitle = (port: string) =>
  compose(pathOr(defaultLocationAndTitle, ['parts', 1]), getLegByPort(port))

// maybe we should move it later
interface Dates {
  departureDates: string[]
}

const DateRouteOneWay: FC<DateRouteProps> = ({
  routeLegs = [],
  route = '',
  handleSavedDate,
  handleSailRefId,
  oneWaySailRefId,
  routeHasChanged,
  setRouteChanged,
}) => {
  const { t, i18n } = useTranslation()
  const prevLanguage = usePreviousType(i18n.language)
  const [firstLeg] = routeLegs
  const firstPort = firstLeg.split('-')[0]
  const [selectedForwardDate, handleForwardDateChange] = useState(new Date())
  const [isReadyToUpdate, setIsReadyToUpdate] = useState(false)
  const [reloadOnce, setReloadOnce] = useState(false)

  const [savedForwardDate] = useContext(ForwardDateContext)
  const [isTimeUp, setTimeIsUp] = useContext(TimerContext)

  const [currentSailRefId, setCurrentSailRefId] = useState<number>(oneWaySailRefId)
  const router = useRouter()
  const legsArray = firstLeg.split('-')
  swapArrayElements(legsArray, 0, 1)
  const secondLeg = legsArray.join('-')

  const [result] = useQuery<Dates>({
    query: getDepartureDates,
    variables: { routeLeg: firstLeg },
    pause: !firstLeg,
  })

  useEffect(() => {
    handleForwardDateChange(savedForwardDate)
  }, [savedForwardDate])

  const { state, dispatch } = useAppState()
  const startAgain = (): void => dispatch({ type: AppStateTypes.startAgain, payload: true })

  const [sailsResult, reexecuteFirstSailsQuery] = useQuery<{ sails: Sail[] }>({
    // todo: here we need to pass a <T> type of return data to useQuery
    query: getSails,
    requestPolicy: 'network-only',
    variables: { port: firstPort, date: formatDateForQuery(selectedForwardDate), route },
  })

  let pointOfDeparture
  let pointOfDestination

  if (sailsResult.data && sailsResult.data.sails.length) {
    pointOfDeparture = getDeparturePoint(state.port)(sailsResult.data.sails[0]?.route as Route)
    pointOfDestination = getDestinationsPoint(state.port)(sailsResult.data.sails[0]?.route as Route)
  } else {
    pointOfDeparture = getDeparturePoint(state.port)(state.route)
    pointOfDestination = getDestinationsPoint(state.port)(state.route)
  }

  useEffect(() => {
    if (sailsResult.data) {
      dispatch({ type: AppStateTypes.addAvailability, payload: mergeAvailabilities(sailsResult.data.sails) })
      dispatch({ type: AppStateTypes.setSelectedDate, payload: selectedForwardDate })
    }
  }, [sailsResult.data])

  useEffect(() => {
    router.beforePopState(({ url }) => {
      if (url.includes('/select-date/')) {
        reexecuteFirstSailsQuery({ requestPolicy: 'network-only' })
      }
      return true
    })
  }, [])

  useEffect(() => {
    if (prevLanguage && prevLanguage !== i18n.language) {
      reexecuteFirstSailsQuery({ requestPolicy: 'network-only' })
    }
  }, [i18n.language, prevLanguage])

  useEffect(() => {
    if (isTimeUp.length && isTimeUp.find((it) => it.direction === SailDirection.FORWARD && it.isTimeUpFlag === true)) {
      setTimeIsUp((prevArray) => {
        const array = [...prevArray].filter((item) => item.direction !== SailDirection.FORWARD)
        return array
      })
      reexecuteFirstSailsQuery({ requestPolicy: 'network-only' })
    }
  }, [isTimeUp, setTimeIsUp])

  const { data, fetching } = result
  const formattedForwardDates = fetching ? [] : data?.departureDates.map(departureDateTransform)

  const getAvailableForwardRoutes = (date: Date): Array<object> => {
    handleForwardDateChange(date)
    setCurrentSailRefId(null)
    const sailsUpdated = [{}]
    setTimeIsUp([])
    return sailsUpdated
  }
  const addRoundTrip = (firstRoute: string, secondRoute: string): void => {
    setRouteChanged(true)
    router.push(`/select-date/${firstRoute}/${secondRoute}/?route=${route}`)
  }
  const callBackForUpdate = (once?: boolean): void => {
    setIsReadyToUpdate(true)
    if (once) {
      setReloadOnce(true)
    }
  }
  useEffect(() => {
    if (isReadyToUpdate && !routeHasChanged) {
      reexecuteFirstSailsQuery({ requestPolicy: 'network-only' })
      setIsReadyToUpdate(false)
    }
  }, [isReadyToUpdate, setIsReadyToUpdate])

  useEffect(() => {
    let timer = null
    if (routeHasChanged) {
      timer = setTimeout(() => {
        setRouteChanged(false)
      }, routeHasChangedTimeout)
    }
    return (): void => clearTimeout(timer)
  }, [routeHasChanged])

  return (
    <Box display="flex" flexDirection="column" alignContent="space-between" height="100%">
      <Box marginBottom="auto">
        <Grid container direction={'row'} wrap={'wrap'} alignContent={'stretch'} spacing={2}>
          <Grid item xs={6}>
            <BorderRight>
              <Box display="flex" justifyContent="space-around" flexDirection="row" flexWrap="wrap" marginTop="16px">
                {sailsResult.fetching && (
                  <Box display="flex" justifyContent="center" alignItems="center" height="130px">
                    <CircularProgress />
                  </Box>
                )}
                <DateRouteHeader
                  travelTimeInMinutes={sailsResult.data.sails[0]?.travelTimeInMinutes}
                  vessel={sailsResult.data.sails[0]?.vessel}
                  timeOfDeparture={
                    sailsResult.data.sails[0]?.departure.timestamp.toString() || state.selectedDate.toString()
                  }
                  pointOfDeparture={pointOfDeparture}
                  pointOfDestination={pointOfDestination}
                  display-if={!sailsResult.fetching && !sailsResult.error}
                />
                <Box display={'flex'} justifyContent={'space-around'} width={'100%'} pr={2}>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <DatePicker
                        value={selectedForwardDate}
                        shouldDisableDate={isDateDisabledForDates(formattedForwardDates)}
                        onChange={getAvailableForwardRoutes}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      {sailsResult.fetching && (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                          <CircularProgress />
                        </Box>
                      )}
                      <SailsTable
                        onSelectSail={setCurrentSailRefId}
                        display-if={!sailsResult.fetching && !sailsResult.error}
                        sails={sailsResult.data.sails}
                        direction={SailDirection.FORWARD}
                        savedSailRefId={oneWaySailRefId}
                        callbackForTriggerReloadSails={callBackForUpdate}
                        shouldReload={reloadOnce}
                        setReloadFlag={setReloadOnce}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </BorderRight>
          </Grid>
          <Grid item xs={6}>
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'100%'} height={'100%'}>
              <ContinueButton
                isSelected={!sailsResult.fetching && !sailsResult.error && !!sailsResult.data.sails.length}
                onClick={(): void => {
                  handleSavedDate(selectedForwardDate)
                  handleSailRefId(currentSailRefId)
                  addRoundTrip(firstLeg, secondLeg)
                }}
              >
                <Box display={'flex'} flexDirection={'column'} justifyContent={'space-around'} width={'100%'} px={10}>
                  <AddIconHolder as={Icon['round-trip']} />
                  <p>{t('Add return route button')}</p>
                </Box>
              </ContinueButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <ActionPanel
        backText={''}
        cancelText={t('Cancel and restart')}
        handleCancelButton={startAgain}
        submitText={t('Continue to select tickets', {
          tagLowercaseStart: '<span class="lowercase-text">',
          tagUppercaseStart: '<span class="uppercase-text">',
          tagEnd: '</span>',
        })}
        submitHref={`select-ticket/${currentSailRefId}?leg=${firstLeg}`}
        isEnabled={Boolean(currentSailRefId)}
      />
    </Box>
  )
}

export default DateRouteOneWay
