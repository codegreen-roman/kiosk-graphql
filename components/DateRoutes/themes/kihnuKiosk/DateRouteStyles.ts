import styled from 'styled-components'
import { getFonts, getPageHeadingColors, getTextColors } from '@themeSettings'

const pageHeadingColors = getPageHeadingColors()
const textColors = getTextColors()

const { primary, secondary } = getFonts()

export const AddIconHolder = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`

export const ArrowIconHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 16px;
`

export const ShipIconHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 34px;
    height: 15px;
    path {
      fill: ${textColors.nameAccent};
    }
  }
`

export const BorderRight = styled.div`
  border-right: 1px solid rgba(0, 0, 0, 0.3);
`

export const DirectionTitle = styled.div`
  font-family: ${secondary};
  font-weight: 500;
  font-size: 24px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: ${pageHeadingColors.mainText};
`

export const TimeStamp = styled.div`
  font-family: ${secondary};
  font-weight: 500;
  font-size: 30px;
  letter-spacing: 0.96px;
  text-transform: uppercase;
  color: ${pageHeadingColors.mainText};
  line-height: 1.5;
`

export const VesselName = styled.div`
  font-family: ${secondary};
  font-weight: 400;
  font-size: 21px;
  line-height: 1.5;
  color: ${textColors.nameAccent};
  padding-left: 8px;
`

export const SubTitle = styled.div`
  font-family: ${primary};
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 0.5px;
  color: ${pageHeadingColors.label};
`

export const CloseButtonText = styled.div`
  width: 94px;
  font-family: ${primary};
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.5px;
  color: ${pageHeadingColors.label};
  text-align: center;
  padding-top: 8px;
`

export const TextWrapper = styled.div`
  font-family: ${secondary};
  font-size: 30px;
  letter-spacing: 0.96px;
  text-align: center;
  color: ${textColors.annotation};
  text-transform: uppercase;
`
