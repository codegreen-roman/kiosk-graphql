import styled, { css } from 'styled-components'
import { getContentBlockColors } from '@themeSettings'
import { Icon } from '@components/Icon'

const contentColors = getContentBlockColors()

const warningIconStyles = css`
  width: 30px;
  height: 30px;
  svg {
    width: 20px;
    height: 25px;
  }
`
export const RightIcon = styled(Icon['arrow-right-calendar'])`
  background-color: ${contentColors.background};
  ${warningIconStyles};
`

export const LeftIcon = styled(Icon['arrow-left-calendar'])`
  background-color: ${contentColors.background};
  ${warningIconStyles};
`
