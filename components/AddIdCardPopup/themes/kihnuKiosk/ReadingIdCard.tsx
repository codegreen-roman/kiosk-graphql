import React, { FC } from 'react'
import { ContentWrapper, DialogWrapper, GifWrapper, HeaderTitle, StatusMessage } from './AddIdCardPopupStyles'
import { useTranslation } from 'react-i18next'
import { Box } from '@material-ui/core'
import { SubscriptionPopupStatus } from '@interfaces/popupStatus'
import { CompanyOutlinedInput as IdOutlinedInput } from '@components/AddVehiclePopupUpd/themes/kihnuKiosk/AutoFilledOptionsStyles'
import { variableToString } from '@utils/formatters'

export interface ReadingIdCardProps {
  status: SubscriptionPopupStatus
  manualId?: string
  getValue?: (inputName: string) => string
}

const ReadingIdCard: FC<ReadingIdCardProps> = ({ status, manualId, getValue }) => {
  const { t } = useTranslation()
  return (
    <DialogWrapper hasNumPad={status === SubscriptionPopupStatus.ERROR}>
      <ContentWrapper>
        <HeaderTitle>
          <p display-if={status === SubscriptionPopupStatus.READING}>{t('Read id card')}</p>
          <p display-if={status === SubscriptionPopupStatus.SUCCESS}>{t('Read successful id card')}</p>
          <p display-if={status === SubscriptionPopupStatus.ERROR}>{t('Went wrong id')}</p>
        </HeaderTitle>
        <Box
          display-if={status === SubscriptionPopupStatus.ERROR}
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={'100%'}
          width={'100%'}
        >
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" width={'100%'} mb={2}>
            <Box display="flex" width="50%">
              <IdOutlinedInput placeholder={''} value={getValue(variableToString({ manualId }))} />
            </Box>
          </Box>
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

export default ReadingIdCard
