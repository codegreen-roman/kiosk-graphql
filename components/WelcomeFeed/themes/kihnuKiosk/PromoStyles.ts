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
  background-image: ${({ image }): string => {
    return `url('/themes/kihnuKiosk/images/${image}.jpg');`
  }};
  background-repeat: no-repeat;
  background-size: cover;
  padding-left: initial;
`

export const ContentSection = styled.div`
  width: 975px;
  height: 100%;
  padding: 50px;
`

export const Heading = styled.h1<{ textColor: string }>`
  height: 100%;
  font-family: ${secondary};
  font-weight: bold;
  font-size: 120px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: ${(props): string => {
    return contentBlock[props.textColor]
  }};
  text-align: center;
`
