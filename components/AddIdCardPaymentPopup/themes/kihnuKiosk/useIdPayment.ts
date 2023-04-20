import { useMutation } from 'urql'
import requestIdPaymentOperation from '@gql/mutation/requestIdPaymentCard.graphql'
import cancelIdCardOperation from '@gql/mutation/cancelIdCardRead.graphql'
import { useState } from 'react'
import ID_PAYMENT_STATUS from '@const/idPaymentStatuses'
import { PaymentTerminalOperation } from '@interfaces/boraCore'

interface ResultData {
  data?: {
    paymentTerminalOperationProgress: {
      status: string
      result: {
        creditCompanyMembers?: Array<object>
      }
    }
  }
}
interface Result {
  requestIdCardPayment: (
    operationId: string,
    reservationId,
    port: string,
    debugFlag: object | null,
    companyId?: string,
    personalIdentificationNumber?: string
  ) => Promise<void>
  requestCancelRead: (operationId: string, port: string) => Promise<void>
  compareStatusToRenderPopup: (
    result: ResultData,
    shouldCompareStatuses: boolean,
    setPhase,
    setApprovedCompanies,
    paymentAfterCompanySelected: boolean
  ) => void
}
export function useIdPayment(cancelInvalidReservation: () => void): Result {
  const [, setIsShadowed] = useState(true)
  const [, requestCreditPayment] = useMutation<PaymentTerminalOperation>(requestIdPaymentOperation)
  const [, cancelIdCardRead] = useMutation<PaymentTerminalOperation>(cancelIdCardOperation)

  const requestIdCardPayment = async (
    operationId: string,
    reservationId,
    port: string,
    debugFlag: object | null,
    companyId?: string,
    personalIdentificationNumber?: string
  ): Promise<void> => {
    const variables = debugFlag
      ? {
          operationId: operationId,
          reservationId: reservationId,
          port: port,
          companyId: companyId,
          personalIdentificationNumber: personalIdentificationNumber,
          debug: debugFlag,
        }
      : {
          operationId: operationId,
          reservationId: reservationId,
          port: port,
          companyId: companyId,
          personalIdentificationNumber: personalIdentificationNumber,
        }
    try {
      const { data, error } = await requestCreditPayment(variables)
      if (data && !error) {
        setIsShadowed((prevState) => !prevState)
      }
      if (error) {
        if (error.graphQLErrors[0].extensions.code === ID_PAYMENT_STATUS.INVALID_RESERVATION_STATUS) {
          cancelInvalidReservation()
        }
        throw new Error(error.toString())
      }
    } catch (error) {
      throw new Error(error.toString())
    }
  }

  const requestCancelRead = async (operationId: string, port: string): Promise<void> => {
    const variables = {
      operationId: operationId,
      port: port,
    }
    const { data, error } = await cancelIdCardRead(variables)
    // eslint-disable-next-line no-console
    console.log('cancel data', data)
    // eslint-disable-next-line no-console
    console.log('cancel error', error)
  }

  const compareStatusToRenderPopup = (
    result: ResultData,
    shouldCompareStatuses: boolean,
    setPhase,
    setApprovedCompanies,
    paymentAfterCompanySelected: boolean
  ): void => {
    setPhase((prevPhase) => {
      if (shouldCompareStatuses && prevPhase !== result.data.paymentTerminalOperationProgress.status) {
        if (result.data.paymentTerminalOperationProgress.status === ID_PAYMENT_STATUS.MULTIPLE_COMPANIES) {
          setApprovedCompanies(result.data.paymentTerminalOperationProgress.result?.creditCompanyMembers)
        }
        return result.data.paymentTerminalOperationProgress.status
      } else if (paymentAfterCompanySelected) {
        return ID_PAYMENT_STATUS.LOADING_AFTER_COMPANY_SELECTED
      } else {
        return ID_PAYMENT_STATUS.INITIAL
      }
    })
  }
  return {
    requestIdCardPayment,
    requestCancelRead,
    compareStatusToRenderPopup,
  }
}
