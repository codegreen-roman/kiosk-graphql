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
import { variableToString } from '@utils/formatters'
import { StyledOutlinedInputUpd } from '@components/AddVehiclePopupUpd/themes/kihnuKiosk/InsertVehicleNumberStyles'
import { VehiclePopupStep } from '@interfaces/popupStatus'

export interface StepTitleProps {
  step: VehiclePopupStep
  title: string
  price: string
  placeholder?: string
  number?: string
  getValue?: (inputName: string) => string
  vehicleNumber?: string
}

const StepTitle: FC<StepTitleProps> = ({ step, title, price, number, placeholder, getValue, vehicleNumber }) => {
  const { t } = useTranslation()

  return (
    <Box display="flex">
      <StepTitleLeftWrapper>
        <TitleHeading>{title}</TitleHeading>
        <TitleVehicleNumber display-if={step !== VehiclePopupStep.INITIAL}>
          <p>{number}</p>
        </TitleVehicleNumber>
        <StyledOutlinedInputUpd
          display-if={step === VehiclePopupStep.INITIAL}
          /* eslint-disable-next-line jsx-a11y/no-autofocus */
          autoFocus={step === VehiclePopupStep.INITIAL}
          placeholder={placeholder}
          value={getValue(variableToString({ vehicleNumber }))}
        />
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
