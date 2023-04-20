import { useQuery } from 'urql'
import getAvailability from '@gql/sailAvailability.graphql'
import roundTripsailsAvailability from '@gql/roundTripsailsAvailability.graphql'
import { AppAction, AppStateTypes, SailAvailability } from './useAppState'
import React, { useEffect } from 'react'
import { compose, map, reduce } from 'ramda'

export const mergeAvailabilities = compose(
  reduce((all, val: SailAvailability) => ({ ...all, ...val }), {}),
  map(({ sailRefId, availableTickets }) => ({ [sailRefId]: availableTickets }))
)
export const mergeReserve = compose(
  reduce((all, val: SailAvailability) => ({ ...all, ...val }), {}),
  map(({ sailRefId, reserveTickets }) => ({ [sailRefId]: reserveTickets }))
)

type UseAvailabilityArgs = {
  readonly port: string
  readonly sailRefId: number
  readonly backwardSailRefId?: number
  readonly dispatch: React.Dispatch<AppAction>
}

interface UseAvailabilityResult {
  fetching: boolean
  runQuery(): void
}

type QueryResult = {
  sail: {
    sailRefId: number
    availableTickets: SailAvailability
  }
  backSail?: {
    sailRefId: number
    availableTickets: SailAvailability
  }
}

export const useAvailability = ({
  port,
  sailRefId,
  dispatch,
  backwardSailRefId,
}: UseAvailabilityArgs): UseAvailabilityResult => {
  const [result, runQuery] = useQuery<QueryResult>({
    query: backwardSailRefId ? roundTripsailsAvailability : getAvailability,
    variables: { sailRefId, port, ...(backwardSailRefId && { backwardSailRefId }) },
    requestPolicy: 'network-only',
  })

  const { data, fetching } = result

  useEffect(() => {
    if (data?.sail) {
      dispatch({ type: AppStateTypes.addAvailability, payload: mergeAvailabilities([data.sail]) })
      dispatch({ type: AppStateTypes.addReserve, payload: mergeReserve([data.sail]) })
    }
    if (data?.backSail) {
      dispatch({ type: AppStateTypes.addAvailability, payload: mergeAvailabilities([data.backSail]) })
      dispatch({ type: AppStateTypes.addReserve, payload: mergeReserve([data.sail]) })
    }
  }, [data])

  return {
    fetching,
    runQuery,
  }
}
