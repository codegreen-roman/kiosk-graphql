import { FC } from 'react'
import { chooseThemeComponent } from '@utils/theming'
import themeNames from '@const/themeNames'
import KihnuKiosk from './themes/kihnuKiosk/AddIdCardPopup'
import { TicketType } from '@components/SelectTicketPanel/themes/kihnuKiosk/selectTickets'

export interface AddIdCardPopupProps {
  open: boolean
  handleOnClose: () => void
  dataForMutation?: {
    reservationId: number
    port?: string
    leg: string
    sailRefId: number
    newRequestsAmount: {
      amount: number
      ticket?: TicketType
      reset: {
        flag: boolean
        idNumbers: string[]
      }
    }
    removing: boolean
    backLeg?: string
    backSailRefId?: number
  }
  reservationError: {
    flag: boolean
    message: string
    code: string
  }
  isCitizenAddedToReservation: boolean
  manageIds?: (array: string[] | null, type: string | null, isFailed: boolean, isManual: boolean) => void
}

export const AddIdCardPopup: FC<AddIdCardPopupProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
