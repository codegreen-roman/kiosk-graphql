import KihnuKiosk from './themes/kihnuKiosk/SelectTicketPanel'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { FC } from 'react'
import { TripDeck } from '@interfaces/prices'
import { Route } from '@interfaces/boraCore'

export interface CarTicketType {
  text: string
  price: number
  type: string
}

export interface SelectTicketPanelProps {
  tripSummary: {
    route: Route
    timeOfDepartureTo: Date
    timeOfDepartureFrom: Date
  }
  ticketDecks: TripDeck[]
  idCards: string[]
  sailRefId: number | number[]
  setGrandTotal(t: number): void
}

export const SelectTicketPanel: FC<SelectTicketPanelProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
