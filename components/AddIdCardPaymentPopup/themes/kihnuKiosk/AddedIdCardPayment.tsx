import React, { FC, useEffect, useState } from 'react'
import { Box } from '@material-ui/core'
import { Icon } from '@components/Icon'
import {
  DialogWrapper,
  GifWrapper,
  ContentWrapper,
  HeaderTitle,
  TextWrapper,
  ErrorText,
  CloseIconHolder,
  CompanyBox,
} from './AddIdCardPaymentPopupStyles'
import { ContinueButton } from '@styles/buttonStyles'
import PaymentActionPanel from '@components/ActionPanel/themes/kihnuKiosk/PaymentActionPanel'
import { useTranslation } from 'react-i18next'
import PAYMENT_STATUS from '@const/paymentStatuses'
import { useRouter } from 'next/router'
import ID_PAYMENT_STATUS from '@const/idPaymentStatuses'
import { CreditCompanyMember } from '@interfaces/boraCore'
import { SubscriptionPopupStatus } from '@interfaces/popupStatus'

export interface AddedIdCardProps {
  status: SubscriptionPopupStatus
  handleOnClose: () => void
  phase: string
  vesselName: string
  data?: string[]
  dataContract?: CreditCompanyMember[]
  callbackBeforeRedirect?: () => void
  attemptAction?: (status: string, selectedCompany?: CreditCompanyMember) => void
  reservationId?: number
}
interface SuccessfulContractSearchProps {
  data: {
    id: string
    name: string
  }[]
  callBack(id: string): void
}
const SuccessfulContractSearch: FC<SuccessfulContractSearchProps> = ({ data, callBack }) => {
  const [selected, setSelected] = useState(null)
  const { t } = useTranslation()
  const handleContractChoice = (id: string): void => {
    setSelected(id)
    callBack(id)
  }
  if (data.length <= 1) {
    return (
      <Box display="flex" flexDirection="column" height="100%" alignItems="center" justifyContent="center">
        <TextWrapper>{t('Thank you')}</TextWrapper>
        <img src="/themes/kihnuKiosk/images/thumb-up.png" alt="id-successfull-contarct-id-card" />
        <TextWrapper>{t('This window will automatically close')}</TextWrapper>
      </Box>
    )
  }
  return (
    <Box display="flex" flexDirection="column" height="100%" alignItems="center" justifyContent="center">
      <img src="/themes/kihnuKiosk/images/busy-man.png" alt="id-successfull-contarct-id-card" />
      <TextWrapper>{t('Multiple companies')}</TextWrapper>
      <Box display="flex" flexDirection="column" flexWrap="wrap" justifyContent="center">
        {data.map((item) => {
          return (
            <CompanyBox
              key={item.id}
              onClick={(): void => {
                handleContractChoice(item.id)
              }}
              isSelected={item.id === selected}
            >
              <p>{item.name}</p>
            </CompanyBox>
          )
        })}
      </Box>
    </Box>
  )
}

const AddedIdCardPayment: FC<AddedIdCardProps> = ({
  status,
  handleOnClose,
  phase,
  callbackBeforeRedirect,
  dataContract,
  attemptAction,
  vesselName,
  reservationId,
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [isDoneButtonEnabled, setDoneButtonEnabled] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [companiesList, setCompaniesList] = useState([])
  const enableDoneButtonAfterContractChose = (id: string): void => {
    setDoneButtonEnabled(true)
    setSelectedCompany(dataContract.find((item) => item.creditCompany.id === id))
  }

  useEffect(() => {
    if (dataContract && dataContract.length > 0) {
      const newArray = dataContract
        .filter((item) => !!item)
        .map((item) => ({
          id: item.creditCompany.id,
          name: item.creditCompany.name,
        }))
      setCompaniesList(newArray)
    } else {
      setCompaniesList([])
    }
  }, [dataContract])

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

  const paymentActions = {
    contractHref: '',
    contractText: '',
    cardHref: '',
  }

  return (
    <DialogWrapper>
      <ContentWrapper>
        <HeaderTitle type={SubscriptionPopupStatus.ADDED}>
          <p display-if={status === SubscriptionPopupStatus.ADDED}>
            {phase === ID_PAYMENT_STATUS.MULTIPLE_COMPANIES ? t('Busy man') : t('Payment succeeded')}
          </p>
          <ErrorText display-if={status === SubscriptionPopupStatus.DENIED}>
            {phase === ID_PAYMENT_STATUS.LOW_FUNDS ? t('Low funds') : t('No id in list')}
          </ErrorText>
        </HeaderTitle>
        <SuccessfulContractSearch
          display-if={status === SubscriptionPopupStatus.ADDED}
          callBack={enableDoneButtonAfterContractChose}
          data={companiesList}
        />
        <Box
          display-if={status === SubscriptionPopupStatus.DENIED}
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <img width="160" height="160" src="/themes/kihnuKiosk/images/boy.svg" alt="ID-card" />
          <TextWrapper>
            {phase === ID_PAYMENT_STATUS.LOW_FUNDS || phase === ID_PAYMENT_STATUS.FAILED_NOT_ALLOWED
              ? t('Close and try or')
              : t('Another id card')}
          </TextWrapper>
        </Box>
        <Box width="100%" padding="11px">
          {companiesList.length > 1 && status === SubscriptionPopupStatus.ADDED && (
            <ContinueButton
              isSelected={isDoneButtonEnabled}
              onClick={(): void => attemptAction(status, selectedCompany)}
            >
              <Box display={'flex'} justifyContent={'space-around'} width={'100%'} px={21}>
                <p>{t('Done')}</p>
                <CloseIconHolder as={Icon['tick']} />
              </Box>
            </ContinueButton>
          )}
          <PaymentActionPanel
            display-if={status === SubscriptionPopupStatus.DENIED}
            {...paymentActions}
            handleCardButton={(): void => {
              attemptAction(status)
            }}
            cardText={t('Pay with payment card instead', {
              tagUppercaseStart: '<span class="uppercase-text">',
              tagEnd: '</span>',
            })}
            isEnabled={true}
          />
        </Box>
      </ContentWrapper>
      <GifWrapper>
        <img src="/themes/kihnuKiosk/images/cards/ID_card_eject.gif" alt="ID-card" />
      </GifWrapper>
    </DialogWrapper>
  )
}

export default AddedIdCardPayment
