import KihnuKiosk from './themes/kihnuKiosk/Terms'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { FC } from 'react'

export interface TermsProps {
  terms: string[]
  agreement?: string
  callBack?(arg: boolean): void
  hasBoldTerm?: boolean
}

export const Terms: FC<TermsProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
