import styled from 'styled-components'
import { themeSettings } from '@themeSettings'
import { getFonts } from '@themeSettings'

const { dialog, pageHeading, buttons } = themeSettings.colors

const { primary, secondary } = getFonts()

// StepTitle styles

export const StepTitleLeftWrapper = styled.div`
  display: flex;
  flex-basis: 70%;
  justify-content: space-between;
  align-items: center;
  background-color: ${dialog.headerBackground};
  padding: 10px 0;
  min-height: 70px;
  padding: 15px 25px;
`

export const StepTitleRightWrapper = styled.div`
  display: flex;
  flex-basis: 30.2%;
  align-items: center;
  background-color: ${pageHeading.extraBackground};
  padding: 10px 0;
  min-height: 70px;
  padding-left: 45px;
  padding-right: 91px;
`

export const TitleHeading = styled.p`
  font-family: ${secondary};
  font-size: 30px;
  font-weight: 500;
  letter-spacing: 0.75px;
  text-transform: uppercase;
  color: ${dialog.mainText};
  text-align: left;
`

export const TitlePrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  p {
    font-family: ${primary};
    font-size: 14px;
    font-weight: 400;
    color: ${buttons.textButton.defaultText};
    max-width: 110px;
  }
  span {
    font-family: ${secondary};
    font-size: 35px;
    font-weight: 700;
    color: ${dialog.mainText};
  }
`

export const TitleVehicleNumber = styled.div`
  display: flex;
  jusfity-content: center;
  align-items: center;
  background: #ffffff;
  border: 3px solid #333333;
  border-radius: 5px;
  height: 44px;
  padding: 0 10px;
  p {
    font-family: ${secondary};
    font-size: 27px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #333333;
  }
`
