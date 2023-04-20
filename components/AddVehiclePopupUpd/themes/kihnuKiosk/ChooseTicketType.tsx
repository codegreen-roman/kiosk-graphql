import React, { FC } from 'react'
import { Box, Grid } from '@material-ui/core'
import { StyledTicketType } from './ChooseTicketTypeStyles'
import { asMoneyString } from '@utils/formatters'

export interface ChooseTicketTypeProps {
  tickets: Array<{
    text: string
    price: number
    type: string
  }>
  setChosenVehicleTicketIdx: (idx: number) => void
  setChosenType: (type: string) => void
  handleOnStepForward: () => void
}

const totalPrice = (price): string => asMoneyString(price * 0.01)

const ChooseTicketType: FC<ChooseTicketTypeProps> = ({
  tickets,
  setChosenVehicleTicketIdx,
  setChosenType,
  handleOnStepForward,
}) => {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" width="100%" height="100%" padding="0 10px">
      <Grid container spacing={2}>
        {tickets.map((vehicleTicketType, idx) => {
          const { text, price, type } = vehicleTicketType

          return (
            <Grid item xs={3} key={idx}>
              <StyledTicketType
                isSelected={false}
                text={text}
                onClick={(): void => {
                  setChosenVehicleTicketIdx(idx)
                  setChosenType(type)
                  handleOnStepForward()
                }}
              >
                <p>{text}</p>
                <span>{totalPrice(price)}</span>
              </StyledTicketType>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default ChooseTicketType
