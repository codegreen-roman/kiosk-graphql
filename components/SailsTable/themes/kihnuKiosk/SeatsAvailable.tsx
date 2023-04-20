import React, { FC } from 'react'
import { Root, Num, NumHolder, Local, Scale } from './SeatsAvailableStyles'
import { getLowAvailableTicketsLevel, getLowReserveTicketsLevel } from '@themeSettings'
import { ValueLevel } from '@interfaces/boraCore'
import { ReservesMax } from '@const/common'

const lowAvailableTicketsLevel = getLowAvailableTicketsLevel()
const lowReserveTicketsLevel = getLowReserveTicketsLevel()

export interface SeatsAvailableProps {
  current: number
  max: number
  local?: number
  reserve?: number
}

interface ComputingLevelColorProps {
  ratio: number
  isReserve: boolean
}
const computeLevelColorForRatio = ({ ratio, isReserve }: ComputingLevelColorProps): ValueLevel => {
  if (ratio === 0 || isNaN(ratio)) {
    return ValueLevel.LOW
  }
  if ((!isReserve && ratio < lowAvailableTicketsLevel) || (isReserve && ratio < lowReserveTicketsLevel)) {
    return ValueLevel.MIDDLE
  }
  return ValueLevel.HIGH
}

const SeatsAvailable: FC<SeatsAvailableProps> = ({ current, max, local, reserve }) => {
  const currentValueFormatted = current === 0 ? `${current}*` : current
  const currentReserveFormatted = reserve === 0 ? `${reserve}**` : reserve

  const currentRatio = current / max
  const currentRatioReserves = reserve / ReservesMax

  const level = computeLevelColorForRatio({ ratio: currentRatio, isReserve: false })
  const levelForReserves = computeLevelColorForRatio({ ratio: currentRatioReserves, isReserve: true })

  return (
    <Root>
      <NumHolder>
        <Num level={level}>{currentValueFormatted}</Num>
        <Local display-if={local} level={level}>
          ({local})
        </Local>
        <Local display-if={reserve >= 0} level={levelForReserves}>
          ({currentReserveFormatted})
        </Local>
      </NumHolder>

      <Scale level={level} ratio={currentRatio} />
    </Root>
  )
}

export default SeatsAvailable
