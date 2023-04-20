import styled from 'styled-components'
import { getContentBlockColors, getPageHeadingColors } from '@themeSettings'

const contentBlockColors = getContentBlockColors()
const pageHeadingColors = getPageHeadingColors()

export const TermBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border: 1px solid ${contentBlockColors.borderTerms};
  background-color: ${pageHeadingColors.mainBackground};
  padding: 10px;
  margin-bottom: 15px;
`
export const AgreeBox = styled.div`
  padding: 0 10px 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${contentBlockColors.border};
  background-color: ${contentBlockColors.background};
`

export const BoldTerm = styled.span`
  font-weight: bold;
`
