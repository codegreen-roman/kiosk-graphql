import styled from 'styled-components'
import { themeSettings } from '@themeSettings'
import { getFonts } from '@themeSettings'
import { OutlinedInput } from '@material-ui/core'

const { buttons, form, text } = themeSettings.colors

const { primary } = getFonts()

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

export const InputDescription = styled.p`
  font-family: ${primary};
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: ${buttons.textButton.defaultText};
  padding: 10px 0;
`

export const InputWarning = styled.p`
  font-family: ${primary};
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: ${text.warning};
  padding-top: 10px;
`
