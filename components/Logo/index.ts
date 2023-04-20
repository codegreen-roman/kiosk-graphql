import KihnuKiosk from './themes/kihnuKiosk/Logo'
import KihnuSales from './themes/kihnuSales/Logo'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { FC } from 'react'

export interface LogoProps {
  className?: string
}

export const Logo: { [key: string]: FC<LogoProps> } = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
  [themeNames.kihnuSales]: KihnuSales,
})
