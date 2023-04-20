import { FC } from 'react'
import { chooseThemeComponent } from '@utils/theming'
import themeNames from '@const/themeNames'
import KihnuKiosk from './themes/kihnuKiosk/UpcomingSail'
import { SailStatusType } from '@interfaces/boraCore'

export interface UpcomingSailProps {
  shouldReload: boolean
  setReloadFlag(flag: boolean): void
  routeLeg: string
  route: {
    code: string
  }
  time: string
  direction: string
  vessel: string
  passengers: number
  extraPassengers: number
  reservePassengers: number | undefined
  bicycles: number
  extraBicycles: number
  reserveBicycles: number | undefined
  vehicles: number
  extraVehicles: number
  reserveVehicles: number | undefined
  extraTicketsAvailableTime?: string
  salesClosed: boolean
  status: SailStatusType
  callBack?(once?: boolean): void
  reserveTicketsAvailableTime?: string
}

export const UpcomingSail: FC<UpcomingSailProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
