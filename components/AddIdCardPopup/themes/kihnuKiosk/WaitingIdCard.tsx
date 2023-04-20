import React, { FC } from 'react'
import { Box } from '@material-ui/core'
import {
  DialogWrapper,
  GifWrapper,
  ContentWrapper,
  StatusMessage,
  HeaderTitle,
  TimerMessage,
} from './AddIdCardPopupStyles'
import { useTranslation } from 'react-i18next'
import { Timer } from '@components/Timer'
import { themeSettings } from '@themeSettings'
import { SubscriptionPopupStatus } from '@interfaces/popupStatus'

const { text } = themeSettings.colors
const WaitingIdCard: FC = () => {
  const { t } = useTranslation()
  return (
    <DialogWrapper>
      <ContentWrapper>
        <HeaderTitle>
          <p>{t('Please enter ID')}</p>
        </HeaderTitle>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
          <img width="322" height="348" src={'/themes/kihnuKiosk/images/kiosk-and-zone.png'} alt="kiosk" />
          <TimerMessage>
            <p>{t('Popup will close in')}</p>
            <Timer
              isTitleNeeded={false}
              date={Date.now() + Number(process.env.NEXT_PUBLIC_CARD_READING_TIMEOUT)}
              color={text.default}
              onlySeconds={true}
              isUpcoming={true}
            />
            <p>{t('Seconds')}</p>
          </TimerMessage>
        </Box>
      </ContentWrapper>
      <GifWrapper>
        <StatusMessage type={SubscriptionPopupStatus.WAITING}>
          <p>{t('Waiting in reader')}</p>
        </StatusMessage>
        <img src="/themes/kihnuKiosk/images/cards/ID_card_insert.gif" alt="ID-card" />
      </GifWrapper>
    </DialogWrapper>
  )
}

export default WaitingIdCard
