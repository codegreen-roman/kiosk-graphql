import styled from 'styled-components'
import { getFonts, getPageHeadingColors } from '@themeSettings'

const pageHeadingColors = getPageHeadingColors()

const fonts = getFonts()

export const SubHeading = styled.div`
  display: flex;
  align-items: center;
  font: 700 28px ${fonts.secondary};
  color: ${pageHeadingColors.mainText};
  margin-bottom: 16px;
`

export const IconHolder = styled.div`
  display: flex;
  justify-content: center;
  max-width: 78px;
`
export const Root = styled.div`
  margin: 30px;
`
