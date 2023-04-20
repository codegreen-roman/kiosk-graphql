import KihnuKiosk from './themes/kihnuKiosk/DatePicker'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { FC } from 'react'
import { DatePickerProps } from '@material-ui/pickers/DatePicker/DatePicker'

export const DatePicker: FC<DatePickerProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
