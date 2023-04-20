import { FC } from 'react'
import { chooseThemeComponent } from '@utils/theming'
import themeNames from '@const/themeNames'
import KihnuKiosk from './themes/kihnuKiosk/AlertPopup'
import { AlertPopupType } from '@interfaces/popupStatus'

export interface AlertPopupProps {
  alertOpen: boolean
  handleAlertOnClose: () => void
  handleOnSubmit?: () => void
  type?: AlertPopupType
  message: string
}

export const AlertPopup: FC<AlertPopupProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
