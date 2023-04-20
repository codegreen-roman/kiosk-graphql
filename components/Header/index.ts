import KihnuKiosk from './themes/kihnuKiosk/Header'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { FC } from 'react'

export const Header: FC = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
