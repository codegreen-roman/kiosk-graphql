import { FC } from 'react'
import { chooseThemeComponent } from '@utils/theming'
import themeNames from '@const/themeNames'
import KihnuKiosk from './themes/kihnuKiosk/InternalKeyboard'

export interface InternalKeyboardProps {
  step: number
  setVehicleNumber: (param: string) => void
}

export const InternalKeyboard: FC<InternalKeyboardProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
