import styled from 'styled-components'
import { themeSettings } from '@themeSettings'
import { getFonts } from '@themeSettings'

const { contentBlock } = themeSettings.colors

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

export const ContentSection = styled.div`
  width: 1020px;
  height: 100%;
`

export const Heading = styled.h1<{ textColor: string }>`
  height: 100%;
  font-family: ${secondary};
  font-weight: bold;
  font-size: 86px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${(props): string => {
    return contentBlock[props.textColor]
  }};
  text-align: center;
  padding-bottom: 35px;
`

export const Paragraph = styled.p<{ textColor: string }>`
  height: 100%;
  font-family: ${secondary};
  font-weight: normal;
  font-size: 35px;
  line-height: 45px;
  color: ${(props): string => {
    return contentBlock[props.textColor]
  }};
  padding: 0 45px;
`
