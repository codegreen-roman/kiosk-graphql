import KihnuKiosk from './themes/kihnuKiosk/ContentBlock'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { FC, ReactNode } from 'react'

export interface ContentBlockProps {
  className?: string
  children: ReactNode
  selected?: boolean
  disabled?: boolean
}

export const ContentBlock: FC<ContentBlockProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
