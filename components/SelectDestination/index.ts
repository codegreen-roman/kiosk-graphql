import { FC } from 'react'
import { chooseThemeComponent } from '@utils/theming'
import themeNames from '@const/themeNames'
import KihnuKiosk from './themes/kihnuKiosk/SelectDestination'

export type DestinationSailPackage = {
  code: string
  routeCode: string
  title: string
}

export interface SelectDestinationProps {
  readonly sailPackages: DestinationSailPackage[]
  readonly port?: string
}

export const SelectDestination: FC<SelectDestinationProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
