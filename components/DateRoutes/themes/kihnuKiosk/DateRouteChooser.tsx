import React, { FC, useState } from 'react'
import DateRouteOneWay from './DateRouteOneWay'
import DateRouteRoundTrip from './DateRouteRoundTrip'
import { DateRouteProps } from '@components/DateRoutes'

export const DateRouteChooser: FC<DateRouteProps> = ({ routeLegs = [], route, handleSavedDate }) => {
  const [oneWaySailRefId, setOneWaySailRefId] = useState<number>(0)
  const [routeHasChanged, setRouteChanged] = useState(false)
  const handleSailRefId = (sailRefId: number): void => {
    setOneWaySailRefId(sailRefId)
  }
  if (!routeLegs.length) return null
  if (routeLegs.length === 1) {
    return (
      <DateRouteOneWay
        routeLegs={routeLegs}
        route={route}
        handleSavedDate={handleSavedDate}
        handleSailRefId={handleSailRefId}
        oneWaySailRefId={oneWaySailRefId}
        routeHasChanged={routeHasChanged}
        setRouteChanged={setRouteChanged}
      />
    )
  } else {
    return (
      <DateRouteRoundTrip
        routeLegs={routeLegs}
        route={route}
        handleSavedDate={handleSavedDate}
        handleSailRefId={handleSailRefId}
        oneWaySailRefId={oneWaySailRefId}
        routeHasChanged={routeHasChanged}
        setRouteChanged={setRouteChanged}
      />
    )
  }
}

export default DateRouteChooser
