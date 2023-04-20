import styled from 'styled-components'
import { getFonts, getContentBlockColors } from '@themeSettings'

const contentBlockColors = getContentBlockColors()
const { secondary } = getFonts()

export const ImageWrapper = styled.div<{ image: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-image: ${(props): string => {
    return `url('/themes/kihnuKiosk/images/${props.image}.png');`
  }};
  background-repeat: no-repeat;
  background-size: cover;
`

export const RouteMap = styled.div<{ image: string }>`
  display: flex;
  width: 450px;
  height: 450px;
  background-image: ${(props): string => {
    return `url('/themes/kihnuKiosk/images/${props.image}.png');`
  }};
`

export const RouteTitle = styled.div`
  font-family: ${secondary};
  font-size: 67px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 4.25px;
  padding-bottom: 25px;
  color: ${contentBlockColors.lightText};
`
