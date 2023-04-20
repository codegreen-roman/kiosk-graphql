import React, { FC } from 'react'
import { DialogWrapper, GifWrapper, ContentWrapper, StatusMessage, HeaderTitle } from './AddIdCardPaymentPopupStyles'
import { useTranslation } from 'react-i18next'
import { Box } from '@material-ui/core'
import { SubscriptionPopupStatus } from '@interfaces/popupStatus'

export interface ReadingIdCardProps {
  status: SubscriptionPopupStatus
}

const ReadingIdCardPayment: FC<ReadingIdCardProps> = ({ status }) => {
  const { t } = useTranslation()
  return (
    <DialogWrapper>
      <ContentWrapper>
        <HeaderTitle>
          <p display-if={status === SubscriptionPopupStatus.READING}>{t('Read id card')}</p>
          <p display-if={status === SubscriptionPopupStatus.SUCCESS}>{t('Read successful id card')}</p>
          <p display-if={status === SubscriptionPopupStatus.ERROR}>{t('Went wrong')}</p>
        </HeaderTitle>
        <Box
          display-if={status === SubscriptionPopupStatus.ERROR}
          display="flex"
          height="100%"
          justifyContent="center"
          alignItems="center"
          pb={'50px'}
        >
          <img width="160" height="160" src="/themes/kihnuKiosk/images/boy.svg" alt="ID-card" />
        </Box>
      </ContentWrapper>
      <GifWrapper>
        <StatusMessage type={status}>
          <p display-if={status === SubscriptionPopupStatus.READING}>{t('Reading')}</p>
          <p display-if={status === SubscriptionPopupStatus.SUCCESS}>{t('Success')}</p>
          <p display-if={status === SubscriptionPopupStatus.ERROR}>{t('Error')}</p>
        </StatusMessage>
        <img src="/themes/kihnuKiosk/images/cards/ID_card_insert_static.gif" alt="ID-card" />
      </GifWrapper>
    </DialogWrapper>
  )
}

export default ReadingIdCardPayment
