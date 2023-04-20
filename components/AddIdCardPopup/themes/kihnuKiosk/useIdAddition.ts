import { useMutation } from 'urql'
import requestIdCardOperation from '@gql/mutation/requestIdCardRead.graphql'
import cancelIdCardOperation from '@gql/mutation/cancelIdCardRead.graphql'
import { useState } from 'react'
import ID_STATUS from '@const/idCardStatuses'
import { logWithBeacon } from '@utils/logging'
import { PaymentTerminalOperation } from '@interfaces/boraCore'

interface ResultData {
  data?: {
    paymentTerminalOperationProgress: {
      status: string
      result: {
        personalIdentificationNumber: number
      }
      priceCategory?: string
    }
  }
}
interface Result {
  requestRead: (
    operationId: string,
    reservationId,
    port: string,
    leg: string,
    sailRefId: number,
    priceCategory: string,
    debugFlag?: object,
    backLeg?: string,
    backSailRefId?: number
  ) => Promise<void>
  requestCancelRead: (operationId: string, port: string) => Promise<void>
  compareStatusToRenderPopup: (
    result: ResultData,
    shouldCompareStatuses: boolean,
    setPhase,
    readId: number,
    setReadId,
    setReadIdNumber
  ) => void
  duplicatedId: boolean
  priceCategory: string
}
export function useIdAddition(): Result {
  const [, setIsShadowed] = useState(true)
  const [duplicatedId, setDuplicatedId] = useState(false)
  const [priceCategory, setPriceCategory] = useState('')
  const [, requestIDCardRead] = useMutation<PaymentTerminalOperation>(requestIdCardOperation)
  const [, cancelIdCardRead] = useMutation<PaymentTerminalOperation>(cancelIdCardOperation)

  const requestRead = async (
    operationId: string,
    reservationId,
    port: string,
    leg: string,
    sailRefId: number,
    priceCategory: string,
    debugFlag: object | null,
    backLeg?: string,
    backSailRefId?: number
  ): Promise<void> => {
    const variables = debugFlag
      ? {
          operationId,
          reservationId,
          port: port,
          priceCategory,
          residentPackages: {
            packages:
              backLeg && backSailRefId
                ? [
                    {
                      sailPackage: leg,
                      sailRefId: sailRefId,
                    },
                    {
                      sailPackage: backLeg,
                      sailRefId: backSailRefId,
                    },
                  ]
                : [
                    {
                      sailPackage: leg,
                      sailRefId: sailRefId,
                    },
                  ],
            roundtrip: Boolean(backLeg && backSailRefId),
          },
          debug: debugFlag,
        }
      : {
          operationId: operationId,
          reservationId: reservationId,
          port: port,
          priceCategory,
          residentPackages: {
            packages:
              backLeg && backSailRefId
                ? [
                    {
                      sailPackage: leg,
                      sailRefId: sailRefId,
                    },
                    {
                      sailPackage: backLeg,
                      sailRefId: backSailRefId,
                    },
                  ]
                : [
                    {
                      sailPackage: leg,
                      sailRefId: sailRefId,
                    },
                  ],
            roundtrip: Boolean(backLeg && backSailRefId),
          },
        }
    const { data, error } = await requestIDCardRead(variables)
    // eslint-disable-next-line no-console
    console.log('data', data)
    // eslint-disable-next-line no-console
    console.log('error', error)

    if (data) {
      logWithBeacon('requestRead', `operationId=${operationId}&reservationId=${reservationId}`)
    } else if (error) {
      logWithBeacon('requestReadError', `operationId=${operationId}&reservationId=${reservationId}`)
    }

    if (data && !error) {
      setIsShadowed((prevState) => !prevState)
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
    readId: number,
    setReadId,
    setReadIdNumber
  ): void => {
    setDuplicatedId(false)
    setPhase((prevPhase) => {
      if (shouldCompareStatuses && prevPhase !== result.data.paymentTerminalOperationProgress.status) {
        if (result.data.paymentTerminalOperationProgress.status === ID_STATUS.SUCCESS && Boolean(readId)) {
          if (result.data.paymentTerminalOperationProgress.priceCategory) {
            setPriceCategory(result.data.paymentTerminalOperationProgress.priceCategory)
          }
          setReadIdNumber((prevState) => {
            if (!prevState.find((item) => item.type === result.data.paymentTerminalOperationProgress.priceCategory)) {
              return [
                ...prevState,
                { type: result.data.paymentTerminalOperationProgress.priceCategory, idNumbers: [readId.toString()] },
              ]
            } else {
              const idx = [...prevState].findIndex(
                (item) => item.type === result.data.paymentTerminalOperationProgress.priceCategory
              )
              return prevState.map((item, index) => {
                if (index === idx) {
                  // Commented out since the duplicates' checking is implemented on backend. Needs to be tested
                  // if (item.idNumbers.includes(readId.toString())) {
                  //   setDuplicatedId(true)
                  //   return { ...item, type: result.data.paymentTerminalOperationProgress.priceCategory }
                  // } else {
                  return {
                    ...item,
                    type: result.data.paymentTerminalOperationProgress.priceCategory,
                    idNumbers: item.idNumbers.includes(readId.toString())
                      ? [...item.idNumbers]
                      : [...item.idNumbers, readId.toString()],
                  }
                  // }
                } else {
                  return item
                }
              })
            }
          })
        } else if (
          result.data.paymentTerminalOperationProgress.status === ID_STATUS.READ_OK &&
          result.data.paymentTerminalOperationProgress.result
        ) {
          setReadId(result.data.paymentTerminalOperationProgress.result.personalIdentificationNumber)
        }
        return result.data.paymentTerminalOperationProgress.status
      } else {
        return ID_STATUS.INITIAL
      }
    })
  }
  return {
    requestRead,
    requestCancelRead,
    compareStatusToRenderPopup,
    duplicatedId,
    priceCategory,
  }
}
