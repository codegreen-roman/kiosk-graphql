import React, { FC } from 'react'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { createTheme } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import { MuiPickersOverrides } from '@material-ui/pickers/typings/overrides'
import { DatePickerProps } from '@material-ui/pickers/DatePicker/DatePicker'
import { getTextColors, getContentBlockColors } from '@themeSettings'
import { LeftIcon, RightIcon } from './DatePickerStyle'
import { localeUtilsMap, localeFormatMap, localeMap } from '@const/dateLocales'
import { useTranslation } from 'react-i18next'
const textColors = getTextColors()
const contentColors = getContentBlockColors()

type overridesNameToClassKey = {
  [P in keyof MuiPickersOverrides]: keyof MuiPickersOverrides[P]
}
type CustomType = {
  MuiPickersStaticWrapper: {
    staticWrapperRoot
  }
  MuiPickersBasePicker: {
    pickerView
  }
}
declare module '@material-ui/core/styles/overrides' {
  interface ComponentNameToClassKey extends overridesNameToClassKey {
    test: string
  }
  export interface ComponentNameToClassKey extends CustomType {
    test: string
  }
}

const materialTheme = createTheme({
  overrides: {
    MuiPickersStaticWrapper: {
      staticWrapperRoot: {
        width: '100%',
        minWidth: 'unset',
      },
    },
    MuiPickersBasePicker: {
      pickerView: {
        flexShrink: 0,
        width: '100%',
        maxWidth: 'unset',
        minWidth: 'unset',
        height: '330px',
        background: contentColors.background,
        border: `1px solid ${contentColors.border}`,
        marginTop: '46px',
        paddingTop: '15px',
      },
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        margin: 'auto',
        width: '85%',
        marginTop: '-10px',
        marginBottom: '20px',
        alignItems: 'flex-start',
        textTransform: 'capitalize',
      },
      daysHeader: {
        margin: 'auto',
        width: '90%',
      },
      iconButton: {
        backgroundColor: contentColors.background,
        padding: 0,
      },
    },
    MuiPickersDay: {
      daySelected: {
        backgroundColor: textColors.info,
      },
      dayDisabled: {
        color: textColors.disabled,
      },
      current: {
        backgroundColor: contentColors.current,
        color: null,
      },
    },
  },
})

export const DatePickerSail: FC<DatePickerProps> = ({ ...data }) => {
  const { i18n } = useTranslation()
  return (
    <ThemeProvider theme={materialTheme}>
      <MuiPickersUtilsProvider utils={localeUtilsMap[i18n.language]} locale={localeMap[i18n.language]}>
        <DatePicker
          {...data}
          disableToolbar={true}
          format={localeFormatMap[i18n.language]}
          variant="static"
          openTo="date"
          leftArrowIcon={<LeftIcon />}
          rightArrowIcon={<RightIcon />}
          disablePast={true}
        />
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  )
}

export default DatePickerSail
