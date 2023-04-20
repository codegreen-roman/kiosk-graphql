import React, { FC } from 'react'
import { Box, CircularProgress } from '@material-ui/core'
import { DialogWrapper, GifWrapper, ContentWrapper, HeaderTitle, TextWrapper, IdNumber } from './AddIdCardPopupStyles'
import { DefaultButton } from '@styles/buttonStyles'
import { useTranslation } from 'react-i18next'
import ID_STATUS from '@const/idCardStatuses'
import { SubscriptionPopupStatus } from '@interfaces/popupStatus'

export interface AddedIdCardProps {
  status: SubscriptionPopupStatus
  handleOnClose: () => void
  data?: string[]
  phase?: string
  mutationLoading: boolean
}

const AddedIdCard: FC<AddedIdCardProps> = ({ status, handleOnClose, data, phase, mutationLoading }) => {
  const { t } = useTranslation()
  return (
    <DialogWrapper>
      <ContentWrapper>
        <HeaderTitle type={status}>
          <p display-if={status === SubscriptionPopupStatus.ADDED}>{t('Complete remove or add id')}</p>
          <p display-if={status === SubscriptionPopupStatus.DENIED}>
            {phase === ID_STATUS.USED_ON_SAIL || phase === ID_STATUS.DISCOUNT_ALREADY_USED_ON_SAIL
              ? t('Discount already used')
              : t('No discounts for id')}
          </p>
        </HeaderTitle>
        <Box
          display-if={status === SubscriptionPopupStatus.ADDED}
          display="flex"
          flexDirection="column"
          height="100%"
          alignItems="center"
        >
          <TextWrapper>{t('Following ids')}</TextWrapper>
          <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="center">
            {data &&
              data.map((number, idx) => {
                return (
                  <IdNumber key={idx} isOverview={true}>
                    {number}
                  </IdNumber>
                )
              })}
          </Box>
          <TextWrapper>{t('Insert another id or press done')}</TextWrapper>
        </Box>

        <Box
          display-if={status === SubscriptionPopupStatus.DENIED}
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <img width="160" height="160" src="/themes/kihnuKiosk/images/boy.svg" alt="ID-card" />

          <TextWrapper>{t('Try another id or press done')}</TextWrapper>
        </Box>
        <Box width="100%" padding="11px">
          <DefaultButton display-if={status === SubscriptionPopupStatus.ADDED} onClick={handleOnClose}>
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              {t('Done / added', { idQty: data.length })}
              {mutationLoading && (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%" px={1.5}>
                  <CircularProgress color={'secondary'} />
                </Box>
              )}
            </Box>
          </DefaultButton>

          <DefaultButton display-if={status === SubscriptionPopupStatus.DENIED} onClick={handleOnClose}>
            {t('Done / added', { idQty: 0 })}
          </DefaultButton>
        </Box>
      </ContentWrapper>
      <GifWrapper>
        <img src="/themes/kihnuKiosk/images/cards/ID_card_eject.gif" alt="ID-card" />
      </GifWrapper>
    </DialogWrapper>
  )
}

export default AddedIdCard
