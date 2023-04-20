import { FC, ReactNode } from 'react'
import { chooseThemeComponent } from '@utils/theming'
import themeNames from '@const/themeNames'
import KihnuKiosk from './themes/kihnuKiosk/BookingStepTitle'

export interface BookingStepTitleProps {
  children: ReactNode
  totalAmount?: number
  finalStep?: string
}

export const BookingStepTitle: FC<BookingStepTitleProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
