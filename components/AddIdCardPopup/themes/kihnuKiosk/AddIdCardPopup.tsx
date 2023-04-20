import React, { FC, useContext, useEffect, useState } from 'react'
import { Box, Dialog } from '@material-ui/core'
import { AddIdCardPopupProps } from '@components/AddIdCardPopup'
import { Icon } from '@components/Icon'
import WaitingIdCard from './WaitingIdCard'
import ReadingIdCard from './ReadingIdCard'
import AddedIdCard from './AddedIdCard'
import { CloseDialog, CloseIconHolder } from './AddIdCardPopupStyles'
import { useSubscription } from 'urql'
import subscribePaymentTerminal from '@gql/subscription/subscribePaymentTerminal.graphql'
import { makeId } from '@utils/helpers'
import ID_STATUS from '@const/idCardStatuses'
import { useIdAddition } from '@components/AddIdCardPopup/themes/kihnuKiosk/useIdAddition'
import { debugFlag, debugFlagNewAttempt } from '@const/idCardDebugFlags'
import { usePreviousType } from '../../../../hooks/usePrevious'
import { logWithBeacon } from '@utils/logging'
import { SubscriptionPopupStatus } from '@interfaces/popupStatus'
import { useHotkeys } from 'react-hotkeys-hook'
import { AppStateTypes, useAppState } from '../../../../hooks/useAppState'
import { TimerContext } from '@components/Layout/themes/kihnuKiosk/Layout'
import { InternalKeyboardPrimary } from '@components/InternalKeyboardPrimary'
import { variableToString } from '@utils/formatters'
import { manualIdTriggerLength } from '@interfaces/boraCore'

const debugMode = false
const AddIdCardPopup: FC<AddIdCardPopupProps> = ({
  open,
  handleOnClose,
  dataForMutation,
  reservationError,
  manageIds,
  isCitizenAddedToReservation,
}) => {
  const [isTimeUp, setTimeIsUp] = useContext(TimerContext)
  const [phase, setPhase] = useState('')
  const prevPhase = usePreviousType(phase)
  const [readIdNumber, setReadIdNumber] = useState(0)
  const [approvedIdNumbers, setApprovedIdNumbers] = useState([])
  const [operationId, setOperationId] = useState('')
  const [reloadForNewAttempt, setReloadForNewAttempt] = useState(false)
  const [mutationLoading, setMutationLoading] = useState(false)
  const { port, reservationId, leg, sailRefId, backLeg, backSailRefId, newRequestsAmount } = dataForMutation
  const { ticket } = newRequestsAmount
  const [pauseSubscription, setPausedSubscription] = useState(true)
  const [inputs, setInputs] = useState({})
  const [inputName, setInputName] = useState('default')

  const [manualId, setManualId] = useState('')
  const prevManualId = usePreviousType(manualId)
  const prevType = usePreviousType(ticket.type)
  const { requestRead, compareStatusToRenderPopup, duplicatedId, priceCategory } = useIdAddition()

  const getInputValue = (inputName): string => {
    if (inputName === variableToString({ manualId })) {
      setManualId(inputs[inputName])
    }
    return inputs[inputName] || ''
  }

  const handlePopupClosed = (): void => {
    // requestCancelRead(operationId, port).catch(console.error)
    handleOnClose()
    setPausedSubscription(true)
    setMutationLoading(false)
    setReadIdNumber(0)
    manageIds(null, null, true, manualId?.length > 0)
  }
  const [result] = useSubscription({
    query: subscribePaymentTerminal,
    variables: {
      port: port,
      operationId: operationId,
    },
    pause: pauseSubscription,
  })

  useEffect(() => {
    if (
      phase === ID_STATUS.READER_ERROR ||
      phase === ID_STATUS.FAILED ||
      phase === ID_STATUS.FAILED_CANCELLED ||
      phase === ID_STATUS.CONNECT_FAILED ||
      phase === ID_STATUS.PAYMENT_TERMINAL_CONNECT_FAILED ||
      phase === ID_STATUS.FAILED_TIMEOUT
    ) {
      setInputName(variableToString({ manualId }))
    } else {
      setInputs((prevState) => ({ ...prevState, manualId: '' }))
    }
  }, [phase])

  useEffect(() => {
    if (Boolean(prevType) && ticket.type !== prevType) {
      setReloadForNewAttempt(true)
      setPhase(ID_STATUS.INITIAL)
    }
  }, [ticket.type])
  useEffect(() => {
    let timer = null
    if (open) {
      setInputs((prevState) => ({ ...prevState, manualId: '' }))
      setManualId('')
      setOperationId(makeId(10))
      setPhase(ID_STATUS.INITIAL)
      timer = setTimeout(() => {
        setPausedSubscription(false)
      }, 500)
    }
    return (): void => clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (newRequestsAmount.reset.flag) {
      setApprovedIdNumbers((prevState) => {
        const idx = [...prevState].findIndex((item) => item.type === ticket.type)
        return prevState.map((item, index) =>
          index === idx ? { ...item, idNumbers: newRequestsAmount.reset.idNumbers } : item
        )
      })
    }
  }, [newRequestsAmount.amount])
  useEffect(() => {
    let timer = null
    if (operationId && dataForMutation.reservationId !== 0 && !dataForMutation.removing) {
      timer = setTimeout(async () => {
        await requestRead(
          operationId,
          reservationId,
          port,
          leg,
          sailRefId,
          ticket.type,
          debugMode ? (newRequestsAmount.amount === 1 && !reloadForNewAttempt ? debugFlag : debugFlagNewAttempt) : null,
          // debugMode ? (newRequestsAmount.amount === 1 ? debugFlag : debugFlagNewAttempt) : null
          backLeg,
          backSailRefId
        )
      }, 1000)
    }
    return (): void => clearTimeout(timer)
  }, [dataForMutation, operationId, reloadForNewAttempt])

  const shouldCompareStatuses =
    result.data && result.data.paymentTerminalOperationProgress && result.data.paymentTerminalOperationProgress.status
  const shouldCompareIds =
    shouldCompareStatuses && operationId !== result.data.paymentTerminalOperationProgress.operationId
  // reloadForNewAttempt

  useEffect(() => {
    if (open && operationId) {
      compareStatusToRenderPopup(
        result,
        shouldCompareStatuses,
        setPhase,
        readIdNumber,
        setReadIdNumber,
        setApprovedIdNumbers
      )
    }
  }, [open, shouldCompareStatuses, shouldCompareIds, operationId])

  useEffect(() => {
    let timer = null
    if (isTimeUp.some((it) => it.isTimeUpFlag) && prevPhase === phase && phase !== ID_STATUS.FAILED) {
      setPhase(ID_STATUS.FAILED)
      setTimeIsUp([{ isTimeUpFlag: false, direction: undefined }])
    }
    if (phase === ID_STATUS.READ_OK && isTimeUp.every((it) => !it.isTimeUpFlag)) {
      timer = setTimeout(() => {
        setPhase(ID_STATUS.FAILED)
      }, Number(process.env.NEXT_PUBLIC_CARD_READING_TIMEOUT))
    }
    return (): void => clearTimeout(timer)
  }, [isTimeUp, phase, prevPhase, shouldCompareStatuses])

  useEffect(() => {
    setMutationLoading(false)
    if (reservationError.flag) {
      setPhase(ID_STATUS[reservationError.code] || ID_STATUS.FAILED)
      return
    }
  }, [reservationError])

  useEffect(() => {
    if (isCitizenAddedToReservation) {
      handleOnClose()
      setPausedSubscription(true)
    }
  }, [isCitizenAddedToReservation])

  useEffect(() => {
    if (duplicatedId) {
      setPhase(ID_STATUS.DISCOUNT_ALREADY_USED_IN_RESERVATION)
    }
  }, [duplicatedId])

  useEffect(() => {
    if (phase === ID_STATUS.SUCCESS && !duplicatedId) {
      setMutationLoading(true)
      if (approvedIdNumbers.length) {
        manageIds(approvedIdNumbers, priceCategory ? priceCategory : ticket.type, false, false)
      }
      setReadIdNumber(0)
    } else if (
      phase === ID_STATUS.UNKNOWN ||
      phase === ID_STATUS.EXPIRED ||
      phase === ID_STATUS.RESERVATION_NOT_FOUND ||
      phase === ID_STATUS.USED_ON_SAIL ||
      phase === ID_STATUS.DISCOUNT_ALREADY_USED_ON_SAIL ||
      phase === ID_STATUS.DISCOUNT_ALREADY_USED_IN_RESERVATION ||
      phase === ID_STATUS.NO_DISCOUNT_ON_ROUTE ||
      phase === ID_STATUS.READER_ERROR ||
      phase === ID_STATUS.FAILED ||
      phase === ID_STATUS.FAILED_CANCELLED ||
      phase === ID_STATUS.CONNECT_FAILED ||
      phase === ID_STATUS.PAYMENT_TERMINAL_CONNECT_FAILED ||
      phase === ID_STATUS.FAILED_TIMEOUT
    ) {
      logWithBeacon('IdCardWindowError', `phase=${phase}`)
    }
  }, [phase])

  useEffect(() => {
    if (manualId && prevManualId !== manualId) {
      if (manualId.length === manualIdTriggerLength) {
        setApprovedIdNumbers((prevState) => {
          const alreadyUsedType = prevState.find((item) => item.type === ticket.type)
          let idNumbersToAdd = [manualId]
          if (alreadyUsedType) {
            idNumbersToAdd = alreadyUsedType.idNumbers.includes(manualId)
              ? [...alreadyUsedType.idNumbers]
              : [...alreadyUsedType.idNumbers, manualId]
            return [
              prevState.filter((item) => item.type !== alreadyUsedType.type),
              {
                type: alreadyUsedType.type,
                idNumbers: idNumbersToAdd,
              },
            ]
          } else {
            return [
              ...prevState,
              {
                type: ticket.type,
                idNumbers: idNumbersToAdd,
              },
            ]
          }
        })
      }
    }
  }, [manualId])

  const { dispatch } = useAppState()

  useHotkeys('ctrl+shift+f', () => {
    dispatch({ type: AppStateTypes.cursorEnable, payload: true })
  })

  const handleManualIdCheck = (): void => {
    setMutationLoading(true)
    if (approvedIdNumbers.length) {
      logWithBeacon('Manual IDs are: ', `ID=${approvedIdNumbers.map((id) => id.idNumbers).toString()}`)
      manageIds(approvedIdNumbers, ticket.type, false, true)
    }
    setReadIdNumber(0)
  }

  return (
    <Dialog
      open={open}
      onClose={(): void => {
        handlePopupClosed()
      }}
      disableBackdropClick={true}
      maxWidth="lg"
      PaperProps={{
        style: {
          overflow: 'unset',
          background: 'none',
        },
        elevation: phase === ID_STATUS.FAILED ? 0 : 24,
      }}
    >
      <CloseDialog
        display-if={
          phase !== ID_STATUS.INITIAL &&
          phase !== ID_STATUS.STARTED &&
          phase !== ID_STATUS.READ_OK &&
          phase !== ID_STATUS.SUCCESS
        }
        onClick={(): void => {
          handlePopupClosed()
        }}
      >
        <CloseIconHolder as={Icon['close']} />
      </CloseDialog>
      <WaitingIdCard display-if={phase === ID_STATUS.INITIAL || phase === ID_STATUS.STARTED} />
      <ReadingIdCard display-if={false} status={SubscriptionPopupStatus.READING} />
      <ReadingIdCard display-if={phase === ID_STATUS.READ_OK} status={SubscriptionPopupStatus.SUCCESS} />
      <ReadingIdCard
        display-if={
          phase === ID_STATUS.READER_ERROR ||
          phase === ID_STATUS.FAILED ||
          phase === ID_STATUS.FAILED_CANCELLED ||
          phase === ID_STATUS.CONNECT_FAILED ||
          phase === ID_STATUS.PAYMENT_TERMINAL_CONNECT_FAILED ||
          phase === ID_STATUS.FAILED_TIMEOUT
        }
        status={SubscriptionPopupStatus.ERROR}
        manualId={manualId}
        getValue={getInputValue}
      />
      <AddedIdCard
        display-if={phase === ID_STATUS.SUCCESS}
        data={[...approvedIdNumbers].find((item) => item.type === priceCategory)?.idNumbers || []}
        status={SubscriptionPopupStatus.ADDED}
        handleOnClose={(): void => {
          // handleOnClose()
          setMutationLoading(true)
          if (approvedIdNumbers.length) {
            manageIds(approvedIdNumbers, priceCategory ? priceCategory : ticket.type, false, false)
          }
          setReadIdNumber(0)
        }}
        phase={phase}
        mutationLoading={mutationLoading}
      />
      <AddedIdCard
        display-if={
          phase === ID_STATUS.UNKNOWN ||
          phase === ID_STATUS.EXPIRED ||
          phase === ID_STATUS.RESERVATION_NOT_FOUND ||
          phase === ID_STATUS.USED_ON_SAIL ||
          phase === ID_STATUS.DISCOUNT_ALREADY_USED_ON_SAIL ||
          phase === ID_STATUS.DISCOUNT_ALREADY_USED_IN_RESERVATION ||
          phase === ID_STATUS.NO_DISCOUNT_ON_ROUTE
        }
        status={SubscriptionPopupStatus.DENIED}
        handleOnClose={(): void => {
          handleOnClose()
          setPausedSubscription(true)
          manageIds(null, null, true, manualId?.length > 0)
          setReadIdNumber(0)
        }}
        phase={phase}
        mutationLoading={mutationLoading}
      />
      <Box
        display-if={
          phase === ID_STATUS.READER_ERROR ||
          phase === ID_STATUS.FAILED ||
          phase === ID_STATUS.FAILED_CANCELLED ||
          phase === ID_STATUS.CONNECT_FAILED ||
          phase === ID_STATUS.PAYMENT_TERMINAL_CONNECT_FAILED ||
          phase === ID_STATUS.FAILED_TIMEOUT
        }
        display="flex"
        justifyContent="center"
      >
        <InternalKeyboardPrimary
          setInputs={setInputs}
          inputName={inputName}
          enterIsEnabled={manualId?.length === manualIdTriggerLength && !mutationLoading}
          mainPadIsEnabled={false}
          enterIsShown={
            phase === ID_STATUS.READER_ERROR ||
            phase === ID_STATUS.FAILED ||
            phase === ID_STATUS.FAILED_CANCELLED ||
            phase === ID_STATUS.CONNECT_FAILED ||
            phase === ID_STATUS.PAYMENT_TERMINAL_CONNECT_FAILED ||
            phase === ID_STATUS.FAILED_TIMEOUT
          }
          onEnter={(): void => {
            handleManualIdCheck()
          }}
          shouldRemoveInput={false}
          isNumerical={true}
        />
      </Box>
      {/*</DisablingLayer>*/}
    </Dialog>
  )
}

export default AddIdCardPopup
