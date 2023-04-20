import React, { FC } from 'react'
import { Root, Point, Label } from './StepStyles'
import { StepProps } from '@components/StepsRouter'

const StepsRouter: FC<StepProps> = ({ className, label, active, passed, hideLabel }) => (
  <Root className={className} active={active} passed={passed}>
    <Point passed={passed} />
    <Label>{!hideLabel && label}</Label>
  </Root>
)

export default StepsRouter
