import styled from 'styled-components'
import { getFonts, getPageHeadingColors } from '@themeSettings'

const pageHeadingColors = getPageHeadingColors()

const { primary, secondary } = getFonts()

export const Root = styled.div<{ isExtraSpacing?: boolean }>`
  padding: ${(props): string => (props.isExtraSpacing ? `7px 0;` : `17px 0;`)};
`

export const IconHolder = styled.div`
  margin: 2px 13px 0;
`

export const Paragraph = styled.div`
  font-family: ${secondary};
  font-weight: 500;
  font-size: 24px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${pageHeadingColors.mainText};
`

export const Title = styled.div`
  font-family: ${primary};
  font-weight: 700;
  font-size: 20px;
  color: ${pageHeadingColors.label};
`
