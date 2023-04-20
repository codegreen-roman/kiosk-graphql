import styled from 'styled-components'
import { themeSettings } from '@themeSettings'
import { getFonts, getContentBlockColors, getPageHeadingColors, getTextColors } from '@themeSettings'

const { primary, secondary } = getFonts()
const contentBlockColors = getContentBlockColors()
const pageHeadingColors = getPageHeadingColors()
const textColors = getTextColors()

const { text } = themeSettings.colors

export const Root = styled.div`
  position: relative;
  height: 100%;
`

export const PolygonGraphic = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: -40px;
  background-image: url(/themes/kihnuKiosk/images/polygon.png);
  background-repeat: no-repeat;
  background-size: contain;
  z-index: 0;
  pointer-events: none;
`

export const Wrapper = styled.div`
  position: relative;
  z-index: 2;
`

export const StyledTicketType = styled.div<{ isSelected?: boolean; extendedTicketsList?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  font-family: ${primary};
  font-size: ${(props): string => (props.extendedTicketsList ? `14px` : `16px`)};
  border-radius: 2px;
  height: ${(props): string => (props.extendedTicketsList ? `60px` : `70px`)};
  padding: ${(props): string => (props.extendedTicketsList ? `0 20px` : `0 24px`)};
  ${(props): string => {
    return props.isSelected ? `pointer-events: none;` : ''
  }}
  background: ${(props): string =>
    props.isSelected ? contentBlockColors.disabledBorder : contentBlockColors.background};
  border: ${(props): string =>
    props.isSelected ? `1px solid ${contentBlockColors.disabledBorder};` : `1px solid ${contentBlockColors.border};`};
  color: ${(props): string => (props.isSelected ? textColors.disabled : textColors.default)};
`

export const IconHolder = styled.div<{ type?: string; isSelected?: boolean }>`
  margin-right: 13px;

  svg {
    width: auto;
    height: ${(props): string =>
      props.type === 'citizen'
        ? '17px'
        : props.type === 'adult'
        ? '30px'
        : props.type === 'disabledChildren' ||
          props.type === 'companionForDisabled' ||
          props.type === 'blindPerson' ||
          props.type === 'companionForBlind' ||
          props.type === 'disabledPeople'
        ? '33px'
        : props.type === 'vehicle'
        ? '23px'
        : props.type === 'bicycle'
        ? '27px'
        : props.type === 'trailer'
        ? '35px'
        : ''};
  }

  path,
  ellipse {
    fill: ${(props): string => (props.isSelected ? textColors.disabled : undefined)};
  }
  path.stroke {
    stroke: ${(props): string => (props.isSelected ? textColors.disabled : undefined)};
  }
`

export const SvgIconHolder = styled.div`
  display: flex;
  justify-content: center;
`

export const EditIconHolder = styled.div`
  display: block;
`

export const Circle = styled.div<{ color: string; disabled: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props): string => {
    return props.color
  }};
  border-radius: 50%;
  width: 46px;
  height: 46px;
  pointer-events: ${(props): string => (props.disabled ? 'none' : 'unset')};
`

export const Number = styled.div`
  font-family: ${secondary};
  font-size: 40px;
  font-weight: 500;
  color: ${pageHeadingColors.mainText};
  padding: 0 26px;
`

export const InsertedNumbers = styled.div<{ description?: string }>`
  width: ${(props): string => (props.description && props.description.length >= 40 ? '350px' : 'unset')};
  font-family: ${primary};
  font-size: ${(props): string => (props.description && props.description.length >= 40 ? '16px' : '20px')};
  font-weight: 400;
  color: ${text.annotation};
  padding-right: 20px;
`

export const InsertedRegNumbers = styled.div`
  font-family: ${primary};
  font-size: 20px;
  font-weight: 400;
  color: ${text.annotation};
  text-transform: uppercase;
  padding-right: 20px;
`

export const EmptyTicketsListPlaceholder = styled.div`
  font-family: ${secondary};
  font-size: 30px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.96px;
  color: ${text.annotation};
`

export const TicketWarning = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: 2px;
  height: 70px;
  padding: 0 24px;
  border: 1px solid ${contentBlockColors.warningBorder};
  background-color: ${contentBlockColors.warningBackground};
  p {
    font-family: ${primary};
    font-size: 20px;
    font-weight: bold;
    color: ${contentBlockColors.warningText};
  }
`

export const TriangleShape = styled.div<{ isMonoType?: boolean }>`
  position: absolute;
  right: ${(props): string => (props.isMonoType ? '78px' : '18px')};
  top: -15px;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-right: 10px solid ${contentBlockColors.warningBorder};
  transform: rotate(90deg);
  &::after {
    content: '';
    width: 0;
    height: 0;
    border-top: 14px solid transparent;
    border-bottom: 14px solid transparent;
    border-right: 14px solid ${contentBlockColors.warningBackground};
    position: absolute;
    top: -14px;
    left: 2px;
  }
`

export const PriceText = styled.div`
  display: flex;
  align-items: center;
  font-family: ${secondary};
  font-size: 24px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${textColors.terms};
`
export const PromotionText = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  color: ${textColors.promotionAccepted};
`
