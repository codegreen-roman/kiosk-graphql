import React, { FC, useContext, useEffect, useState } from 'react'
import { Dialog } from '@material-ui/core'
import { AddIdCardPaymentPopupProps } from '@components/AddIdCardPaymentPopup'
import { Icon } from '@components/Icon'
import WaitingIdCardPayment from './WaitingIdCardPayment'
import ReadingIdCardPayment from './ReadingIdCardPayment'
import AddedIdCardPayment from './AddedIdCardPayment'
import { CloseDialog, CloseIconHolder } from './AddIdCardPaymentPopupStyles'
import { useIdPayment } from './useIdPayment'
import { useSubscription } from 'urql'
import subscribePaymentTerminal from '@gql/subscription/subscribePaymentTerminal.graphql'
import { makeId } from '@utils/helpers'
import { debugFlag } from '@const/idCardPaymentDebugFlags'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useStyles } from '@components/AddPaymentCardPopup/themes/kihnuKiosk/AddPaymentCardPopupStyles'
import ID_PAYMENT_STATUS from '@const/idPaymentStatuses'
import PAYMENT_STATUS from '@const/paymentStatuses'
import { CreditCompanyMember } from '@interfaces/boraCore'
import { AppStateTypes, useAppState } from '../../../../hooks/useAppState'
import { SubscriptionPopupStatus } from '@interfaces/popupStatus'
import { TimerContext } from '@components/Layout/themes/kihnuKiosk/Layout'
import { usePreviousType } from '../../../../hooks/usePrevious'

const debugMode = false
const AddIdCardPopup: FC<AddIdCardPaymentPopupProps> = ({
  open,
  handleOnClose,
  dataForMutation,
  payWithCard,
  vesselName,
  cancelInvalidReservation,
}) => {
  const [isTimeUp, setTimeIsUp] = useContext(TimerContext)
  const [phase, setPhase] = useState('')
  const prevPhase = usePreviousType(phase)
  const [isShadowed, setIsShadowed] = useState(false)
  const [paymentAfterCompanySelected, setPaymentAfterCompanySelected] = useState(false)
  const [approvedCompanies, setApprovedCompanies] = useState<CreditCompanyMember[]>([])
  const [operationId, setOperationId] = useState('')
  const classes = useStyles()
  const { port, reservationId } = dataForMutation
  const { dispatch } = useAppState()
  const { requestIdCardPayment, compareStatusToRenderPopup } = useIdPayment(cancelInvalidReservation)
  const [pauseSubscription, setPausedSubscription] = useState(true)
  const [result] = useSubscription({
    query: subscribePaymentTerminal,
    variables: {
      port: port,
      operationId: operationId,
    },
    pause: pauseSubscription,
  })
  const setShadowedBeforeRedirect = (): void => {
    setIsShadowed(true)
  }

  const handleNewPaymentAttempt = async (status: string, selectedCompany?: CreditCompanyMember): Promise<void> => {
    if (status === SubscriptionPopupStatus.DENIED) {
      handleOnClose()
      setPausedSubscription(true)
      payWithCard()
    } else if (status === SubscriptionPopupStatus.ADDED && selectedCompany) {
      const { personalIdentificationNumber } = selectedCompany
      const { id } = selectedCompany.creditCompany
      try {
        await requestIdCardPayment(
          operationId,
          reservationId,
          port,
          debugMode ? debugFlag : null,
          id,
          personalIdentificationNumber
        )
        setApprovedCompanies([])
        setPaymentAfterCompanySelected(true)
      } catch (e) {
        setPhase(ID_PAYMENT_STATUS.FAILED)
      }
    }
  }
  useEffect(() => {
    let timer = null
    if (open) {
      setOperationId(makeId(10))
      setPhase(ID_PAYMENT_STATUS.INITIAL)
      timer = setTimeout(() => {
        setPausedSubscription(false)
      }, 500)
      dispatch({ type: AppStateTypes.setOpenedPaymentPopup, payload: true })
    }
    return (): void => clearTimeout(timer)
  }, [open])

  useEffect(() => {
    let timer = null
    if (operationId && open) {
      setPaymentAfterCompanySelected(false)
      timer = setTimeout(async () => {
        try {
          await requestIdCardPayment(operationId, reservationId, port, debugMode ? debugFlag : null)
        } catch (e) {
          setPhase(ID_PAYMENT_STATUS.FAILED)
        }
      }, 1000)
    }
    return (): void => clearTimeout(timer)
  }, [operationId, open])

  useEffect(() => {
    if (
      approvedCompanies &&
      approvedCompanies.length > 0 &&
      approvedCompanies.every((item) => item === null || typeof item === 'undefined')
    ) {
      setPhase(ID_PAYMENT_STATUS.NO_COMPANIES)
    }
  }, [approvedCompanies])

  const shouldCompareStatuses =
    result.data && result.data.paymentTerminalOperationProgress && result.data.paymentTerminalOperationProgress.status
  const shouldCompareIds =
    shouldCompareStatuses &&
    (operationId !== result.data.paymentTerminalOperationProgress.operationId || paymentAfterCompanySelected)

  useEffect(() => {
    if (open && operationId) {
      compareStatusToRenderPopup(
        result,
        shouldCompareStatuses,
        setPhase,
        setApprovedCompanies,
        paymentAfterCompanySelected
      )
    }
  }, [open, shouldCompareStatuses, shouldCompareIds, operationId])

  useEffect(() => {
    let timer = null
    if (isTimeUp.some((it) => it.isTimeUpFlag) && prevPhase === phase && phase !== ID_PAYMENT_STATUS.FAILED) {
      setPhase(ID_PAYMENT_STATUS.FAILED)
      setTimeIsUp([{ isTimeUpFlag: false, direction: undefined }])
    }
    if (phase === ID_PAYMENT_STATUS.READ_OK && isTimeUp.every((it) => !it.isTimeUpFlag)) {
      timer = setTimeout(() => {
        setPhase(ID_PAYMENT_STATUS.FAILED)
      }, Number(process.env.NEXT_PUBLIC_CARD_READING_TIMEOUT))
    }
    return (): void => clearTimeout(timer)
  }, [isTimeUp, phase, prevPhase, shouldCompareStatuses])

  if (isShadowed) {
    return (
      <Backdrop className={classes.backdrop} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }
  return (
    <Dialog
      open={open}
      onClose={(): void => {
        handleOnClose()
        setPausedSubscription(true)
      }}
      disableBackdropClick={true}
      maxWidth="lg"
      PaperProps={{
        style: {
          overflow: 'unset',
        },
      }}
    >
      <CloseDialog
        display-if={
          phase !== ID_PAYMENT_STATUS.SINGLE_COMPANY &&
          phase !== ID_PAYMENT_STATUS.LOADING_AFTER_COMPANY_SELECTED &&
          phase !== ID_PAYMENT_STATUS.INITIAL &&
          phase !== ID_PAYMENT_STATUS.READ_OK &&
          phase !== ID_PAYMENT_STATUS.STARTED
        }
        onClick={(): void => {
          handleOnClose()
          setPausedSubscription(true)
        }}
      >
        <CloseIconHolder as={Icon['close']} />
      </CloseDialog>
      <WaitingIdCardPayment display-if={phase === ID_PAYMENT_STATUS.INITIAL || phase === ID_PAYMENT_STATUS.STARTED} />
      <ReadingIdCardPayment
        display-if={phase === ID_PAYMENT_STATUS.SEARCH_STARTED}
        status={SubscriptionPopupStatus.READING}
      />
      <ReadingIdCardPayment display-if={phase === ID_PAYMENT_STATUS.READ_OK} status={SubscriptionPopupStatus.SUCCESS} />
      <ReadingIdCardPayment
        display-if={
          phase === ID_PAYMENT_STATUS.CONNECT_FAILED ||
          phase === ID_PAYMENT_STATUS.FAILED ||
          phase === ID_PAYMENT_STATUS.PAYMENT_TERMINAL_CONNECT_FAILED ||
          phase === ID_PAYMENT_STATUS.FAILED_TIMEOUT ||
          phase === ID_PAYMENT_STATUS.FAILED_ID
        }
        status={SubscriptionPopupStatus.ERROR}
      />
      <Backdrop
        className={classes.backdrop}
        open={true}
        display-if={
          phase === ID_PAYMENT_STATUS.SINGLE_COMPANY || phase === ID_PAYMENT_STATUS.LOADING_AFTER_COMPANY_SELECTED
        }
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <AddedIdCardPayment
        display-if={
          phase === ID_PAYMENT_STATUS.SUCCESS ||
          phase === ID_PAYMENT_STATUS.MULTIPLE_COMPANIES ||
          phase === PAYMENT_STATUS.PRINT_STARTED ||
          phase === PAYMENT_STATUS.PRINT_FAILED ||
          phase === PAYMENT_STATUS.PRINT_OK
        }
        dataContract={approvedCompanies}
        phase={phase}
        status={SubscriptionPopupStatus.ADDED}
        handleOnClose={(): void => {
          handleOnClose()
          setPausedSubscription(true)
        }}
        attemptAction={handleNewPaymentAttempt}
        callbackBeforeRedirect={setShadowedBeforeRedirect}
        vesselName={vesselName}
        reservationId={reservationId}
      />
      <AddedIdCardPayment
        display-if={
          phase === ID_PAYMENT_STATUS.LOW_FUNDS ||
          phase === ID_PAYMENT_STATUS.NO_COMPANIES ||
          phase === ID_PAYMENT_STATUS.FAILED_NOT_ALLOWED
        }
        phase={phase}
        status={SubscriptionPopupStatus.DENIED}
        handleOnClose={(): void => {
          handleOnClose()
          setPausedSubscription(true)
        }}
        attemptAction={handleNewPaymentAttempt}
        vesselName={vesselName}
      />
    </Dialog>
  )
}

export default AddIdCardPopup
