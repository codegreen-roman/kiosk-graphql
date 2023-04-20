import React, { FC, useContext } from 'react'
import { Root, ClockIcon, Time } from './ClockStyles'
import { ClockProps } from '@components/Clock'
import { CurrentTimeContext } from '@components/Layout/themes/kihnuKiosk/Layout'

const Clock: FC<ClockProps> = () => {
  const [currentTime] = useContext(CurrentTimeContext)
  return (
    <Root>
      <ClockIcon />
      <Time>{currentTime}</Time>
    </Root>
  )
}

export default Clock
