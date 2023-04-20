import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid } from '@material-ui/core'
import { Icon } from '@components/Icon'
import { BackTextButton, BackTextButtonIconHolder, StepButton, StepButtonIconHolder } from '@styles/buttonStyles'
import { VehiclePopupStep } from '@interfaces/popupStatus'

export interface StepPanelProps {
  step: VehiclePopupStep
  handleOnStepForward: (param: number) => void
  handleOnStepBackward: (param: number) => void
  isNumber: string
  choosenVehicleTicketIdx: number
  handleOnClose: () => void
  isEnabled: boolean
}

const StepPanel: FC<StepPanelProps> = ({ step, handleOnStepForward, handleOnStepBackward, isEnabled }) => {
  const { t } = useTranslation()

  return (
    <Box padding={step === VehiclePopupStep.SELECT_TYPE ? '10px 10px 20px 10px' : '10px'}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Box display="flex" alignItems="center" height="100%" paddingLeft="25px">
            <BackTextButton
              display-if={step >= VehiclePopupStep.SELECT_TYPE}
              onClick={(): void => handleOnStepBackward(step)}
            >
              <BackTextButtonIconHolder as={Icon['arrow-back']} />
              <span display-if={step === VehiclePopupStep.SELECT_TYPE || step === VehiclePopupStep.AUTOMATIC_FORM}>
                {t('Back to plate number')}
              </span>
              <span display-if={step === VehiclePopupStep.MANUAL_FORM}>{t('Back to vehicle type')}</span>
            </BackTextButton>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box width="375px" marginLeft="auto">
            <StepButton
              display-if={step > VehiclePopupStep.SELECT_TYPE}
              isSelected
              isEnabled={isEnabled}
              onClick={(): void => {
                handleOnStepForward(step)
                // handleOnClose()
              }}
            >
              <Box minWidth="237px" textAlign="left" display-if={step >= VehiclePopupStep.MANUAL_FORM}>
                {t('Add vehicle ticket')}
              </Box>
              <StepButtonIconHolder as={Icon['okMark']} />
            </StepButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default StepPanel
