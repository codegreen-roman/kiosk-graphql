import { FC } from 'react'
import { chooseThemeComponent } from '@utils/theming'
import themeNames from '@const/themeNames'
import KihnuKiosk from './themes/kihnuKiosk/Timer'

export interface TimerProps {
  date: number
  color: string
  isUpcoming: boolean
  direction?: string
  isTitleNeeded?: boolean
  onlySeconds?: boolean
}

export const Timer: FC<TimerProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
