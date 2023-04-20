import styled from 'styled-components'
import { themeSettings } from '@themeSettings'
import { getFonts } from '@themeSettings'

const { secondary } = getFonts()
const { keyboard, buttons } = themeSettings.colors

export const KeyboardWrapper = styled.div<{ isNumerical?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${(props): string => (props.isNumerical ? `585px` : `1451px`)};
  height: 390px;
  border-radius: 20px;
  background: ${keyboard.keyboardBackground};
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14),
    0px 9px 46px 8px rgba(0, 0, 0, 0.12);
  margin-top: ${(props): string => (props.isNumerical ? `0px` : `20px`)};
  z-index: 10;
  overflow: hidden;
`

export const KeyboardCustomStyle = styled.div<{ isNumerical?: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: ${(props): string => (props.isNumerical ? `20px 6% 20px 6%` : `20px`)};
  .simple-keyboard {
    background-color: unset;
    padding: 0;
    .hg-button {
      font-family: ${secondary};
    }
  }
`

export const MainPad = styled.div<{ isEnabled?: boolean }>`
  .simple-keyboard {
    background-color: unset;
    padding: 0;
    width: 890px;
    height: 350px;
    text-align: center;
    text-transform: uppercase;
    .hg-row {
      display: inline-flex;
    }
    .hg-row:not(:last-child) {
      margin-bottom: 10px;
    }
    .hg-button {
      width: 80px;
      height: 80px;
      border-radius: 10px;
      font-size: 46px;
      font-weight: 500;
      color: ${keyboard.buttonDefaultColor};
      background-color: ${keyboard.buttonDefault};
      ${(props): string => {
        return props.isEnabled ? '' : `pointer-events: none;`
      }}
    }
    .hg-button.hg-activeButton {
      color: ${keyboard.buttonDefaultColorActive};
      background-color: ${keyboard.buttonDefaultActive};
    }
    .hg-button:not(:last-child) {
      margin-right: 10px;
    }
    .hg-button-space {
      width: 619px;
      font-size: 35px;
      font-weight: 500;
      color: ${keyboard.spaceButtonColor};
    }
    .hg-button-space.hg-activeButton {
      color: ${keyboard.spaceButtonColorActive};
      background-color: ${keyboard.spaceButtonActive};
    }
  }
`

export const ActionKeys = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

export const BackspacePad = styled.div`
  .hg-button-backspace {
    width: 220px;
    height: 80px;
    border-radius: 10px;
    font-size: 35px;
    font-weight: 500;
    background-color: ${keyboard.backspaceButton};
    color: ${keyboard.buttonDefaultColor};
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .hg-button-backspace.hg-activeButton {
    color: ${keyboard.backspaceButtonColorActive};
    background-color: ${keyboard.buttonDefaultActive};
  }
`

export const EnterPad = styled.div<{ isEnabled?: boolean }>`
  .hg-button-enter {
    width: 220px;
    height: 120px;
    border-radius: 10px;
    font-size: 35px;
    font-weight: 500;
    background-color: ${(props): string =>
      props.isEnabled ? keyboard.enterButton : buttons.button.disabledBackground};
    color: ${keyboard.buttonDefaultColor};
    text-transform: uppercase;
    span::first-letter {
      font-size: 40px;
      padding-top: 5px;
    }
    ${(props): string => {
      return props.isEnabled ? '' : `pointer-events: none;`
    }}
  }
  .hg-button-enter.hg-activeButton {
    color: ${keyboard.enterButtonColorActive};
    background-color: ${keyboard.buttonDefaultActive};
  }
`

export const NumPad = styled.div`
  .simple-keyboard {
    width: 260px;
    height: 350px;
    .hg-row:not(:last-child) {
      margin-bottom: 10px;
    }
    .hg-button {
      width: 80px;
      height: 80px;
      font-size: 46px;
      font-weight: 500;
      color: ${keyboard.buttonDefaultColor};
      background-color: ${keyboard.buttonDefault};
      border-radius: 10px;
    }
    .hg-button.hg-activeButton {
      color: ${keyboard.buttonDefaultColorActive};
      background-color: ${keyboard.buttonDefaultActive};
    }
    .hg-button:not(:last-child) {
      margin-right: 10px;
    }
    .hg-button-numpad0 {
      width: 170px;
    }
  }
`
