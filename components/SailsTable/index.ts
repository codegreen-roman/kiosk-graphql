import KihnuKiosk from './themes/kihnuKiosk/SailsTable'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { Dispatch, FC } from 'react'
import { Sail } from '@interfaces/salesCore'

export interface TicketsAmount {
  localPassengers: number
  passengers: number
  bicycles: number
  vehicles: number
}

export interface SailsTableProps {
  sails: Sail[]
  direction: string
  onSelectSail: (s: number, leg?: string) => void
  leg?: string
  savedSailRefId?: number
  callbackForTriggerReloadSails(once?: boolean): void
  shouldReload: boolean
  setReloadFlag: Dispatch<boolean>
}

export const SailsTable: FC<SailsTableProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
