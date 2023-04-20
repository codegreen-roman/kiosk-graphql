import KihnuKiosk from './themes/kihnuKiosk/Clock'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { FC } from 'react'

export type ClockProps = {}

export const Clock: FC<ClockProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
