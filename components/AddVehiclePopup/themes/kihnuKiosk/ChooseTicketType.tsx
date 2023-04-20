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
  chosenVehicleTicketIdx: number
  setChosenVehicleTicketIdx: (idx: number) => void
  setChosenType: (type: string) => void
}

const totalPrice = (price): string => asMoneyString(price * 0.01)

const ChooseTicketType: FC<ChooseTicketTypeProps> = ({
  tickets,
  chosenVehicleTicketIdx,
  setChosenVehicleTicketIdx,
  setChosenType,
}) => {
  return (
    <Box display="flex" flexDirection="row" alignItems="center" width="100%" height="100%" padding="0 10px">
      <Grid container spacing={2}>
        {tickets.map((vehicleTicketType, idx) => {
          const { text, price, type } = vehicleTicketType
          const isSelected: boolean = chosenVehicleTicketIdx === idx

          return (
            <Grid item xs={3} key={idx}>
              <StyledTicketType
                isSelected={isSelected}
                text={text}
                onClick={(): void => {
                  setChosenVehicleTicketIdx(idx)
                  setChosenType(type)
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
