import React, { FC, useContext, useEffect, useState } from 'react'
import { useSubscription } from 'urql'
import subscribePaymentTerminal from '@gql/subscription/subscribePaymentTerminal.graphql'
import { Dialog } from '@material-ui/core'
import { Icon } from '@components/Icon'
import WaitingPaymentCard from './WaitingPaymentCard'
import ReadingPaymentCard from './ReadingPaymentCard'
import AddedPaymentCard from './AddedPaymentCard'
import { CloseDialog, CloseIconHolder, useStyles } from './AddPaymentCardPopupStyles'
import { AddPaymentCardPopupProps } from '@components/AddPaymentCardPopup'
import PAYMENT_STATUS from '@const/paymentStatuses'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeId } from '@utils/helpers'
import { usePaymentCard } from '@components/AddPaymentCardPopup/themes/kihnuKiosk/usePaymentCard'
import { debugFlag, debugFlagNewAttempt } from '@const/paymentDebugFlags'
import { AppStateTypes, useAppState } from '../../../../hooks/useAppState'
import { SubscriptionPopupStatus } from '@interfaces/popupStatus'
import { usePreviousType } from '../../../../hooks/usePrevious'
import { TimerContext } from '@components/Layout/themes/kihnuKiosk/Layout'

const debugMode = false
const AddPaymentCardPopup: FC<AddPaymentCardPopupProps> = ({
  open,
  handleOnClose,
  dataForMutation,
  vesselName,
  cancelInvalidReservation,
}) => {
  const [isTimeUp, setTimeIsUp] = useContext(TimerContext)
  const [phase, setPhase] = useState('')
  const prevPhase = usePreviousType(phase)
  const [isShadowed, setIsShadowed] = useState(false)
  const [operationId, setOperationId] = useState('')
  const [newPaymentsAmount, setNewPaymentAttempt] = useState(0)
  const classes = useStyles()
  const { port, reservationId } = dataForMutation
  const { dispatch } = useAppState()
  const [pauseSubscription, setPausedSubscription] = useState(true)

  const { requestPaymentCard, compareStatusToRenderPopup } = usePaymentCard(cancelInvalidReservation, false)
  let [result] = useSubscription({
    query: subscribePaymentTerminal,
    variables: {
      port: port,
      operationId: operationId,
    },
    pause: pauseSubscription,
  })

  const shouldCompareStatuses =
    result.data && result.data.paymentTerminalOperationProgress && result.data.paymentTerminalOperationProgress.status
  const shouldCompareIds =
    shouldCompareStatuses && operationId !== result.data.paymentTerminalOperationProgress.operationId

  const handleNewPaymentAttempt = (status: string): void => {
    if (
      status === SubscriptionPopupStatus.ERROR ||
      status === SubscriptionPopupStatus.DENIED ||
      status === SubscriptionPopupStatus.READING
    ) {
      handleOnClose()
      result = null
      setPausedSubscription(true)
      setNewPaymentAttempt((prevState) => prevState + 1)
      setIsShadowed((prevState) => !prevState)
      setTimeout(() => {
        setIsShadowed((prevState) => !prevState)
        handleOnClose()
      }, 500)
    }
  }
  const setShadowedBeforeRedirect = (): void => {
    setIsShadowed(true)
  }

  useEffect(() => {
    let timer = null
    if (open) {
      setOperationId(makeId(10))
      setPhase(PAYMENT_STATUS.INITIAL)
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
      timer = setTimeout(async () => {
        try {
          await requestPaymentCard(
            operationId,
            reservationId,
            port,
            debugMode ? (newPaymentsAmount === 0 ? debugFlag : debugFlagNewAttempt) : null
          )
        } catch (e) {
          setPhase(PAYMENT_STATUS.FAILED)
        }
      }, 1000)
    }
    return (): void => clearTimeout(timer)
  }, [operationId, open, newPaymentsAmount, setPhase])

  useEffect(() => {
    if (open && operationId) {
      compareStatusToRenderPopup(result, shouldCompareStatuses, setPhase, newPaymentsAmount)
    }
  }, [open, shouldCompareStatuses, shouldCompareIds, newPaymentsAmount, operationId])

  useEffect(() => {
    let timer = null
    if (isTimeUp.some((it) => it.isTimeUpFlag) && prevPhase === phase && phase !== PAYMENT_STATUS.FAILED) {
      setPhase(PAYMENT_STATUS.FAILED)
      setTimeIsUp([{ isTimeUpFlag: false, direction: undefined }])
    }
    if (phase === PAYMENT_STATUS.READ_OK && isTimeUp.every((it) => !it.isTimeUpFlag)) {
      timer = setTimeout(() => {
        setPhase(PAYMENT_STATUS.FAILED)
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
          (phase === PAYMENT_STATUS.INITIAL && newPaymentsAmount > 0) ||
          phase === PAYMENT_STATUS.TRANSACTION_FAILED ||
          phase === PAYMENT_STATUS.FAILED ||
          phase === PAYMENT_STATUS.FAILED_CANCELLED ||
          phase === PAYMENT_STATUS.FAILED_TIMEOUT ||
          phase === PAYMENT_STATUS.CONNECT_FAILED ||
          phase === PAYMENT_STATUS.PAYMENT_TERMINAL_CONNECT_FAILED ||
          phase === PAYMENT_STATUS.UNKNOWN
        }
        onClick={(): void => {
          handleOnClose()
          setPausedSubscription(true)
        }}
      >
        <CloseIconHolder as={Icon['close']} />
      </CloseDialog>
      <WaitingPaymentCard display-if={phase === PAYMENT_STATUS.INITIAL || phase === PAYMENT_STATUS.STARTED} />
      <ReadingPaymentCard display-if={phase === PAYMENT_STATUS.READ_OK} status={SubscriptionPopupStatus.SUCCESS} />
      <ReadingPaymentCard
        display-if={
          phase === PAYMENT_STATUS.TRANSACTION_FAILED ||
          phase === PAYMENT_STATUS.FAILED ||
          phase === PAYMENT_STATUS.FAILED_CANCELLED ||
          phase === PAYMENT_STATUS.CONNECT_FAILED ||
          phase === PAYMENT_STATUS.PAYMENT_TERMINAL_CONNECT_FAILED ||
          phase === PAYMENT_STATUS.FAILED_TIMEOUT
        }
        status={SubscriptionPopupStatus.ERROR}
        attemptAction={handleNewPaymentAttempt}
      />
      <AddedPaymentCard
        display-if={
          phase === PAYMENT_STATUS.SUCCESS ||
          phase === PAYMENT_STATUS.PRINT_STARTED ||
          phase === PAYMENT_STATUS.PRINT_OK ||
          phase === PAYMENT_STATUS.PRINT_FAILED
        }
        phase={phase}
        status={SubscriptionPopupStatus.ADDED}
        handleOnClose={(): void => {
          handleOnClose()
          setPausedSubscription(true)
        }}
        callbackBeforeRedirect={setShadowedBeforeRedirect}
        vesselName={vesselName}
        reservationId={reservationId}
      />
      <AddedPaymentCard
        display-if={phase === PAYMENT_STATUS.UNKNOWN}
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

export default AddPaymentCardPopup
