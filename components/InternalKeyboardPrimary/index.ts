import { Dispatch, FC } from 'react'
import { chooseThemeComponent } from '@utils/theming'
import themeNames from '@const/themeNames'
import KihnuKiosk from './themes/kihnuKiosk/InternalKeyboard'

export interface InternalKeyboardProps {
  setInputs: Dispatch<object>
  inputName: string
  enterIsEnabled: boolean
  mainPadIsEnabled: boolean
  enterIsShown: boolean
  shouldRemoveInput?: boolean
  onEnter?: () => void
  isNumerical?: boolean
}

export const InternalKeyboardPrimary: FC<InternalKeyboardProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
