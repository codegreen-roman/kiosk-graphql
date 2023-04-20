import { Layout } from '@components/Layout'
import React, { FC, useEffect, useState } from 'react'
import { BookingStepTitle } from '@components/BookingStepTitle'
import { UpcomingSail, UpcomingSailProps } from '@components/UpcomingSail'
import { FeedType, WelcomeFeed, WelcomeFeedProps } from '@components/WelcomeFeed'
import getUpcomingSail from '@gql/getUpcomingSail.graphql'
import { useQuery } from 'urql'
import { useRouter } from 'next/router'
import { compose, head, map, propOr } from 'ramda'
import { formatTime } from '@utils/formatters'
import styled from 'styled-components'
import { getContentBlockColors } from '@themeSettings'
import { Availability } from '@interfaces/salesCore'
import { Box } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { withUrqlClient } from 'next-urql'
import { urqlClientOptions } from '../urql/urlqlClient'
import { KioskInfoData, SailStatusType } from '@interfaces/boraCore'
import getKioskRoutes from '@gql/getKioskRoutes.graphql'
import { AppStateTypes, useAppState } from '../hooks/useAppState'

const contentBlockColors = getContentBlockColors()

interface UpcomingSailResult {
  status: SailStatusType
  routeLeg: string
  route: string
  vessel: string
  departure: {
    timestamp: Date
    locationName: string
  }
  arrival: {
    locationName: string
  }
  availableTickets: Availability
  extraTickets: Availability
  extraTicketsAvailableTime: string
  reserveTicketsAvailableTime: string
  salesClosed: boolean
  reserveTickets?: Availability
}

const mapDataToProps = compose(
  head,
  map((sail: UpcomingSailResult) => ({
    routeLeg: sail.routeLeg,
    route: sail.route,
    time: formatTime(new Date(sail.departure.timestamp), 'h:m'),
    salesClosed: sail.salesClosed,
    status: sail.status,
    direction: `${sail.departure.locationName} - ${sail.arrival.locationName}`,
    vessel: sail.vessel,
    passengers: sail.availableTickets.passengers,
    extraPassengers: sail.extraTickets ? sail.extraTickets.passengers : 0,
    reservePassengers: sail.reserveTickets ? sail.reserveTickets.passengers : undefined,
    bicycles: sail.availableTickets.bicycles,
    extraBicycles: sail.extraTickets ? sail.extraTickets.bicycles : 0,
    reserveBicycles: sail.reserveTickets ? sail.reserveTickets.bicycles : undefined,
    vehicles: sail.availableTickets.vehicles,
    extraVehicles: sail.extraTickets ? sail.extraTickets.vehicles : 0,
    reserveVehicles: sail.reserveTickets ? sail.reserveTickets.vehicles : undefined,
    extraTicketsAvailableTime: sail.extraTicketsAvailableTime || 0,
    reserveTicketsAvailableTime: formatTime(new Date(sail.reserveTicketsAvailableTime), 'h:m'),
  })),
  propOr([], 'upcomingSails')
)

const WelcomeFeedGirlPromoMock = {
  type: FeedType.promo,
  image: 'sea',
  message: {
    translationKey: 'Promo text',
  },
}

const WelcomeFeedSailorPromoMock = {
  type: FeedType.promo,
  image: 'sea',
  message: {
    translationKey: 'Promo text',
  },
}

const WelcomeFeedNewsMock = {
  type: FeedType.news,
  image: 'children',
  message: {
    title: 'Hey! Check ou the news!',
    text: `<strong>11.08.2020 - Graafiku muudatused Kihnu ja Manija liinil 30.08</strong>
    </br></br>
    ● Pühapäeval, 30.08 seoses “Kihnu Männäkäbä maratoniga” toimuvad väljumised Kihnu liinil järgnevalt: Kihnust kell 9:00; 11:30; 16:15 ja 19:00 ning Munalaiust kell 10:15; 12:45; 17:45 ja 20:15.
    </br></br>
    ● Manilaid liinil väljumisi ei toimu.`,
  },
}

const WelcomeFeedWarningMock = {
  type: FeedType.warning,
  image: 'sea',
  message: {
    title: 'We’re sorry, it’s stormy now, no navigation!',
  },
}

const types = {
  warning: WelcomeFeedWarningMock,
  news: WelcomeFeedNewsMock,
  promoGirl: WelcomeFeedGirlPromoMock,
  promoSailor: WelcomeFeedSailorPromoMock,
}

export const Placeholder = styled.div`
  display: flex;
  width: 100%;
  background: ${contentBlockColors.selectedBackground};
  border-top: 1px solid ${contentBlockColors.selectedBorder};
  border-bottom: 1px solid ${contentBlockColors.selectedBorder};
  height: 80px;
`

const useChangingPromo = (intervalTime: number): { promoFeedType: WelcomeFeedProps } => {
  const [promoFeedType, setPromoFeedType] = useState(types.promoGirl)

  useEffect(() => {
    const interval = setInterval(() => {
      setPromoFeedType(promoFeedType.image.startsWith('girl') ? types.promoSailor : types.promoGirl)
    }, intervalTime)

    return (): void => clearInterval(interval)
  }, [promoFeedType])

  return {
    promoFeedType,
  }
}

const IndexPage: FC = () => {
  const router = useRouter()

  const [isReadyToUpdate, setIsReadyToUpdate] = useState(false)
  const [reloadOnce, setReloadOnce] = useState(false)
  const { promoFeedType } = useChangingPromo(10000)

  const { dispatch, state } = useAppState()
  const { port } = state

  const [kioskInfoResult] = useQuery<KioskInfoData>({
    query: getKioskRoutes,
    // requestPolicy: 'cache-first',
    variables: { port },
  })

  useEffect(() => {
    dispatch({ type: AppStateTypes.setToInitial })
  }, [])

  useEffect(() => {
    if (kioskInfoResult.data) {
      const [sailPackage] = kioskInfoResult.data.kiosk.sailPackages
      dispatch({ type: AppStateTypes.setRoute, payload: sailPackage.route })
    }
  }, [dispatch, kioskInfoResult])

  const [result, reexecuteUpcomingSailsQuery] = useQuery<UpcomingSailProps[]>({
    query: getUpcomingSail,
    variables: { port },
    // in order to get new sail data every time
    // requestPolicy: 'cache-and-network',
  })

  const { data, fetching, error } = result
  const upcomingSail = mapDataToProps(data) as UpcomingSailProps
  const handleClick = (e): void => {
    e.preventDefault()
    if (upcomingSail) {
      router.push(`/select-date/${upcomingSail?.routeLeg}?route=${upcomingSail.route.code}`)
    } else if (kioskInfoResult.data) {
      const [sailPackage] = kioskInfoResult.data.kiosk.sailPackages
      const { code, legs } = sailPackage.route
      const [currentRouteLeg] = legs.filter(({ code }) => code.startsWith(port as string))

      router.push(`/select-date/${currentRouteLeg?.code}?route=${code}`)
    }
  }
  const callBackForUpdate = (once?: boolean): void => {
    setIsReadyToUpdate(true)
    if (once) {
      setReloadOnce(true)
    }
  }
  const { t } = useTranslation()
  useEffect(() => {
    if (isReadyToUpdate) {
      reexecuteUpcomingSailsQuery({ requestPolicy: 'network-only' })
      setIsReadyToUpdate(false)
    }
  }, [isReadyToUpdate, setIsReadyToUpdate])

  return (
    <Layout step={0} title={state.port} isErrorOccurred={!!error}>
      <Box onClick={handleClick} flexGrow="1" display="flex" flexDirection="column" overflow="hidden">
        <BookingStepTitle>{t('Touch the screen')}</BookingStepTitle>
        <UpcomingSail
          shouldReload={reloadOnce}
          setReloadFlag={setReloadOnce}
          display-if={!fetching && upcomingSail}
          {...upcomingSail}
          callBack={callBackForUpdate}
        />
        <WelcomeFeed {...promoFeedType} />
      </Box>
    </Layout>
  )
}

export default withUrqlClient(() => urqlClientOptions, { ssr: true })(IndexPage)
