import KihnuKiosk from './themes/kihnuKiosk/PaymentPanel'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { FC } from 'react'
import { ReservationLoad } from '@interfaces/boraCore'

export interface PaymentPanelProps {
  serverData?: ReservationLoad
}
export const PaymentPanel: FC<PaymentPanelProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
