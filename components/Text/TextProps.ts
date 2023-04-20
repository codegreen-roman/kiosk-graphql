import { ReactNode } from 'react'

export enum TextType {
  DEFAULT = 'default',
  ANNOTATION = 'annotation',
  WEATHER = 'weather',
  PAYMENT = 'payment',
  TERMS = 'terms',
  UNITS = 'units',
  SCALED_PAYMENT = 'scaledPayment',
  PROMOTION = 'promotion',
  SCALED_ANNOTATION = 'scaledAnnotation',
}
export enum Justify {
  DEFAULT = 'default',
  FLEX_END = 'flex-end',
  CENTER = 'center',
}
export interface TextProps {
  type: TextType
  children?: ReactNode
  customJustify?: Justify
}
