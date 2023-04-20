import React, { FC } from 'react'
import { DialogWrapper, GifWrapper, ContentWrapper, StatusMessage, HeaderTitle } from './AddPaymentCardPopupStyles'
import { useTranslation } from 'react-i18next'
import PaymentActionPanel from '@components/ActionPanel/themes/kihnuKiosk/PaymentActionPanel'
import { Box } from '@material-ui/core'
import { SubscriptionPopupStatus } from '@interfaces/popupStatus'

export interface ReadingIdCardProps {
  status: SubscriptionPopupStatus
  attemptAction?: (string) => void
}

const ReadingPaymentCard: FC<ReadingIdCardProps> = ({ status, attemptAction }) => {
  const { t } = useTranslation()

  return (
    <DialogWrapper>
      <ContentWrapper>
        <HeaderTitle>
          <p display-if={status === SubscriptionPopupStatus.READING}>{t('Read payment card')}</p>
          <p display-if={status === SubscriptionPopupStatus.SUCCESS}>{t('Read successful payment card')}</p>
          <p display-if={status === SubscriptionPopupStatus.ERROR}>{t('Went wrong payment read')}</p>
        </HeaderTitle>
        <Box
          display-if={status === SubscriptionPopupStatus.ERROR}
          display="flex"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <img width="160" height="160" src="/themes/kihnuKiosk/images/boy.svg" alt="ID-card" />
        </Box>
        <Box width="100%" padding="11px">
          <PaymentActionPanel
            display-if={status === SubscriptionPopupStatus.ERROR}
            contractText={''}
            cardText={t('Pay with payment card', {
              tagUppercaseStart: '<span class="uppercase-text">',
              tagEnd: '</span>',
            })}
            isEnabled={true}
            handleCardButton={(): void => {
              attemptAction(status)
            }}
          />
        </Box>
      </ContentWrapper>
      <GifWrapper>
        <StatusMessage type={status}>
          <p display-if={status === SubscriptionPopupStatus.READING}>{t('Reading')}</p>
          <p display-if={status === SubscriptionPopupStatus.SUCCESS}>{t('Success')}</p>
          <p display-if={status === SubscriptionPopupStatus.ERROR}>{t('Error')}</p>
        </StatusMessage>
        <img src="/themes/kihnuKiosk/images/cards/c_card_insert_static.gif" alt="ID-card" />
      </GifWrapper>
    </DialogWrapper>
  )
}

export default ReadingPaymentCard
