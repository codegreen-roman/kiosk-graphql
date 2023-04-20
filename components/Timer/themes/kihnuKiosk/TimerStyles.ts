import styled from 'styled-components'
import { getFonts } from '@themeSettings'
import { themeSettings } from '@themeSettings'

const { primary, secondary } = getFonts()
const { timer } = themeSettings.colors

export const Title = styled.div<{ color?: string }>`
  font-family: ${primary};
  font-weight: 900;
  font-size: 10px;
  color: ${(props): string => {
    return props.color ? timer[props.color] : timer.cerulean
  }};
  text-transform: uppercase;
  padding-left: 1px;
  padding-bottom: 3px;
`

export const Counter = styled.div<{ color?: string; onlySeconds?: boolean }>`
  font-family: ${secondary};
  font-weight: ${(props): string => {
    return props.onlySeconds ? '600' : '400'
  }};
  font-size: ${(props): string => {
    return props.onlySeconds ? '19px' : '28px'
  }};
  color: ${(props): string => {
    return props.color ? timer[props.color] : timer.cerulean
  }};
  text-transform: uppercase;
`
