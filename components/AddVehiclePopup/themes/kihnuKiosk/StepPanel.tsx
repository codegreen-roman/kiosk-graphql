import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid } from '@material-ui/core'
import { Icon } from '@components/Icon'
import { ProgressIconHolder, ProgressLine } from './StepPanelStyles'
import { BackTextButton, BackTextButtonIconHolder, StepButton, StepButtonIconHolder } from '@styles/buttonStyles'

export interface StepPanelProps {
  step: number
  handleOnStepForward: (param: number) => void
  handleOnStepBackward: (param: number) => void
  isNumber: string
  choosenVehicleTicketIdx: number
  handleOnClose: () => void
  isEnabled: boolean
}

const StepPanel: FC<StepPanelProps> = ({
  step,
  handleOnStepForward,
  handleOnStepBackward,
  isNumber,
  choosenVehicleTicketIdx,
  // handleOnClose,
  isEnabled,
}) => {
  const { t } = useTranslation()

  return (
    <Box padding="10px">
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Box display="flex" alignItems="center" height="100%" paddingLeft="25px">
            <BackTextButton display-if={step >= 1} onClick={(): void => handleOnStepBackward(step)}>
              <BackTextButtonIconHolder as={Icon['arrow-back']} />
              <span display-if={step === 1 || step === 3}>{t('Back to plate number')}</span>
              <span display-if={step === 2}>{t('Back to vehicle type')}</span>
            </BackTextButton>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" height="100%" padding="0 20px">
            <ProgressIconHolder as={Icon['car-solid']} activeStep={step} progressStep={0} />
            <ProgressLine activeStep={step} progressStep={0} />
            <ProgressIconHolder as={Icon['car-solid']} activeStep={step} progressStep={1} />
            <ProgressLine activeStep={step} progressStep={2} />
            <ProgressIconHolder as={Icon['car-solid']} activeStep={step} progressStep={2} />
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box width="375px" marginLeft="auto">
            <StepButton
              display-if={step < 1}
              isEnabled={true}
              isSelected={isNumber && isNumber.length > 1}
              onClick={(): void => handleOnStepForward(step)}
            >
              <Box minWidth="237px" textAlign="left">
                {t('Continue')}
              </Box>
              <StepButtonIconHolder as={Icon['arrow-right']} />
            </StepButton>
            <StepButton
              display-if={step === 1}
              isEnabled={true}
              isSelected={choosenVehicleTicketIdx !== -1}
              onClick={(): void => handleOnStepForward(step)}
            >
              <Box minWidth="237px" textAlign="left">
                {t('Continue')}
              </Box>
              <StepButtonIconHolder as={Icon['arrow-right']} />
            </StepButton>
            <StepButton
              display-if={step > 1}
              isSelected
              isEnabled={isEnabled}
              onClick={(): void => {
                handleOnStepForward(step)
                // handleOnClose()
              }}
            >
              <Box minWidth="237px" textAlign="left" display-if={step >= 2}>
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
