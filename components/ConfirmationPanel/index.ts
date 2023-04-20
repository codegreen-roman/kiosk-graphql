import KihnuKiosk from './themes/kihnuKiosk/ConfirmationPanel'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { FC } from 'react'

export interface ConfirmationPanelProps {
  vessel: string
}
export const ConfirmationPanel: FC<ConfirmationPanelProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
