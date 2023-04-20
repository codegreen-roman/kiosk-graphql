import styled from 'styled-components'
import { makeStyles } from '@material-ui/core/styles'
import { themeSettings } from '@themeSettings'
import { getFonts } from '@themeSettings'
import { OutlinedInput } from '@material-ui/core'

const { form, dialog } = themeSettings.colors
const { primary, secondary } = getFonts()

export const FormLabel = styled.span`
  font-family: ${primary};
  font-size: 18px;
  font-weight: 400;
  text-align: center;
`

export const useRadioStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: '8px 10px',
  },
  icon: {
    borderRadius: '50%',
    width: 24,
    height: 24,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: `${form.radioUncheckedColor}`,
    'input:hover ~ &': {
      backgroundColor: `${form.radioUncheckedColor}`,
    },
  },
  checkedIcon: {
    backgroundColor: `${form.radioCheckedColor}`,
    boxShadow: 'none',
    '&:before': {
      display: 'block',
      width: 24,
      height: 24,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: `${form.radioCheckedColor}`,
    },
  },
})

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

export const RadioLabel = styled.span`
  font-family: ${primary};
  font-size: 16px;
  font-weight: 400;
  line-height: 0;
  color: ${form.radioLabelColor};
`

export const Description = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: ${primary};
  font-size: 18px;
  font-weight: 400;
  color: ${dialog.subText};
  padding: 10px 0;
  p {
    text-align: right;
    width: 100px;
  }
  span {
    color: #000;
    padding-left: 10px;
  }
`

export const WarningMessage = styled.div`
  background: ${dialog.warningBackground};
  padding: 10px;
  p {
    font-family: ${primary};
    font-size: 16px;
    font-weight: 400;
    color: ${dialog.warningColor};
  }
  p:last-child {
    padding-top: 10px;
  }
`

export const VehicleOutlinedInput = styled(OutlinedInput)`
  &.MuiOutlinedInput-root {
    width: 50px;
    height: 32px;
    margin: 0 14px;
    .MuiOutlinedInput-input {
      text-align: center;
      padding: 6px 0;
    }
  }
  &.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border: 1px solid #94a8b2;
    box-shadow: inset 0px 1px 3px #79909b;
  }
  &:hover.MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border: 1px solid #94a8b2;
  }
  &.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 1px solid #94a8b2;
  }
`

export const InputLabel = styled.div`
  max-width: 422px;
  font-family: ${primary};
  font-size: 15px;
  font-weight: 400;
  color: ${dialog.subText};
  line-height: 17.5px;
  padding-top: 5px;
  padding-bottom: 8px;
`

export const CheckboxLabel = styled.div`
  max-width: 226px;
  font-family: ${primary};
  font-size: 15px;
  font-weight: 400;
  color: ${dialog.subText};
  line-height: 17.5px;
  padding-left: 10px;
`

export const CompanyOutlinedInput = styled(OutlinedInput)`
  &.MuiOutlinedInput-root {
    width: 222px;
    height: 44px;
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

export const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0eb1bc;
  border-radius: 50%;
  width: 36px;
  height: 36px;
`

export const SvgIconHolder = styled.div`
  display: flex;
  justify-content: center;
  svg {
    width: 10px;
  }
`
export const WheelchairIconHolder = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 5px;
  svg {
    width: 34px;
    height: 37px;
  }
  path {
    fill: #000;
  }
`

export const Subtitle = styled.div`
  font-family: ${primary};
  font-size: 14px;
  font-weight: 400;
  color: ${dialog.subText};
`

export const SizeBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-family: ${primary};
  font-size: 15px;
  font-weight: 400;
  color: ${dialog.subText};
  span {
    color: #000;
    padding-top: 5px;
  }
`
