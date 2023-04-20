import { useMutation } from 'urql'
import { useState } from 'react'
import PAYMENT_STATUS from '@const/paymentStatuses'
import PayOperation from '@gql/mutation/paymentProcess.graphql'
import RESERVATION_ERROR from '@const/reservationErrorCodes'
import { PaymentTerminalOperation } from '@interfaces/boraCore'

interface ResultData {
  data?: {
    paymentTerminalOperationProgress: {
      status: string
    }
  }
}
interface Result {
  requestPaymentCard: (operationId: string, reservationId, port: string, debugFlag: object | null) => Promise<void>
  compareStatusToRenderPopup: (result: ResultData, shouldCompareStatuses: string, setPhase, setReadIdNumber) => void
}
export function usePaymentCard(cancelInvalidReservation: () => void, isZeroPrice?: boolean): Result {
  const [, setIsShadowed] = useState(true)
  const [, requestPayment] = useMutation<PaymentTerminalOperation>(PayOperation)

  const requestPaymentCard = async (
    operationId: string,
    reservationId,
    port: string,
    debugFlag: object | null
  ): Promise<void> => {
    const variables = debugFlag
      ? {
          operationId: operationId,
          reservationId: reservationId,
          port: port,
          debug: debugFlag,
        }
      : {
          operationId: operationId,
          reservationId: reservationId,
          port: port,
        }
    try {
      const { data, error } = await requestPayment(variables)
      if (data && !error && !isZeroPrice) {
        setIsShadowed((prevState) => !prevState)
      }
      if (error) {
        if (
          error.graphQLErrors[0].extensions.code === PAYMENT_STATUS.INVALID_RESERVATION_STATUS ||
          error.graphQLErrors[0].extensions.code === RESERVATION_ERROR.RESERVATION_ALREADY_LOCKED
        ) {
          cancelInvalidReservation()
        }
        throw new Error(error.toString())
      }
    } catch (error) {
      throw new Error(error.toString())
    }
  }

  const compareStatusToRenderPopup = (
    result: ResultData,
    shouldCompareStatuses: string,
    setPhase,
    newPaymentsAmount
  ): void => {
    setPhase((prevPhase) => {
      if (
        shouldCompareStatuses &&
        prevPhase !== PAYMENT_STATUS.FAILED &&
        prevPhase !== result.data.paymentTerminalOperationProgress.status &&
        newPaymentsAmount === 0
      ) {
        return result.data.paymentTerminalOperationProgress.status
      } else if (
        shouldCompareStatuses &&
        prevPhase !== PAYMENT_STATUS.FAILED &&
        prevPhase !== result.data.paymentTerminalOperationProgress.status &&
        newPaymentsAmount > 0
      ) {
        return result.data.paymentTerminalOperationProgress.status
      } else if (
        shouldCompareStatuses &&
        prevPhase === PAYMENT_STATUS.FAILED &&
        prevPhase !== result.data.paymentTerminalOperationProgress.status &&
        newPaymentsAmount > 0
      ) {
        return PAYMENT_STATUS.INITIAL
      } else {
        return PAYMENT_STATUS.INITIAL
      }
    })
  }
  return {
    requestPaymentCard,
    compareStatusToRenderPopup,
  }
}
