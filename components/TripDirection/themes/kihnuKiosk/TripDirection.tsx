import React, { FC } from 'react'
import { TripDescriptionProps } from '@components/TripDirection'
import { Box } from '@material-ui/core'
import { ArrowIconHolder, DirectionTitle, PrimaryDirectionTitle } from './TripDirectionStyles'
import { Icon } from '@components/Icon'

const TripDescription: FC<TripDescriptionProps> = ({ departure, arrival, isPrimary, roundTrip }) => {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent={roundTrip ? 'flex-end' : 'flex-start'}>
      <Box display="flex" flexDirection="column" alignItems="center">
        {isPrimary ? (
          <PrimaryDirectionTitle>{departure}</PrimaryDirectionTitle>
        ) : (
          <DirectionTitle>{departure}</DirectionTitle>
        )}
      </Box>
      <ArrowIconHolder as={isPrimary ? Icon['arrow-solid-right-blue'] : Icon['arrow-solid-right']} />
      <Box display="flex" flexDirection="column" alignItems="center">
        {isPrimary ? (
          <PrimaryDirectionTitle>{arrival}</PrimaryDirectionTitle>
        ) : (
          <DirectionTitle>{arrival}</DirectionTitle>
        )}
      </Box>
    </Box>
  )
}

export default TripDescription
