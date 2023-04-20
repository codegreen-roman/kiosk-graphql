import KihnuKiosk from './themes/kihnuKiosk/Text'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { TextProps } from '@components/Text/TextProps'
import { FC } from 'react'

export const Text: FC<TextProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
