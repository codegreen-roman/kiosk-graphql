import { useState } from 'react'
import { useMutation } from 'urql'
import cancelReservationMutation from '@gql/mutation/cancelReservation.graphql'
import { makeId } from '@utils/helpers'
import PAYMENT_STATUS from '@const/paymentStatuses'
import { useRouter } from 'next/router'
import { AppStateTypes, useAppState } from '../../../../hooks/useAppState'
import { ReservationLoad } from '@interfaces/boraCore'

type dataForMutation = {
  reservationId: number
  port: string
}
interface Result {
  enablePanel: boolean
  openAddMode: boolean
  dataForMutation: dataForMutation
  setDataForMutation
  operationId: string
  openCardMode: boolean
  isShadowed: boolean
  handleAddModeClose: () => void
  handleCardModeClose: () => Promise<void>
  callBack: (flag: boolean) => void
  handleZeroPriceReservation: () => void
  redirectToConfirmationPage: (status: string, vesselName: string, reservationId: number) => void
  returnOneWayTrip: (routeLeg: string, route: string) => void
}
export function usePaymentPanelOperations(reservationId: number, port: string): Result {
  const router = useRouter()
  const { dispatch } = useAppState()
  const [enablePanel, setEnablePanel] = useState(false)
  const [openAddMode, setAddModeOpen] = useState(false)
  const [dataForMutation, setDataForMutation] = useState({
    reservationId: 0,
    port: port,
  })
  const [operationId, setOperationId] = useState(null)
  const [openCardMode, setCardModeOpen] = useState(false)
  const [isShadowed, setIsShadowed] = useState(false)
  const [, cancelReservation] = useMutation<ReservationLoad>(cancelReservationMutation)
  const handleAddModeClose = (): void => {
    setAddModeOpen((prev) => !prev)
    dispatch({ type: AppStateTypes.setOpenedPaymentPopup, payload: false })
  }
  const handleCardModeClose = async (): Promise<void> => {
    setCardModeOpen((prev) => !prev)
    dispatch({ type: AppStateTypes.setOpenedPaymentPopup, payload: false })
  }
  const callBack = (flag: boolean): void => {
    setEnablePanel(flag)
  }
  const handleZeroPriceReservation = (): void => {
    setOperationId(makeId(10))
    setIsShadowed(true)
  }
  const redirectToConfirmationPage = (status: string, vesselName: string, reservationId: number): void => {
    if (
      status === PAYMENT_STATUS.PRINT_STARTED ||
      status === PAYMENT_STATUS.PRINT_OK ||
      status === PAYMENT_STATUS.PRINT_FAILED
    ) {
      router.push(`/confirmation/${vesselName}-${reservationId}`)
    }
  }
  const returnOneWayTrip = (routeLeg: string, route: string): void => {
    cancelReservation({ reservationId }).catch(console.error)
    router.push(`/select-date/${routeLeg}/?route=${route}`)
  }
  return {
    enablePanel,
    openAddMode,
    dataForMutation,
    setDataForMutation,
    operationId,
    openCardMode,
    isShadowed,
    handleAddModeClose,
    handleCardModeClose,
    callBack,
    handleZeroPriceReservation,
    redirectToConfirmationPage,
    returnOneWayTrip,
  }
}
