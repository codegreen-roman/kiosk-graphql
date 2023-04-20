import styled from 'styled-components'
import { themeSettings, getFonts } from '@themeSettings'

const { dialog, footNotes, header } = themeSettings.colors
const { primary, secondary } = getFonts()

export const DialogWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  width: 702px;
  min-height: 326px;
  border-radius: 2px;
  overflow: hidden;
  background-color: ${dialog.sectionBackgroundSelected};
`

export const CloseIconHolder = styled.div`
  display: flex;
  justify-content: center;
`

export const WarningIconHolder = styled.div`
  display: block;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 25px;
`

export const CancelButtonIconHolder = styled.div`
  position: relative;
`

export const CloseDialog = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -20px;
  right: -20px;
  width: 46px;
  height: 46px;
  background-color: ${footNotes.warning};
  border-radius: 50%;
  z-index: 10;
`

export const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 76px;
  position: relative;
  background-color: ${dialog.errorBorder};
  color: ${header.content};
  font-family: ${secondary};
  font-size: 30px;
  text-transform: uppercase;
  letter-spacing: 0.95px;
  padding: 15px 0;
`

export const Message = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  p {
    font-family: ${primary};
    font-size: 16px;
    text-align: center;
    padding-bottom: 15px;
    &:last-child {
      padding-bottom: 0;
    }
  }
`
