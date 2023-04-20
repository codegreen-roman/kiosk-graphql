import styled from 'styled-components'
import { getFonts, getPageHeadingColors } from '@themeSettings'
const pageHeadingColors = getPageHeadingColors()

const { secondary } = getFonts()

export const DirectionTitle = styled.div`
  font-family: ${secondary};
  font-weight: 500;
  font-size: 24px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: ${pageHeadingColors.mainText};
`
export const PrimaryDirectionTitle = styled.div`
  font-family: ${secondary};
  font-weight: 500;
  font-size: 40px;
  letter-spacing: 0.25px;
  text-transform: uppercase;
  color: ${pageHeadingColors.mainText};
`
export const ArrowIconHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px 30px 0;
  color: ${pageHeadingColors.mainText};
`
