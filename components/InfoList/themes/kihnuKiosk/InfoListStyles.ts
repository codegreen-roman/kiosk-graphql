import styled from 'styled-components'
import { getFonts, getPageHeadingColors } from '@themeSettings'

const pageHeadingColors = getPageHeadingColors()

const fonts = getFonts()

export const SubHeading = styled.div`
  display: inline-flex;
  align-items: center;
  font: 500 23px ${fonts.secondary};
  letter-spacing: 1px;
  color: ${pageHeadingColors.mainText};
  margin-bottom: 16px;
  text-transform: uppercase;
`
export const IconHolder = styled.div`
  display: flex;
  justify-content: center;
  max-width: 75px;
  margin-right: 5px;
  margin-bottom: 6px;
`
