import KihnuKiosk from './themes/kihnuKiosk/LangSwitcher'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { FC } from 'react'

export interface LangSwitcherProps {
  className?: string
}

export const LangSwitcher: FC<LangSwitcherProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
