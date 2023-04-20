import KihnuKiosk from './themes/kihnuKiosk/Layout'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { FC, ReactNode } from 'react'

export type LayoutProps = {
  readonly children?: ReactNode
  readonly title?: string
  readonly isErrorOccurred?: boolean
  readonly step: number
}

export const Layout: FC<LayoutProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
