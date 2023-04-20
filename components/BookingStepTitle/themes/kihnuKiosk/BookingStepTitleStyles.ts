import styled from 'styled-components'
import { getFonts, getPageHeadingColors, themeSettings } from '@themeSettings'
import { Container as ContainerComponent } from '@material-ui/core'

const pageHeadingColors = getPageHeadingColors()
const { buttons } = themeSettings.colors
const { primary, secondary } = getFonts()

export const Root = styled.div<{ totalAmount: number; finalStep?: string }>`
  width: 100%;
  background: ${(props): string => {
    return props.totalAmount >= 0
      ? `linear-gradient(90deg, ${pageHeadingColors.mainBackground} 50%, ${pageHeadingColors.extraBackground} 50%)`
      : pageHeadingColors.mainBackground
  }};
`

export const Container = styled(ContainerComponent)`
  position: relative;
  display: flex !important;
  align-items: center;
  justify-content: start;
  width: 100%;
`

export const LeftSide = styled.div<{ finalStep?: string }>`
  background-color: ${pageHeadingColors.mainBackground};
  font-family: ${secondary};
  font-weight: 600;
  font-size: 50px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${pageHeadingColors.mainText};
  display: flex;
  align-items: center;
  flex-grow: 0;
  flex-basis: 75%;
  max-width: 75%;
  min-height: 80px;
  margin-left: ${(props): string => {
    return props.finalStep ? '24px' : '0px'
  }};
`

export const RightSide = styled.div<{ finalStep?: string }>`
  display: flex;
  justify-content: ${(props): string => {
    return props.finalStep ? 'center' : 'space-between'
  }};
  align-items: center;
  flex-grow: 0;
  max-width: 25%;
  flex-basis: 25%;
  min-height: 80px;
  margin-right: ${(props): string => {
    return props.finalStep ? '10px' : '0px'
  }};
`

export const TotalAmountLabel = styled.div`
  font-family: ${primary};
  font-size: 20px;
  font-weight: 600;
  color: ${pageHeadingColors.label};
  text-align: right;
  margin: 0 22px;
  max-width: 167px;
`

export const FinalStepLabel = styled.div`
  font-family: ${secondary};
  text-transform: uppercase;
  font-size: 25px;
  font-weight: 500;
  letter-spacing: 0.75px;
  color: ${buttons.button.defaultText};
  text-align: right;
  max-width: 167px;
`

export const TotalAmount = styled.div`
  font-family: ${secondary};
  font-weight: 600;
  font-size: 50px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${pageHeadingColors.extraText};
  flex-shrink: 0;
`

export const FinishBox = styled.div`
  background-color: ${buttons.button.cancelBackground};
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 10px 0 11px 0;
  min-height: 80px;
`
