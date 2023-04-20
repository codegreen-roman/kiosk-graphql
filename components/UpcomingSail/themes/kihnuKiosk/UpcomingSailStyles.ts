import styled from 'styled-components'
import {
  getFonts,
  getContentBlockColors,
  getPageHeadingColors,
  getTextColors,
  getValueLevelColors,
} from '@themeSettings'
import { ValueLevel } from '@interfaces/boraCore'

const contentBlockColors = getContentBlockColors()
const pageHeadingColors = getPageHeadingColors()
const textColors = getTextColors()
const valueLevelColors = getValueLevelColors()

const { secondary } = getFonts()

const levelColors = {
  [ValueLevel.LOW]: valueLevelColors.low,
  [ValueLevel.MIDDLE]: valueLevelColors.mid,
  [ValueLevel.HIGH_UPCOMING]: valueLevelColors.highUpcoming,
}
interface ThirdlyNumberProps {
  level: ValueLevel
}
export const Root = styled.div`
  width: 100%;
  background: ${contentBlockColors.selectedBackground};
  border-top: 1px solid ${contentBlockColors.selectedBorder};
  border-bottom: 1px solid ${contentBlockColors.selectedBorder};
`

export const CustomWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 80px;
`

export const IconHolder = styled.div`
  margin-right: 10px;
`

export const Clock = styled.div`
  font-family: ${secondary};
  font-weight: 600;
  font-size: 50px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${pageHeadingColors.mainText};
`

export const Direction = styled.div`
  font-family: ${secondary};
  font-weight: 500;
  font-size: 40px;
  letter-spacing: 0.25px;
  text-transform: uppercase;
  color: ${pageHeadingColors.mainText};
`

export const Vessel = styled.div`
  display: flex;
  align-items: center;
  font-family: ${secondary};
  font-weight: 500;
  font-size: 32px;
  letter-spacing: 0.25px;
  color: ${pageHeadingColors.mainText};
  margin-left: 10px;
`

export const PrimaryNumber = styled.div`
  font-family: ${secondary};
  font-weight: 500;
  font-size: 39px;
  letter-spacing: 0.25px;
  color: ${pageHeadingColors.mainText};
  margin-left: 10px;
`

export const SecondaryNumber = styled.div`
  font-family: ${secondary};
  font-weight: 400;
  font-size: 28px;
  color: ${textColors.accent};
  margin-left: 10px;
  padding-top: 10px;
`

export const ThirdlyNumber = styled.div`
  height: 50px;
  font: normal 19px/26px ${secondary};
  color: ${({ level }: ThirdlyNumberProps): string => levelColors[level]};
`
