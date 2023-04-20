import KihnuKiosk from './themes/kihnuKiosk/ActionPanel'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { FC } from 'react'

export interface ActionPanelProps {
  backText?: string
  cancelText?: string
  cancelHref?: string
  handleCancelButton?(): void
  submitText: string
  submitHref: string
  isEnabled?: boolean
  onClickAsync?: () => void
  isBusy?: boolean
  customBackHandler?(): void
}

export const ActionPanel: FC<ActionPanelProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
