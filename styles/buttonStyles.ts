import styled from 'styled-components'
import { themeSettings } from '@themeSettings'
import { getFonts, getFootNoteColors } from '@themeSettings'

const { secondary } = getFonts()
const { buttons } = themeSettings.colors
const footNotes = getFootNoteColors()

export const Root = styled.div`
  position: relative;
  margin: 50px -16px 10px;
`

export const BackTextButton = styled.div`
  display: flex;
  align-items: center;
  font-family: ${secondary};
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${buttons.textButton.defaultText};
`

export const BackTextButtonIconHolder = styled.div`
  position: relative;
  padding-right: 13px;
`

export const CancelButton = styled.div`
  display: inline-flex;
  align-items: center;
  min-width: 125px;
  height: 55px;
  background-color: ${buttons.button.cancelBackground};
  padding: 0 23px 0 12px;
  font-family: ${secondary};
  font-size: 25px;
  font-weight: 500;
  letter-spacing: 0.75px;
  text-transform: uppercase;
  color: ${buttons.button.defaultText};
`

export const OkButton = styled.div`
  display: inline-flex;
  align-items: center;
  height: 55px;
  min-width: 125px;
  background-color: ${buttons.button.defaultBackground};
  padding: 0 23px 0 12px;
  font-family: ${secondary};
  font-size: 25px;
  font-weight: 500;
  letter-spacing: 0.75px;
  text-transform: uppercase;
  color: ${buttons.button.defaultText};
`

export const OkButtonIconHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 35px;
  height: 35px;
  border: 3px solid white;
  border-radius: 50%;
  path {
    fill: white;
  }
`

export const CancelButtonIconHolder = styled.div`
  position: relative;
  padding-right: 13px;
`

export const ContractButton = styled.div<{ isEnabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 65px;
  width: 419px;
  background-color: ${(props): string =>
    props.isEnabled ? buttons.button.primaryBackground : buttons.button.disabledBackground};
  font-family: ${secondary};
  font-size: 21px;
  font-weight: 500;
  letter-spacing: 0.75px;
  text-transform: uppercase;
  color: ${buttons.button.defaultText};
  padding: 10px 26px 10px 31px;
  ${(props): string => {
    return props.isEnabled ? '' : `pointer-events: none;`
  }}
`
export const ContractButtonIconHolder = styled.div`
  position: relative;
  padding-left: 15px;
`

export const SubmitButton = styled.div<{ isEnabled?: boolean; isAdaptive?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: ${(props): string => (props.isAdaptive ? '419px' : '374px')};
  height: 138px;
  background-color: ${(props): string =>
    props.isEnabled ? buttons.button.defaultBackground : buttons.button.disabledBackground};
  padding: 0 26px 0 31px;
  ${(props): string => {
    return props.isEnabled ? '' : `pointer-events: none;`
  }}
`

export const SubmitText = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${secondary};
  color: ${buttons.button.defaultText};
  span.lowercase-text {
    font-size: 18px;
    font-weight: 500;
    text-transform: lowercase;
    padding-bottom: 7px;
  }
  span.uppercase-text {
    font-size: 24px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`

export const SubmitButtonIconHolder = styled.div`
  position: relative;
`

export const DefaultButton = styled.div<{ background?: string; isSecondary?: boolean }>`
  padding: ${(props): string => (props.isSecondary ? `8px 0` : `28px 0`)};
  background-color: ${(props): string =>
    props.background ? buttons.button[props.background] : buttons.button.defaultBackground};
  font-family: ${secondary};
  font-size: ${(props): string => (props.isSecondary ? `22px` : `25px`)};
  font-weight: 500;
  letter-spacing: 0.75px;
  text-transform: uppercase;
  text-aling: center;
  color: ${buttons.button.defaultText};
  text-align: center;
`

export const StepButton = styled.div<{ isSelected?: boolean; isEnabled?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props): string =>
    props.isSelected && props.isEnabled ? buttons.button.defaultBackground : buttons.button.disabledBackground};
  padding: 24px 32px;
  ${(props): string => {
    return props.isSelected ? '' : `pointer-events: none;`
  }}
  font-family: ${secondary};
  font-size: 25px;
  font-weight: 500;
  letter-spacing: 0.75px;
  text-transform: uppercase;
  text-aling: center;
  color: ${buttons.button.defaultText};
  text-align: center;
  ${(props): string => {
    return props.isEnabled ? '' : `pointer-events: none;`
  }}
`

export const StepButtonIconHolder = styled.div`
  position: relative;
  path {
    fill: white;
  }
`

export const ContinueButton = styled.div<{ isSelected?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props): string =>
    props.isSelected ? buttons.button.defaultBackground : buttons.button.disabledBackground};
  padding: 28px 0;
  ${(props): string => {
    return props.isSelected ? '' : `pointer-events: none;`
  }}
  font-family: ${secondary};
  font-size: 25px;
  font-weight: 500;
  letter-spacing: 0.75px;
  text-transform: uppercase;
  color: ${buttons.button.defaultText};
  text-align: center;
`

export const ContinueButtonIconHolder = styled.div`
  position: relative;
`
export const CloseButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 46px;
  height: 46px;
  background-color: ${footNotes.warning};
  border-radius: 50%;
`
export const CloseIconHolder = styled.div`
  display: flex;
  justify-content: center;
`
