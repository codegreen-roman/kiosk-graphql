import { FC } from 'react'
import { chooseThemeComponent } from '@utils/theming'
import themeNames from '@const/themeNames'
import KihnuKiosk from './themes/kihnuKiosk/TripDirection'

export interface TripDescriptionProps {
  departure: string
  arrival: string
  isPrimary?: boolean
  roundTrip?: boolean
}

export const TripDirection: FC<TripDescriptionProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
