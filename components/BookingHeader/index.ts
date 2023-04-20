import KihnuKiosk from './themes/kihnuKiosk/BookingHeader'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { FC } from 'react'

export interface BookingHeaderProps {
  readonly goToSchedules: () => void
  readonly isConfirmAndPayStepAvailable: boolean
  readonly isErrorOccurred: boolean
  readonly isSelectTicketsStepAvailable: boolean
}

export const BookingProcessHeader: FC<BookingHeaderProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
