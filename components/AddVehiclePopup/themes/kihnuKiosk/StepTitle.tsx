import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Box } from '@material-ui/core'
import {
  StepTitleLeftWrapper,
  StepTitleRightWrapper,
  TitleHeading,
  TitlePrice,
  TitleVehicleNumber,
} from './StepTitleStyles'

export interface StepTitleProps {
  step: number
  title: string
  number?: string
  price: string
}

const StepTitle: FC<StepTitleProps> = ({ step, title, price, number }) => {
  const { t } = useTranslation()

  return (
    <Box display="flex">
      <StepTitleLeftWrapper>
        <TitleHeading>{title}</TitleHeading>
        <TitleVehicleNumber display-if={step !== 0}>
          <p>{number}</p>
        </TitleVehicleNumber>
      </StepTitleLeftWrapper>
      <StepTitleRightWrapper>
        <TitlePrice>
          <p>{t('Estimated price of vehicle ticket')}</p>
          <span>{`${price}`}</span>
        </TitlePrice>
      </StepTitleRightWrapper>
    </Box>
  )
}

export default StepTitle
