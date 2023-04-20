import styled from 'styled-components'
import { getFonts, getValueLevelColors } from '@themeSettings'
import { ValueLevel } from '@interfaces/boraCore'

const fonts = getFonts()
const valueLevelColors = getValueLevelColors()

interface NumProps {
  level: ValueLevel
}

interface ScaleProps {
  level: ValueLevel
  ratio: number
}

const levelColors = {
  [ValueLevel.LOW]: valueLevelColors.low,
  [ValueLevel.MIDDLE]: valueLevelColors.mid,
  [ValueLevel.HIGH]: valueLevelColors.high,
}

function calculateScaleWidth({ ratio }: ScaleProps): string {
  if (ratio <= 0) return '5px'
  if (ratio >= 1) return '100%'
  return `${100 * ratio}%`
}

export const Root = styled.div`
  display: block;
`

export const NumHolder = styled.div`
  display: flex;
  align-items: flex-start;
`

export const Num = styled.span`
  font: normal 28px/38px ${fonts.secondary};
  color: ${({ level }: NumProps): string => levelColors[level]};
`

export const Local = styled.span`
  font: normal 19px/26px ${fonts.secondary};
  color: ${({ level }: NumProps): string => levelColors[level]};
`

export const Scale = styled.div`
  position: relative;
  width: 35px;
  height: 6px;
  background: ${valueLevelColors.disabled};

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: ${calculateScaleWidth};
    height: 100%;
    background: ${({ level }: ScaleProps): string => levelColors[level]};
  }
`
