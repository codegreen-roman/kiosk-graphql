import styled from 'styled-components'
import { getFonts, getTextColors } from '@themeSettings'
import { Justify, TextProps, TextType } from '@components/Text/TextProps'

const textColors = getTextColors()

const fonts = getFonts()
export const Root = styled.div`
  display: flex;
  justify-content: ${({ customJustify }: TextProps): string => {
    if (customJustify === Justify.FLEX_END) {
      return 'flex-end'
    }
    return 'flex-start'
  }};
  align-items: center;
  font-weight: 500;
  font-weight: ${({ type = TextType.DEFAULT }: TextProps): string => {
    if (type === TextType.ANNOTATION || type === TextType.TERMS) {
      return '400'
    }
    return '500'
  }};
  font-family: ${fonts.primary};
  font-size: ${({ type = TextType.DEFAULT }: TextProps): string => {
    if (type === TextType.WEATHER) {
      return '56px'
    }
    if (type === TextType.ANNOTATION || type === TextType.PAYMENT) {
      return '19px'
    }
    if (
      type === TextType.SCALED_PAYMENT ||
      type === TextType.SCALED_ANNOTATION ||
      type === TextType.UNITS ||
      type === TextType.PROMOTION
    ) {
      return '15px'
    }
    if (type === TextType.TERMS) {
      return '14px'
    }
    return '22px'
  }};
  color: ${({ type = TextType.DEFAULT }: TextProps): string => {
    if (type === TextType.ANNOTATION || type === TextType.SCALED_ANNOTATION) {
      return textColors.annotation
    }
    if (type === TextType.TERMS) {
      return textColors.terms
    }
    if (type === TextType.PROMOTION) {
      return textColors.promotionAccepted
    }
    return textColors.default
  }};
  text-align: ${({ customJustify }: TextProps): string => {
    if (customJustify === Justify.CENTER) {
      return 'center'
    }
    return 'inherit'
  }};
  text-transform: ${({ type = TextType.DEFAULT }: TextProps): string => {
    if (type === TextType.PAYMENT) {
      return 'uppercase'
    }
    return 'none'
  }};
`
