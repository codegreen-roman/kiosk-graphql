import styled, { css, FlattenSimpleInterpolation } from 'styled-components'
import { getContentBlockColors } from '@themeSettings'

const contentBlockColors = getContentBlockColors()

interface Props {
  selected?: boolean
  disabled?: boolean
}

const calculateStateStyles = ({ selected, disabled }: Props): FlattenSimpleInterpolation => {
  if (disabled) {
    return css`
      background: ${contentBlockColors.selectedBackground};
      border-color: ${contentBlockColors.selectedBorder};
    `
  } else if (selected) {
    return css`
      background: ${contentBlockColors.selectedBackground};
      border-color: ${contentBlockColors.selectedBorder};
    `
  }

  return css`
    background: ${contentBlockColors.background};
    border-color: ${contentBlockColors.border};
  `
}

export const Root = styled.div`
  ${calculateStateStyles};
  border-width: 1px;
  border-style: solid;
  border-radius: 2px;
  padding: 11px 17px;
`
