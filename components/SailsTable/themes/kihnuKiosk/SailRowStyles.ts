import styled, { css } from 'styled-components'
import { Icon } from '@components/Icon'
import { getTextColors, getFonts } from '@themeSettings'

const fonts = getFonts()

const textColors = getTextColors()

interface RootProps {
  // workaround to avoid warning in browser console about boolean and custom dom attributes
  disabled?: number
}

export const Root = styled.div`
  position: relative;
  width: 100%;
  cursor: ${({ disabled }: RootProps): string => (disabled ? 'default' : 'pointer')};
  opacity: ${({ disabled }: RootProps): number => (disabled ? 0.6 : 1)};
  user-select: none;
`

export const DepartureTime = styled.div`
  margin-right: 5px;
  font: bold 30px/30px ${fonts.secondary};
  color: ${textColors.heading};
`

const warningIconStyles = css`
  width: 20px;
  height: 20px;
  line-height: 20px;

  &:not(:last-child) {
    margin-right: 5px;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

export const DangerIcon = styled(Icon.danger)`
  ${warningIconStyles}
`

export const AnchorIcon = styled(Icon.anchor)`
  ${warningIconStyles}
`

export const NoTrucksIcon = styled(Icon.noTrucks)`
  ${warningIconStyles}
`

export const ExtraTicketsWrapper = styled.div`
  display: block;
`

export const ExtraTicketsLabel = styled.div`
  font: bold 10px ${fonts.primary};
  color: ${textColors.info};
  text-transform: uppercase;
  padding-left: 1px;
  padding-bottom: 3px;
`

export const ExtraTicketsText = styled.div`
  font: normal 25px ${fonts.secondary};
  color: ${textColors.info};
`

export const OkIcon = styled(Icon.okMark)`
  position: absolute;
  top: 50%;
  right: 25px;
  transform: translateY(-50%);
  width: 19px;
  height: 14px;

  svg {
    width: 19px;
    height: 14px;
  }
`
