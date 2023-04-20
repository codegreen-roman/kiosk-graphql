import KihnuKiosk from './themes/kihnuKiosk/DateRouteChooser'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { Dispatch, FC } from 'react'

export interface DateRouteProps {
  routeLegs: string[]
  route: string
  handleSavedDate: (date: Date) => void
  handleSailRefId?: (sailRefId: number) => void
  oneWaySailRefId?: number
  routeHasChanged?: boolean
  setRouteChanged?: Dispatch<boolean>
}

export const DateRoute: FC<DateRouteProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
