import { useMutation } from 'urql'
import createReservationMutation from '@gql/mutation/createReservation.graphql'
import updateReservationMutation from '@gql/mutation/updateReservation.graphql'
import finishReservationMutation from '@gql/mutation/finishReservation.graphql'
import removeResident from '@gql/mutation/removeResident.graphql'
import removeVehicle from '@gql/mutation/removeVehicle.graphql'
import {
  PackageInput,
  ResidentPackageInput,
  TicketType,
} from '@components/SelectTicketPanel/themes/kihnuKiosk/selectTickets'
import * as R from 'ramda'
import TICKET_TYPE from '@const/ticketTypes'
import { AppStateTypes, useAppState } from '../../../../hooks/useAppState'
import { Dispatch, useState } from 'react'
import { OwnerTypeNames, ReservationLoad } from '@interfaces/boraCore'
import RESERVATION_ERROR from '@const/reservationErrorCodes'

interface ParametersForSelectTicketCallback {
  isSkipped: boolean
  setIsSkipped
  leg: string
  reservationId: number
  selectedTickets: TicketType[]
  setSelectedTickets
  setErrorMessage
  setReservationId
  sailRefId: number
  setGrandTotal
  setSeqN
  setVehicleSeqN
  residentId?: {
    type: string
    idNumbers: string[]
  }
  vehicle?: {
    flag: boolean
    type: string
    data: {
      automatic?: {
        licencePlate: string
        companyRegistrationNumber?: string
        handicapped?: boolean
      }
      manual?: {
        licencePlate: string
        priceCategory: string
        heightInCm: number
        lengthInCm: number
        widthInCm: number
        weightInKg: number
      }
    }
  }
  backLeg?: string
  backSailRefId?: number
  dispatchForRemovingTicket?: (type: string) => void
  shouldBePromoted: boolean
}
interface Result {
  isFetching: boolean
  initialReservation: (setReservationId, setGrandTotal) => Promise<void>
  selectTicketCallback: ({
    isSkipped,
    setIsSkipped,
    leg,
    reservationId,
    selectedTickets,
    setSelectedTickets,
    setErrorMessage,
    setReservationId,
    sailRefId,
    setGrandTotal,
    setSeqN,
    setVehicleSeqN,
    residentId,
    vehicle,
    backLeg,
    backSailRefId,
    dispatchForRemovingTicket,
  }: ParametersForSelectTicketCallback) => Promise<void>
  requestFinishReservation: (reservationId: number, port: string) => Promise<ReservationFinishResult>
  requestRemoveResident: (
    reservationId: number,
    idNumber: string,
    sailPackageSeqN: number[],
    setGrandTotal
  ) => Promise<void>
  requestRemoveVehicle: (
    reservationId: number,
    vehicleSeqN: number[],
    sailPackageSeqN: number[],
    setGrandTotal
  ) => Promise<void>
  isVehicleAddedToReservation: boolean
  isLocalCompanyVehicleHasBeenAdded: boolean
  setVehicleAddedToReservation: Dispatch<boolean>
  isVehicleRemovedFromReservation: boolean
  setVehicleRemovedFromReservation: Dispatch<boolean>
  isPromotionAddedToReservation: boolean
  setPromotionAddedToReservation: Dispatch<boolean>
  isCitizenAddedToReservation: boolean
  setCitizenAddedToReservation: Dispatch<boolean>
}
type ReservationFinishResult = { reservationId: number; status: string }
// const getAllCount = reduce((amount: number, { count }) => amount + count, 0)

export function useSelectTicket(cancelInvalidReservation: () => void, clearReservation?: () => void): Result {
  const { dispatch } = useAppState()
  const [, createReservation] = useMutation<{ startReservation: ReservationLoad }>(createReservationMutation)
  const [, updateReservation] = useMutation<{ updateReservation: ReservationLoad }>(updateReservationMutation)
  const [, finishReservation] = useMutation<{ finishReservation: ReservationLoad }>(finishReservationMutation)
  const [, deleteResidents] = useMutation<{ deleteResidents: ReservationLoad }>(removeResident)
  const [, deleteVehicles] = useMutation<{ deleteVehicles: ReservationLoad }>(removeVehicle)
  const [reservation, setReservation] = useState<ReservationLoad>()
  const [isFetching, setFetching] = useState<boolean>()
  const [isVehicleAddedToReservation, setVehicleAddedToReservation] = useState<boolean>(false)
  const [isLocalCompanyVehicleHasBeenAdded, setLocalCompanyVehicleHasBeenAdded] = useState<boolean>(false)
  const [isVehicleRemovedFromReservation, setVehicleRemovedFromReservation] = useState<boolean>(false)
  const [isPromotionAddedToReservation, setPromotionAddedToReservation] = useState<boolean>(false)
  const [isCitizenAddedToReservation, setCitizenAddedToReservation] = useState<boolean>(false)

  const initialReservation = async (setReservationId, setGrandTotal): Promise<void> => {
    const { data } = await createReservation()
    if (data && data.startReservation) {
      setReservationId(data.startReservation.reservationId)
      setGrandTotal(data.startReservation.paymentInfo.totalPrice.amount)
      dispatch({ type: AppStateTypes.startReservation, payload: `${data.startReservation.reservationId}` })
      setReservation(data.startReservation)
    }
  }
  const selectTicketCallback = async ({
    isSkipped,
    setIsSkipped,
    leg,
    backLeg,
    reservationId,
    selectedTickets,
    setSelectedTickets,
    setErrorMessage,
    sailRefId,
    backSailRefId,
    setGrandTotal,
    setSeqN,
    setVehicleSeqN,
    residentId,
    vehicle,
    dispatchForRemovingTicket,
    shouldBePromoted,
  }: ParametersForSelectTicketCallback): Promise<void> => {
    if (isSkipped) {
      return
    }
    const createPackages = (leg: string, sailRefId: number): PackageInput[] =>
      selectedTickets
        .filter((it) => !it.resident && it.type !== TICKET_TYPE.TRAILER && it.type !== TICKET_TYPE.VEHICLE)
        .map(({ type, count, priceCategory, text }) => {
          return {
            sailPackage: leg,
            sailRefId: sailRefId,
            ...(text === TICKET_TYPE.BICYCLE
              ? { bicycle: { amount: count, priceCategory } }
              : { passenger: { amount: count, priceCategory: type } }),
          }
        })
    const createResidentPackages = (leg: string, sailRefId: number, residentId): ResidentPackageInput[] => [
      {
        sailPackage: leg,
        sailRefId: sailRefId,
        personalIdentificationNumber: residentId.idNumbers[residentId.idNumbers.length - 1],
        priceCategory: residentId.type,
      },
    ]
    const createVehiclePackages = (leg: string, sailRefId: number, vehicle): PackageInput[] => [
      {
        sailPackage: leg,
        sailRefId: sailRefId,
        vehicle: vehicle.data.manual
          ? {
              manual: {
                licencePlate: vehicle.data.manual.licencePlate,
                priceCategory: vehicle.data.manual.priceCategory,
                heightInCm: vehicle.data.manual.heightInCm,
                lengthInCm: vehicle.data.manual.lengthInCm,
                widthInCm: vehicle.data.manual.widthInCm,
                weightInKg: vehicle.data.manual.weightInKg,
                ...(vehicle.data.manual.companyRegistrationNumber && {
                  companyRegistrationNumber: vehicle.data.manual.companyRegistrationNumber,
                  backupRoadAdministrationRegistryUsed: true,
                  backupBusinessRegistryUsed: true,
                }),
              },
            }
          : {
              automatic: {
                licencePlate: vehicle.data.automatic.licencePlate,
                companyRegistrationNumber: vehicle.data.automatic.companyRegistrationNumber,
                handicapped: vehicle.data.automatic.handicapped,
              },
            },
      },
    ]
    const variables: {
      input: { packages?: PackageInput[]; residentPackages?: ResidentPackageInput[] }
      readonly reservationId: number
    } = residentId
      ? {
          input: {
            residentPackages:
              backLeg && backSailRefId
                ? [
                    ...createResidentPackages(leg, sailRefId, residentId),
                    ...createResidentPackages(backLeg, backSailRefId, residentId),
                  ]
                : createResidentPackages(leg, sailRefId, residentId),
          },
          reservationId,
        }
      : {
          input: vehicle.flag
            ? {
                packages:
                  backLeg && backSailRefId
                    ? [
                        ...createVehiclePackages(leg, sailRefId, vehicle),
                        ...createVehiclePackages(backLeg, backSailRefId, vehicle),
                      ]
                    : createVehiclePackages(leg, sailRefId, vehicle),
              }
            : {
                packages:
                  backLeg && backSailRefId
                    ? [...createPackages(leg, sailRefId), ...createPackages(backLeg, backSailRefId)]
                    : createPackages(leg, sailRefId),
              },
          reservationId,
        }
    try {
      setFetching(true)
      const { data, error } = await updateReservation(variables)
      setFetching(false)
      if (error) {
        throw error.graphQLErrors[0]
      }
      if (data) {
        setReservation(data.updateReservation)
        setGrandTotal(data.updateReservation.paymentInfo.totalPrice.amount)
        setSeqN(data.updateReservation.sailPackages?.map((item) => item.seqN))
        if (vehicle.flag) {
          setVehicleSeqN((prevState) => [
            ...prevState,
            {
              seqN: data.updateReservation.sailPackages?.map((item) => {
                const vehiclesItems = item.sailRefs[0]?.items.filter(
                  (item) => item.owners[0]?.__typename === OwnerTypeNames.RESERVATION_VEHICLE
                )
                return vehiclesItems[vehiclesItems.length - 1]?.owners[0]?.seqN
              }),
              type: vehicle.type,
            },
          ])
          if (vehicle.data?.automatic?.companyRegistrationNumber) {
            setLocalCompanyVehicleHasBeenAdded(true)
          }
          setVehicleAddedToReservation(true)
        }
        if (residentId) {
          setCitizenAddedToReservation(true)
        }
        if (shouldBePromoted) {
          setPromotionAddedToReservation(true)
        }
        setErrorMessage((prevState) => ({ ...prevState, flag: false, message: '', code: '' }))
      }
    } catch (e) {
      if (e.extensions?.code === RESERVATION_ERROR.RESERVATION_NOT_FOUND) {
        cancelInvalidReservation()
        return
      } else if (e.extensions?.code === RESERVATION_ERROR.RESERVATION_ALREADY_LOCKED) {
        clearReservation()
        return
      }
      setErrorMessage((prevState) => ({
        ...prevState,
        flag: true,
        message: e.message.toString(),
        code: e.extensions?.code || e.extensions?.classification,
      }))
      setIsSkipped(true)
      if (vehicle.flag) {
        dispatchForRemovingTicket(vehicle.type)
      } else {
        setSelectedTickets((prevState) => R.dropLast(1, [...prevState]))
      }
      // todo: restore tickets from items
      setGrandTotal(reservation.paymentInfo.totalPrice.amount)
    }
  }
  const requestFinishReservation = async (reservationId: number, port: string): Promise<ReservationFinishResult> => {
    if (reservationId) {
      try {
        const { data, error } = await finishReservation({ reservationId, port })
        if (data) {
          setReservation(data.finishReservation)
          return data.finishReservation
        } else if (error) {
          throw error.graphQLErrors[0]
        }
      } catch (e) {
        if (e.extensions?.code === RESERVATION_ERROR.RESERVATION_NOT_FOUND) {
          cancelInvalidReservation()
          return
        } else if (e.extensions?.code === RESERVATION_ERROR.RESERVATION_ALREADY_LOCKED) {
          clearReservation()
          return
        }
      }
    }
  }
  const requestRemoveResident = async (
    reservationId: number,
    idNumber: string,
    sailPackageSeqN: number[],
    setGrandTotal
  ): Promise<void> => {
    if (sailPackageSeqN) {
      try {
        const { data, error } = await deleteResidents({
          reservationId,
          requests: sailPackageSeqN.map((seqN) => ({
            personalIdentificationNumber: idNumber,
            sailPackageSeqN: seqN,
          })),
        })
        if (error) {
          throw error.graphQLErrors[0]
        }
        if (data) {
          setReservation(data.deleteResidents)
          setGrandTotal(data.deleteResidents.paymentInfo.totalPrice.amount)
        }
      } catch (e) {
        if (e.extensions?.code === RESERVATION_ERROR.RESERVATION_ALREADY_LOCKED) {
          clearReservation()
          return
        }
      }
    }
  }
  const requestRemoveVehicle = async (
    reservationId: number,
    vehicleSeqN: number[],
    sailPackageSeqN: number[],
    setGrandTotal
  ): Promise<void> => {
    if (sailPackageSeqN) {
      try {
        const { data, error } = await deleteVehicles({
          reservationId,
          requests: sailPackageSeqN.map((seqN, index) => {
            return {
              vehicleSeqN: vehicleSeqN[index],
              sailPackageSeqN: seqN,
            }
          }),
        })
        if (error) {
          throw error.graphQLErrors[0]
        }
        if (data) {
          setReservation(data.deleteVehicles)
          setLocalCompanyVehicleHasBeenAdded(false)
          setVehicleRemovedFromReservation(true)
          setGrandTotal(data.deleteVehicles.paymentInfo.totalPrice.amount)
        }
      } catch (e) {
        if (e.extensions?.code === RESERVATION_ERROR.RESERVATION_ALREADY_LOCKED) {
          clearReservation()
          return
        }
      }
    }
  }
  return {
    initialReservation,
    selectTicketCallback,
    requestFinishReservation,
    requestRemoveResident,
    requestRemoveVehicle,
    isFetching,
    isVehicleAddedToReservation,
    isLocalCompanyVehicleHasBeenAdded,
    setVehicleAddedToReservation,
    isVehicleRemovedFromReservation,
    setVehicleRemovedFromReservation,
    isPromotionAddedToReservation,
    setPromotionAddedToReservation,
    isCitizenAddedToReservation,
    setCitizenAddedToReservation,
  }
}
