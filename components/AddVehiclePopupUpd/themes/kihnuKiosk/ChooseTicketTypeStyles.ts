import styled from 'styled-components'
import { themeSettings } from '@themeSettings'
import { getFonts, getContentBlockColors, getTextColors } from '@themeSettings'

const { primary, secondary } = getFonts()
const contentBlockColors = getContentBlockColors()
const textColors = getTextColors()
const { dialog } = themeSettings.colors

export const StyledTicketType = styled.div<{ isSelected?: boolean; text: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-radius: 2px;
  height: 90px;
  padding: 0 18px;
  ${(props): string => {
    return props.isSelected ? `pointer-events: none;` : ''
  }}
  background: ${(props): string => (props.isSelected ? dialog.selectedItemBg : contentBlockColors.background)};
  border: ${(props): string =>
    props.isSelected ? `1px solid ${dialog.selectedItemBorder};` : `1px solid ${contentBlockColors.border};`};
  color: ${textColors.default};

  p {
    font-family: ${primary};
    font-weight: 400;
    flex-basis: 70%;
    padding-right: 10px;
    font-size: ${(props): string => (props.text.length >= 40 ? '16px' : '19px')};
  }
  span {
    font-family: ${secondary};
    font-size: 24px;
    font-weight: 500;
    letter-spaceing: 0.95px;
    color: ${dialog.mainText};
    flex-basis: 30%;
    text-align: right;
  }
`
