import KihnuKiosk from './themes/kihnuKiosk/StepsRouter'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { FC } from 'react'

export interface StepObject {
  index: number
  label: string
  active: boolean
  passed: boolean
}

export interface StepsRouterProps {
  className?: string
  steps: StepObject[]
  hideLabels?: boolean
}

export interface StepProps extends StepObject {
  className?: string
  hideLabel?: boolean
}

export const StepsRouter: FC<StepsRouterProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
