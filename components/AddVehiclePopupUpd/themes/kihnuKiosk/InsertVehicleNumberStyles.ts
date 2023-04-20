import styled from 'styled-components'
import { themeSettings } from '@themeSettings'
import { getFonts } from '@themeSettings'
import { OutlinedInput } from '@material-ui/core'

const { buttons, form, text } = themeSettings.colors

const { primary, secondary } = getFonts()

export const StyledOutlinedInput = styled(OutlinedInput)`
  &.MuiOutlinedInput-root {
    width: 243px;
    height: 44px;
  }
  &.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border-color: ${form.inputDefaultBorder};
  }
  &:hover.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border-color: ${form.inputDefaultBorder};
  }
  &.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${form.inputDefaultBorder};
  }
`

export const StyledOutlinedInputUpd = styled(OutlinedInput)`
  &.MuiOutlinedInput-root {
    width: 245px;
    height: 44px;
    display: flex;
    jusfity-content: center;
    align-items: center;
    background: #ffffff;
    padding: 0 10px;
  }
  &.MuiOutlinedInput-root .MuiOutlinedInput-input {
    font-family: ${secondary};
    font-size: 27px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #333333;
    caret-color: ${buttons.textButton.defaultText};
  }
  &.MuiOutlinedInput-root .MuiOutlinedInput-input::placeholder {
    font-family: ${secondary};
    font-size: 18px;
    font-weight: 500;
    text-transform: uppercase;
    color: #333333;
  }
  &.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border: 3px solid #333333;
    border-radius: 5px;
  }
  &:hover.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border: 3px solid #333333;
    border-radius: 5px;
  }
  &.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 3px solid #333333;
    border-radius: 5px;
  }
`

export const InputDescription = styled.p`
  font-family: ${primary};
  font-size: 17px;
  font-weight: 400;
  text-align: left;
  color: ${buttons.textButton.defaultText};
  padding: 10px 0;
  text-align: center;
`

export const InputWarning = styled.p`
  font-family: ${primary};
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: ${text.warning};
  padding-top: 10px;
`
