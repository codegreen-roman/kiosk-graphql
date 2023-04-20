import styled from 'styled-components'
import { Row } from '@components/Row'
import { Column as ColumnComponent } from '@components/Column'
import { getTextColors, getFonts } from '@themeSettings'

const textColors = getTextColors()
const fonts = getFonts()

export const Root = styled(Row)`
  && {
    flex-wrap: nowrap;
    padding: 11px 17px;
  }
`

export const Column = styled(ColumnComponent)`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
  align-items: center;
  flex-shrink: 1;
  flex-grow: 0;
  font: normal 18px ${fonts.secondary};
  color: ${textColors.annotation};
`

interface IconHolderProps {
  gray?: boolean
  height: string
}

export const IconHolder = styled.div`
  height: ${({ height }: IconHolderProps): string => height};
  svg {
    width: auto;
    height: ${({ height }: IconHolderProps): string => height};
  }
  path {
    fill: ${({ gray }: IconHolderProps): string => (gray ? textColors.annotation : undefined)};
  }
`
