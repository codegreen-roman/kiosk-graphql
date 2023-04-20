import styled from 'styled-components'
import { themeSettings } from '@themeSettings'

const { dialog } = themeSettings.colors

export const ProgressIconHolder = styled.div<{ activeStep: number; progressStep: number }>`
  display: flex;
  justify-content: center;
  align-items: center;

  svg path {
    fill: ${(props): string => (props.progressStep <= props.activeStep ? dialog.activeStep : dialog.disabledStep)};
  }
`

export const ProgressLine = styled.div<{ activeStep: number; progressStep: number }>`
  width: 105px;
  height: 3px;
  background-color: ${(props): string =>
    props.progressStep <= props.activeStep ? dialog.activeStep : dialog.disabledStep};
`
