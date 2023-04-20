import { FC } from 'react'
import { chooseThemeComponent } from '@utils/theming'
import themeNames from '@const/themeNames'
import KihnuKiosk from './themes/kihnuKiosk/AddIdCardPaymentPopup'

export interface AddIdCardPaymentPopupProps {
  open: boolean
  handleOnClose: () => void
  dataForMutation: {
    port: string
    reservationId: number
  }
  payWithCard: () => void
  vesselName: string
  cancelInvalidReservation: () => void
}

export const AddIdCardPaymentPopup: FC<AddIdCardPaymentPopupProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
