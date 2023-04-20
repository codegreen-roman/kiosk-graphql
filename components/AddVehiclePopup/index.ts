import { FC } from 'react'
import { chooseThemeComponent } from '@utils/theming'
import themeNames from '@const/themeNames'
import KihnuKiosk from './themes/kihnuKiosk/AddVehiclePopup'
import { CarTicketType } from '@components/SelectTicketPanel'

export type TimeOfDepartureOneWay = {
  to: Date
}
export type TimeOfDepartureRoundTrip = {
  from: Date
} & TimeOfDepartureOneWay

export interface AddVehiclePopupProps {
  open: boolean
  handleOnClose: () => void
  tickets: CarTicketType[]
  chosenVehicleTicketIdx: number
  setChosenVehicleTicketIdx: (param: number) => void
  manageVehicleNumbers: (vehicleNumber: string, type: string, data: { automatic?: object; manual?: object }) => void
  selectedTicket: {
    text: string
    price: number
  }
  dataForVehicleQuery: {
    type: string
    route: string
    sailRefId: number
    reservationId: number
    isRoundTrip: boolean
    backSailRefId?: number
  }
  isVehicleRemoved: string
  reservationError: {
    flag: boolean
    message: string
    code: string
  }
  timeOfDeparture: TimeOfDepartureOneWay | TimeOfDepartureRoundTrip
  isVehicleAddedToReservation: boolean
}

export const AddVehiclePopup: FC<AddVehiclePopupProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
