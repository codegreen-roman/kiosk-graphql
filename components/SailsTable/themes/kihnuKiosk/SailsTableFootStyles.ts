import styled from 'styled-components'
import { getFonts, getFootNoteColors, getTextColors } from '@themeSettings'

const fonts = getFonts()
const textColors = getTextColors()
const footNoteColors = getFootNoteColors()

export const Root = styled.div`
  display: block;
`

interface MessageProps {
  type: 'error' | 'danger' | 'warning' | 'info' | 'annotation' | 'default'
}
export const Message = styled.div`
  display: flex;
  align-items: center;
  font: normal 14px ${fonts.secondary};
  text-transform: uppercase;
  margin-top: 5px;
  color: ${({ type }: MessageProps): string => (type === 'annotation' ? textColors.annotation : footNoteColors[type])}};
  margin-left: 5px;
  &:not(:last-child) {
    margin-bottom: 18px;
  }
`

export const IconHolder = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 5px;
  svg {
    width: 20px;
    height: 20px;
  }
`
