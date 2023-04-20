import React, { FC, useEffect } from 'react'
import { Box } from '@material-ui/core'
import {
  DialogWrapper,
  GifWrapper,
  ContentWrapper,
  HeaderTitle,
  TextWrapper,
  ErrorText,
} from './AddPaymentCardPopupStyles'
import PaymentActionPanel from '@components/ActionPanel/themes/kihnuKiosk/PaymentActionPanel'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import PAYMENT_STATUS from '@const/paymentStatuses'
import { SubscriptionPopupStatus } from '@interfaces/popupStatus'

export interface AddedIdCardProps {
  status: SubscriptionPopupStatus
  handleOnClose: () => void
  phase: string
  vesselName: string
  attemptAction?: (string) => void
  callbackBeforeRedirect?: () => void
  reservationId?: number
}

const SuccessfulContractSearch: FC = () => {
  const { t } = useTranslation()
  return (
    <Box display="flex" flexDirection="column" height="100%" alignItems="center" justifyContent="center">
      <TextWrapper>{t('Thank you')}</TextWrapper>
      <img src="/themes/kihnuKiosk/images/thumb-up.png" alt="id-successfull-contarct-id-card" />
      <TextWrapper>{t('This window will automatically close')}</TextWrapper>
    </Box>
  )
}
const AddedPaymentCard: FC<AddedIdCardProps> = ({
  status,
  handleOnClose,
  phase,
  attemptAction,
  callbackBeforeRedirect,
  vesselName,
  reservationId,
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const paymentActions = {
    contractHref: '',
    contractText: '',
    cardHref: '',
  }

  useEffect(() => {
    let timer = null
    if (
      status === SubscriptionPopupStatus.ADDED &&
      (phase === PAYMENT_STATUS.PRINT_STARTED ||
        phase === PAYMENT_STATUS.PRINT_FAILED ||
        phase === PAYMENT_STATUS.PRINT_OK)
    ) {
      timer = setTimeout(() => {
        handleOnClose()
        callbackBeforeRedirect()
        router.push(`/confirmation/${vesselName}-${reservationId}`)
      }, 2000)
    }
    return (): void => clearTimeout(timer)
  }, [phase])
  return (
    <DialogWrapper>
      <ContentWrapper>
        <HeaderTitle type={SubscriptionPopupStatus.ADDED}>
          <p display-if={status === SubscriptionPopupStatus.ADDED}>{t('Payment succeeded')}</p>
          <ErrorText display-if={status === SubscriptionPopupStatus.DENIED}>
            {t('Your Payment card does not work')}
          </ErrorText>
        </HeaderTitle>
        <SuccessfulContractSearch display-if={status === SubscriptionPopupStatus.ADDED} />
        <Box
          display-if={status === SubscriptionPopupStatus.DENIED}
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <img width="160" height="160" src="/themes/kihnuKiosk/images/boy.svg" alt="ID-card" />
          <TextWrapper>{t('Try another payment card')}</TextWrapper>
        </Box>
        <Box width="100%" padding="11px">
          <PaymentActionPanel
            display-if={status === SubscriptionPopupStatus.DENIED}
            {...paymentActions}
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
        <img src="/themes/kihnuKiosk/images/cards/c_card_eject.gif" alt="ID-card" />
      </GifWrapper>
    </DialogWrapper>
  )
}

export default AddedPaymentCard
