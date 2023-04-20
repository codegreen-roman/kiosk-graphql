import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles'
import { themeSettings } from '@themeSettings'
import { getFonts } from '@themeSettings'
import { OutlinedInput } from '@material-ui/core'

const { form, dialog } = themeSettings.colors
const { primary, secondary } = getFonts()

export const Title = styled.div`
  font-family: ${primary};
  font-size: 18px;
  font-weight: 400;
  line-height: 21px;
  color: ${dialog.subText};
  padding-bottom: 20px;
  text-align: center;
`

export const Description = styled.div`
  display: flex;
  flex-direction: row;
  font-family: ${primary};
  font-size: 18px;
  font-weight: 400;
  color: ${dialog.subText};
  p {
    text-align: center;
    width: 150px;
  }
  span {
    color: #000;
    padding-left: 5px;
  }
`

export const WarningMessage = styled.div`
  background: ${dialog.warningBackground};
  padding: 5px;
  width: 375px;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-family: ${primary};
    font-size: 16px;
    font-weight: 400;
    color: ${dialog.warningColor};
  }
  p:last-child {
    padding-top: 10px;
    padding-bottom: 10px;
  }
`
export const SuccessMessage = styled.div`
  background: ${dialog.successSecondaryBackground};
  padding: 5px;
  width: 375px;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-family: ${primary};
    font-size: 16px;
    font-weight: 400;
    color: ${dialog.warningColor};
  }
  p:last-child {
    padding-top: 5px;
    padding-bottom: 5px;
  }
`

export const InputLabel = styled.div`
  max-width: 50%;
  font-family: ${primary};
  font-size: 15px;
  font-weight: 400;
  color: ${dialog.subText};
  line-height: 17.5px;
  padding-top: 5px;
  padding-bottom: 8px;
  padding-right: 25px;
  text-align: right;
`

export const CompanyOutlinedInput = styled(OutlinedInput)`
  &.MuiOutlinedInput-root {
    display: flex;
    width: 100%;
    height: 44px;
    background-color: white;
    .MuiOutlinedInput-input {
      ::placeholder {
        font-family: ${primary};
        font-size: 18px;
        font-weight: 400;
        color: ${form.placeholderColor};
        opacity: 1;
      }
    }
  }
  &.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border-color: ${form.inputPrimaryBorder};
  }
  &:hover.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border-color: ${form.inputPrimaryBorder};
  }
  &.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 1px solid ${form.inputPrimaryBorder};
  }
`

export const CompanyInputButton = styled.button`
  width: 230px;
  height: 44px;
  font-family: ${secondary};
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.17px;
  text-transform: uppercase;
  background-color: #bdbdbd;
  color: white;
  border: none;
  margin-left: 10px;
`

export const CheckboxLabel = styled.div`
  max-width: 50%;
  font-family: ${primary};
  font-size: 15px;
  font-weight: 400;
  color: ${dialog.subText};
  line-height: 17.5px;
  padding-left: 10px;
  padding-right: 25px;
  text-align: right;
`

export const useCheckboxStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: 4,
    width: 34,
    height: 34,
    border: '1px solid #94A8B2',
    backgroundColor: '#FBFBFB',
  },
  checkedIcon: {
    backgroundColor: `${form.radioCheckedColor}`,
    border: `1px solid ${form.radioCheckedColor}`,
    padding: '5px 3px',
    '&:before': {
      display: 'block',
      width: 26,
      height: 19,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 19 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M6.04545 11.0746L1.51136 6.68657L0 8.14925L6.04545 14L19 1.46269L17.4886 0L6.04545 11.0746Z'" +
        " fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
      backgroundRepeat: 'no-repeat',
    },
    'input:hover ~ &': {
      backgroundColor: `${form.radioCheckedColor}`,
    },
  },
})

export const WheelchairIconHolder = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5px;
  svg {
    width: 34px;
    height: 37px;
  }
`
