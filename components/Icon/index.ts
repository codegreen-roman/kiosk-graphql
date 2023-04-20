import KihnuKiosk from './themes/kihnuKiosk/Icon'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { FC } from 'react'

export interface IconProps {
  className?: string
}

export const Icon: { [key: string]: FC<IconProps> } = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
