import React, { FC, ReactElement, useContext } from 'react'
import { Root, Step } from './StepsRouterStyles'
import { StepObject, StepsRouterProps } from '@components/StepsRouter'
import { LayoutContext } from '@components/Layout/themes/kihnuKiosk/Layout'

const StepsRouter: FC<StepsRouterProps> = ({ className, steps, hideLabels }) => {
  const layout = useContext(LayoutContext)

  const stepTransform = (step: StepObject): ReactElement => {
    if (step.index <= layout.currentStep) {
      step.active = true
      step.passed = true
    } else {
      step.active = false
      step.passed = false
    }
    return <Step {...step} key={step.label} hideLabel={hideLabels} />
  }

  return <Root className={className}>{steps.map(stepTransform)}</Root>
}
export default StepsRouter
