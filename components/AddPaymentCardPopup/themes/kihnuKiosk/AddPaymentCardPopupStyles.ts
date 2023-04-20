import styled from 'styled-components'
import { getContentBlockColors, getTextColors, themeSettings } from '@themeSettings'
import { getFonts } from '@themeSettings'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { SubscriptionPopupStatus } from '@interfaces/popupStatus'

const { dialog } = themeSettings.colors
const contentBlockColors = getContentBlockColors()
const { primary, secondary } = getFonts()

const textColors = getTextColors()

export const DialogWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 855px;
  min-height: 579px;
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

export const IdNumber = styled.div<{ isSelected?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 197px;
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
  width: 100%;
  overflow: hidden;
  justify-content: space-between;
`

export const HeaderTitle = styled.div<{ type?: SubscriptionPopupStatus }>`
  display: flex;
  justify-content: center;
  background-color: ${(props): string =>
    props.type === SubscriptionPopupStatus.DENIED ? 'unset' : dialog.headerBackground};
  padding: 30px 0;
  p {
    max-width: 409px;
    font-family: ${secondary};
    font-size: 30px;
    font-weight: 500;
    letter-spacing: 0.75px;
    text-transform: uppercase;
    color: ${(props): string =>
      props.type === SubscriptionPopupStatus.DENIED ? dialog.statusColorError : dialog.mainText};
    text-align: center;
  }
`

export const TextWrapper = styled.p<{ type?: string }>`
  max-width: 449px;
  font-family: ${primary};
  font-size: 22px;
  font-weight: 400;
  text-align: center;
  padding: 26px 0;
  text-transform: uppercase;
`

export const StatusMessage = styled.div<{ type?: SubscriptionPopupStatus }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  text-align: center;
  top: 10px;
  right: 10px;
  width: 312px;
  height: 70px;
  background-color: ${(props): string =>
    props.type === SubscriptionPopupStatus.WAITING
      ? dialog.statusBackground
      : props.type === SubscriptionPopupStatus.READING
      ? dialog.readingBackground
      : props.type === SubscriptionPopupStatus.SUCCESS
      ? dialog.successBackground
      : props.type === SubscriptionPopupStatus.ERROR
      ? dialog.errorBackground
      : dialog.statusBackground};
  border: 1px solid
    ${(props): string =>
      props.type === SubscriptionPopupStatus.WAITING
        ? dialog.statusBorderDefault
        : props.type === SubscriptionPopupStatus.READING
        ? dialog.readingBorder
        : props.type === SubscriptionPopupStatus.SUCCESS
        ? dialog.successBorder
        : props.type === SubscriptionPopupStatus.ERROR
        ? dialog.errorBorder
        : dialog.statusBorderDefault};
  p {
    font-family: ${primary};
    font-size: 22px;
    font-weight: 400;
  }
`

export const TimerMessage = styled.div`
  position: absolute;
  bottom: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 469px;
  height: 60px;
  background-color: ${dialog.statusBackground};
  border: 1px solid ${dialog.statusBorderDefault};
  p {
    font-family: ${primary};
    font-size: 19px;
    font-weight: 400;
    padding: 0 3px 0 3px;
  }
`

export const GifWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${dialog.sectionBackgroundDefault};
  padding: 0 44px;
  border-left: 2px solid ${dialog.sectionBorder};
  img {
    width: 243px;
    height: 579px;
  }
`

export const ErrorText = styled.span`
  font-family: ${secondary};
  font-size: 30px;
  font-weight: 500;
  letter-spacing: 0.75px;
  text-transform: uppercase;
  color: ${dialog.statusColorError};
  text-align: center;
`
export const CompanyBox = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${contentBlockColors.border};
  background-color: ${contentBlockColors.disabledBackground};
  cursor: pointer;
  p {
    font-family: ${primary};
    color: ${textColors.heading};
    font-size: 22px;
    font-weight: 400;
  }
`

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: contentBlockColors.whiteText,
    },
  })
)
