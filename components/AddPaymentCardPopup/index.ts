import { FC } from 'react'
import { chooseThemeComponent } from '@utils/theming'
import themeNames from '@const/themeNames'
import KihnuKiosk from './themes/kihnuKiosk/AddPaymentCardPopup'

export interface AddPaymentCardPopupProps {
  open: boolean
  handleOnClose: () => void
  dataForMutation: {
    port: string
    reservationId: number
  }
  vesselName: string
  cancelInvalidReservation: () => void
}

export const AddPaymentCardPopup: FC<AddPaymentCardPopupProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
