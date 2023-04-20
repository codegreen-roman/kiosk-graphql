import styled from 'styled-components'
import { themeSettings } from '@themeSettings'
import { getFonts } from '@themeSettings'

const { dialog } = themeSettings.colors

const { primary, secondary } = getFonts()

export const DialogWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 1188px;
  height: 690px;
  border-radius: 2px;
  overflow: hidden;
  border: 1px solid ${dialog.sectionBorder};
`

export const CloseIconHolder = styled.div`
  display: flex;
  justify-content: center;
`

export const MinusIconHolder = styled.div`
  display: flex;
  justify-content: center;
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
  background-color: ${dialog.closeButton};
  border-radius: 50%;
  z-index: 10;
`

export const RemoveIdNumber = styled.div<{ isSelected?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 46px;
  height: 46px;
  background-color: ${(props): string => (props.isSelected ? dialog.removeButtonActive : dialog.removeButtonDefault)};
  border-radius: 50%;
  z-index: 10;
`

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  overflow: hidden;
  padding: 30px 10px 17px;
  background: url('/themes/kihnuKiosk/images/id-logo.png') bottom left no-repeat;
`

export const Title = styled.div`
  font-family: ${secondary};
  font-size: 30px;
  font-weight: 500;
  letter-spacing: 0.75px;
  text-transform: uppercase;
  color: ${dialog.mainText};
  padding-bottom: 11px;
`

export const Description = styled.div`
  max-width: 449px;
  font-family: ${primary};
  font-size: 22px;
  font-weight: 400;
  text-align: center;
  padding-bottom: 35px;
`

export const IdNumber = styled.div<{ isSelected?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 200px;
  height: 70px;
  background-color: ${(props): string =>
    props.isSelected ? dialog.sectionBackgroundSelected : dialog.statusBackgroundDefault};
  border: 1px solid ${(props): string => (props.isSelected ? dialog.statusBorderSelected : dialog.statusBorderDefault)};
  border-radius: 2px;
  font-family: ${secondary};
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 12px 8px;
  margin: 5px;
  color: ${dialog.mainText};
  span {
    margin-right: 12px;
  }
`

export const ConfimIdDeletion = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${primary};
  font-size: 22px;
  font-weight: 400;
  text-align: center;
  span {
    font-weight: 700;
    padding-top: 5px;
  }
`

export const StatusMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 10px;
  width: 312px;
  height: 70px;
  background-color: ${dialog.statusBackground};
  border: 1px solid ${dialog.statusBorderDefault};
  p {
    font-family: ${primary};
    font-size: 22px;
    font-weight: 400;
  }
`

export const GifWrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${dialog.sectionBackgroundDefault};
  padding: 0 20px;
  border-left: 2px solid ${dialog.sectionBorder};
  img {
    width: 291px;
    height: 691px;
  }
`
