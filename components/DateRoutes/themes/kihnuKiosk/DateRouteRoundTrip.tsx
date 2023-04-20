import React, { useState, useContext, useEffect } from 'react'
import getDatesForRoundTrip from '@gql/getRoundTripDates.graphql'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { SailsTable } from '@components/SailsTable'
import { DatePicker } from '@components/DatePicker'
import { useQuery } from 'urql'
import { departureDateTransform, formatDateForQuery } from '@utils/formatters'
import { DateRouteProps } from '@components/DateRoutes'
import { ActionPanel } from '@components/ActionPanel'
import getSails from '@gql/getSails.graphql'
import { Box, CircularProgress, Grid } from '@material-ui/core'
import { TimerContext } from '@components/Layout/themes/kihnuKiosk/Layout'
import { useRouter } from 'next/router'
import DateRouteHeader from './DateRouteHeader'
import { BorderRight } from './DateRouteStyles'
import { Route, SailDirection } from '@interfaces/boraCore'
import { getDeparturePoint, getDestinationsPoint } from '@components/DateRoutes/themes/kihnuKiosk/DateRouteOneWay'
import { AppStateTypes, useAppState } from '../../../../hooks/useAppState'
import { mergeAvailabilities } from '../../../../hooks/useAvailability'
import { ForwardDateContext } from '@pages/select-date/[...all]'
import { Sail } from '@interfaces/salesCore'
import { usePreviousType } from '../../../../hooks/usePrevious'
import getConfig from 'next/config'
import { PublicConfig } from '@pages/info'
const { publicRuntimeConfig } = getConfig()
const { routeHasChangedTimeout } = publicRuntimeConfig as PublicConfig

// maybe we should move it later
interface Dates {
  firstLegDates: string[]
  secondLegDates: string[]
}

export const isDateDisabledForDates =
  (dates: Date[]) =>
  (day): boolean =>
    !dates.find((item) => item.getTime() === day.getTime())

const SelectDatePage: FC<DateRouteProps> = ({
  routeLegs = [],
  route = '',
  handleSavedDate,
  oneWaySailRefId,
  handleSailRefId,
  routeHasChanged,
  setRouteChanged,
}) => {
  const [firstLeg, secondLeg] = routeLegs
  const firstPort = firstLeg.split('-')[0]
  const secondPort = firstLeg.split('-')[1]

  const [savedForwardDate] = useContext(ForwardDateContext)
  const [isTimeUp, setTimeIsUp] = useContext(TimerContext)

  const [selectedForwardDate, handleForwardDateChange] = useState(new Date())
  const [selectedBackDate, handleBackDateChange] = useState(new Date())
  const [limitBackDate, handleLimitBackDateChange] = useState(new Date())
  const [currentSailRefId, setCurrentSailRefId] = useState([])
  const [isReadyToUpdateFirstWay, setIsReadyToUpdateFirstWay] = useState(false)
  const [isReadyToUpdateSecondWay, setIsReadyToUpdateSecondWay] = useState(false)
  const [reloadFirstWayOnce, setReloadFirstWayOnce] = useState(false)
  const [reloadSecondWayOnce, setReloadSecondWayOnce] = useState(false)

  const router = useRouter()
  const { t, i18n } = useTranslation()
  const prevLanguage = usePreviousType(i18n.language)

  const { state, dispatch } = useAppState()

  const [result] = useQuery<Dates>({
    query: getDatesForRoundTrip,
    variables: {
      forwardLeg: firstLeg,
      backwardLeg: secondLeg,
    },
    pause: !firstLeg && !secondLeg,
  })
  const { data, fetching } = result
  const formattedForwardDates = fetching ? [] : data?.firstLegDates.map(departureDateTransform)
  const formattedBackDates = fetching ? [] : data?.secondLegDates.map(departureDateTransform)

  const [firstSailsResult, reexecuteFirstSailsQuery] = useQuery<{ sails: Sail[] }>({
    query: getSails,
    requestPolicy: 'cache-and-network',
    variables: { port: firstPort, date: selectedForwardDate && formatDateForQuery(selectedForwardDate), route },
    pause: !selectedForwardDate,
  })

  const [secondSailsResult, reexecuteSecondSailsQuery] = useQuery<{ sails: Sail[] }>({
    query: getSails,
    requestPolicy: 'network-only',
    variables: { port: secondPort, date: formatDateForQuery(selectedBackDate), route },
  })

  const handleSailRefIds = (currentRefId: number, type: string): void => {
    setCurrentSailRefId((prevState) => {
      if (currentSailRefId.length && currentSailRefId?.find((item) => item.leg === type)) {
        const newArray = prevState.map((item) => (item.leg === type ? { ...item, sailRefId: currentRefId } : item))
        setCurrentSailRefId(newArray)
      } else {
        return [
          ...prevState,
          {
            leg: type,
            sailRefId: currentRefId,
          },
        ]
      }
    })
  }

  const callBackForUpdateFirstWay = (once?: boolean): void => {
    setIsReadyToUpdateFirstWay(true)
    if (once) {
      setReloadFirstWayOnce(true)
    }
  }
  useEffect(() => {
    if (isReadyToUpdateFirstWay && !routeHasChanged) {
      reexecuteFirstSailsQuery({ requestPolicy: 'network-only' })
      setIsReadyToUpdateFirstWay(false)
    }
  }, [isReadyToUpdateFirstWay, setIsReadyToUpdateFirstWay])

  const callBackForUpdateSecondWay = (once?: boolean): void => {
    setIsReadyToUpdateSecondWay(true)
    if (once) {
      setReloadSecondWayOnce(true)
    }
  }
  useEffect(() => {
    if (isReadyToUpdateSecondWay && !routeHasChanged) {
      reexecuteSecondSailsQuery({ requestPolicy: 'network-only' })
      setIsReadyToUpdateSecondWay(false)
    }
  }, [isReadyToUpdateSecondWay, setIsReadyToUpdateSecondWay])

  useEffect(() => {
    let timer = null
    if (routeHasChanged) {
      timer = setTimeout(() => {
        setRouteChanged(false)
      }, routeHasChangedTimeout)
    }
    return (): void => clearTimeout(timer)
  }, [routeHasChanged])

  useEffect(() => {
    if (secondSailsResult.data) {
      dispatch({ type: AppStateTypes.addAvailability, payload: mergeAvailabilities(secondSailsResult.data.sails) })
      dispatch({ type: AppStateTypes.setSelectedDate, payload: selectedForwardDate })
    }
    if (firstSailsResult.data) {
      dispatch({ type: AppStateTypes.addAvailability, payload: mergeAvailabilities(firstSailsResult.data.sails) })
    }
  }, [secondSailsResult.data, firstSailsResult.data])

  useEffect(() => {
    if (prevLanguage && prevLanguage !== i18n.language) {
      reexecuteFirstSailsQuery({ requestPolicy: 'network-only' })
      reexecuteSecondSailsQuery({ requestPolicy: 'network-only' })
    }
  }, [i18n.language, prevLanguage])

  useEffect(() => {
    handleForwardDateChange(savedForwardDate)
    handleBackDateChange(savedForwardDate)
    handleLimitBackDateChange(savedForwardDate)
    router.beforePopState(({ url }) => {
      if (url.includes('/select-date/')) {
        reexecuteFirstSailsQuery({ requestPolicy: 'network-only' })
        reexecuteSecondSailsQuery({ requestPolicy: 'network-only' })
      }
      return true
    })
  }, [])

  const getAvailableForwardRoutes = (date): Array<object> => {
    handleForwardDateChange(date)
    handleSailRefId(null)
    setCurrentSailRefId((prevState) => [...prevState].filter((item) => item.leg !== firstLeg))
    if (date.getTime() > selectedBackDate) {
      handleBackDateChange(date)
      setCurrentSailRefId((prevState) => [...prevState].filter((item) => item.leg !== secondLeg))
    }
    handleLimitBackDateChange(date)
    setTimeIsUp([])
    // const sailsUpdated - will be replaced with an array from server for selected date
    const sailsUpdated = [{}]
    return sailsUpdated
  }
  const getAvailableBackRoutes = (date: Date): Array<object> => {
    handleBackDateChange(date)
    setTimeIsUp([])
    setCurrentSailRefId((prevState) => [...prevState].filter((item) => item.leg !== secondLeg))
    // const sailsUpdated - will be replaced with an array from server for selected date
    const sailsUpdated = [{}]
    return sailsUpdated
  }
  useEffect(() => {
    if (isTimeUp.length) {
      if (isTimeUp.find((it) => it.direction === SailDirection.FORWARD && it.isTimeUpFlag === true)) {
        setTimeIsUp((prevArray) => {
          const array = [...prevArray].filter((item) => item.direction !== SailDirection.FORWARD)
          return array
        })
        reexecuteFirstSailsQuery({ requestPolicy: 'network-only' })
      }
      if (isTimeUp.find((it) => it.direction === SailDirection.BACKWARD && it.isTimeUpFlag === true)) {
        setTimeIsUp((prevArray) => {
          const array = [...prevArray].filter((item) => item.direction !== SailDirection.BACKWARD)
          return array
        })
        reexecuteSecondSailsQuery({ requestPolicy: 'network-only' })
      }
    }
  }, [isTimeUp, setTimeIsUp])

  const returnOneWayTrip = (): void => {
    setRouteChanged(true)
    router.back()
  }
  const getFirstLegSailRefId = (): number => currentSailRefId?.find((item) => item.leg === firstLeg)?.sailRefId

  return (
    <Box display="flex" flexDirection="column" alignContent="space-between" height="100%">
      <Box marginBottom="auto">
        <Grid container direction={'row'} wrap={'wrap'} alignContent={'stretch'} spacing={2}>
          <Grid item xs={6}>
            <BorderRight>
              <Box display="flex" justifyContent="space-around" flexDirection="row" flexWrap="wrap" marginTop="16px">
                {firstSailsResult.fetching && (
                  <Box display="flex" justifyContent="center" alignItems="center" height="130px">
                    <CircularProgress />
                  </Box>
                )}
                <DateRouteHeader
                  travelTimeInMinutes={firstSailsResult.data.sails[0]?.travelTimeInMinutes}
                  vessel={firstSailsResult.data.sails[0]?.vessel}
                  timeOfDeparture={firstSailsResult.data.sails[0]?.departure.timestamp.toString()}
                  pointOfDeparture={getDeparturePoint(state.port)(firstSailsResult.data.sails[0]?.route as Route)}
                  pointOfDestination={getDestinationsPoint(state.port)(firstSailsResult.data.sails[0]?.route as Route)}
                  display-if={!firstSailsResult.fetching && !firstSailsResult.error}
                />
                <Box display={'flex'} justifyContent={'space-around'} width={'100%'} pr={2}>
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <DatePicker
                        data-testid="calendar-forward"
                        value={selectedForwardDate}
                        shouldDisableDate={isDateDisabledForDates(formattedForwardDates)}
                        onChange={getAvailableForwardRoutes}
                      />
                    </Grid>
                    <Grid item xs={8}>
                      {firstSailsResult.fetching && (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                          <CircularProgress />
                        </Box>
                      )}
                      <SailsTable
                        leg={firstLeg}
                        onSelectSail={handleSailRefIds}
                        display-if={!firstSailsResult.fetching && !firstSailsResult.error}
                        sails={firstSailsResult.data.sails}
                        direction={SailDirection.FORWARD}
                        savedSailRefId={oneWaySailRefId}
                        callbackForTriggerReloadSails={callBackForUpdateFirstWay}
                        shouldReload={reloadFirstWayOnce}
                        setReloadFlag={setReloadFirstWayOnce}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </BorderRight>
          </Grid>
          <Grid item xs={6}>
            <Box marginTop="16px">
              {secondSailsResult.fetching && (
                <Box display="flex" justifyContent="center" alignItems="center" height="130px">
                  <CircularProgress />
                </Box>
              )}
              {secondSailsResult.data?.sails[0] ? (
                <DateRouteHeader
                  travelTimeInMinutes={secondSailsResult.data.sails[0]?.travelTimeInMinutes}
                  vessel={secondSailsResult.data.sails[0]?.vessel}
                  timeOfDeparture={secondSailsResult.data.sails[0]?.departure.timestamp.toString()}
                  pointOfDeparture={getDestinationsPoint(state.port)(secondSailsResult.data.sails[0]?.route as Route)}
                  pointOfDestination={getDeparturePoint(state.port)(secondSailsResult.data.sails[0]?.route as Route)}
                  display-if={!secondSailsResult.fetching && !secondSailsResult.error}
                  returnOneWayTrip={(): void => {
                    handleSavedDate(selectedForwardDate)
                    handleSailRefId(getFirstLegSailRefId())
                    returnOneWayTrip()
                  }}
                />
              ) : (
                <DateRouteHeader
                  travelTimeInMinutes={firstSailsResult.data?.sails[0]?.travelTimeInMinutes}
                  vessel={firstSailsResult.data?.sails[0]?.vessel}
                  timeOfDeparture={firstSailsResult.data?.sails[0]?.departure.timestamp.toString()}
                  pointOfDeparture={getDestinationsPoint(state.port)(firstSailsResult.data?.sails[0]?.route as Route)}
                  pointOfDestination={getDeparturePoint(state.port)(firstSailsResult.data?.sails[0]?.route as Route)}
                  display-if={!secondSailsResult.fetching && !secondSailsResult.error}
                  returnOneWayTrip={(): void => {
                    handleSavedDate(selectedForwardDate)
                    handleSailRefId(getFirstLegSailRefId())
                    returnOneWayTrip()
                  }}
                />
              )}
            </Box>
            <Box display={'flex'} justifyContent={'space-around'} width={'100%'}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <DatePicker
                    data-testid="calendar-backward"
                    value={selectedBackDate}
                    shouldDisableDate={isDateDisabledForDates(formattedBackDates)}
                    onChange={getAvailableBackRoutes}
                    minDate={limitBackDate}
                  />
                </Grid>
                <Grid item xs={8}>
                  {secondSailsResult.fetching && (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                      <CircularProgress />
                    </Box>
                  )}
                  <SailsTable
                    leg={secondLeg}
                    onSelectSail={handleSailRefIds}
                    display-if={!secondSailsResult.fetching && !secondSailsResult.error}
                    sails={secondSailsResult.data.sails}
                    direction={SailDirection.BACKWARD}
                    callbackForTriggerReloadSails={callBackForUpdateSecondWay}
                    shouldReload={reloadSecondWayOnce}
                    setReloadFlag={setReloadSecondWayOnce}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <ActionPanel
        backText={''}
        cancelText={t('Cancel and restart')}
        handleCancelButton={(): void => {
          handleSavedDate(new Date())
          returnOneWayTrip()
        }}
        submitText={t('Continue to select tickets', {
          tagLowercaseStart: '<span class="lowercase-text">',
          tagUppercaseStart: '<span class="uppercase-text">',
          tagEnd: '</span>',
        })}
        submitHref={`select-ticket/${currentSailRefId?.find((item) => item.leg === firstLeg)?.sailRefId}>${
          currentSailRefId?.find((item) => item.leg === secondLeg)?.sailRefId
        }?leg=${firstLeg}>${secondLeg}`}
        isEnabled={Boolean(currentSailRefId?.length > 1)}
      />
    </Box>
  )
}

export default SelectDatePage
