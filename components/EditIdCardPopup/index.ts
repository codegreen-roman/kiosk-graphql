import { FC } from 'react'
import { chooseThemeComponent } from '@utils/theming'
import themeNames from '@const/themeNames'
import KihnuKiosk from './themes/kihnuKiosk/EditIdCardPopup'

export interface EditIdCardPopupProps {
  open: boolean
  handleOnClose: () => void
  data: {
    type: string
    idNumbers: string[]
  }
  selectedIdNumberIdx: number
  setSelectedIdNumberIdx: (idx: number) => void
  handleConfirmDeletion: (type: string) => void
}

export const EditIdCardPopup: FC<EditIdCardPopupProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
