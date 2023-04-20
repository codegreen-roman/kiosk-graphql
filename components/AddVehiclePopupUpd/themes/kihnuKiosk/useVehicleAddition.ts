import { CombinedError, useQuery } from 'urql'
import getVehicleInfo from '@gql/getVehicleData.graphql'
import getVehicleInfoRoundTrip from '@gql/getVehicleDataRoundtrip.graphql'
import TICKET_TYPE from '@const/ticketTypes'
import { Dispatch, useState } from 'react'
import VEHICLE_ERROR from '@const/vehicleErrorCodes'
import { VehicleLength, VehicleWeight } from '@interfaces/boraCore'
import { VehiclePopupStep } from '@interfaces/popupStatus'
import { CalculateVehiclePrice } from '@interfaces/prices'

interface Result {
  vehicleRemoveCallback: (isVehicleRemoved: string) => void
  vehicleSelectCallback: (manageVehicleNumbers) => void
  handleAutomaticVehicleParameters: ({ companyRegistrationNumber, handicapped, priceCategoryTitle }) => void
  handleManualVehicleParameters: ({ heightInCm, lengthInCm, widthInCm, weightInKg }) => void
  handleVehicleType: (type: string) => void
  handleOnStepBackward: (addStep: number) => void
  handleOnStepForward: (addStep: number) => void
  isManualMode: boolean
  setManualMode: Dispatch<boolean>
  isVehicleQueryTriggered: boolean
  setVehicleQueryTriggered: Dispatch<boolean>
  result: {
    data?
    fetching: boolean
    error?: CombinedError
  }
  step: VehiclePopupStep
  vehicleNumber: string
  setVehicleNumber: Dispatch<string>
  length: number
  setLength: Dispatch<number>
  weight: number
  setWeight: Dispatch<number>
  companyRegNumber: string
  setCompanyRegNumber: Dispatch<string>
  isEnabled: boolean
  setEnabled: Dispatch<boolean>
  handleReservationError: (reservationError: { message: string; flag: boolean }) => void
  showReservationError: boolean
  showVehicleInfoError: boolean
  setShowVehicleInfoError: Dispatch<boolean>
  mutationLoading: boolean
  setMutationLoading: Dispatch<boolean>
  isAutoFilledVehicleAdding: boolean
  setAutoFilledVehicleAdding: Dispatch<boolean>
  isManuallyFilledVehicleAdding: boolean
  setManuallyFilledVehicleAdding: Dispatch<boolean>
  isCompanyInputShownForManualMode: boolean
}

export function useVehicleOperations(
  type: string,
  route: string,
  sailRefId: number,
  backSailRefId: number | undefined,
  reservationId: number,
  isRoundTrip: boolean,
  setSelectedTicket: Dispatch<{ text: string; price: number }>
): Result {
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [length, setLength] = useState(5)
  const [weight, setWeight] = useState(2)
  const [step, setStep] = useState(0)
  const [isCompanyInputShownForManualMode, setCompanyInputShownForManualMode] = useState(false)
  const [isVehicleQueryTriggered, setVehicleQueryTriggered] = useState(false)
  const [isAutoFilledVehicleAdding, setAutoFilledVehicleAdding] = useState(false)
  const [isManuallyFilledVehicleAdding, setManuallyFilledVehicleAdding] = useState(false)
  const [isManualMode, setManualMode] = useState(false)
  const [manualModeData, setManualModeData] = useState({
    priceCategory: '',
    heightInCm: '',
    lengthInCm: '',
    widthInCm: '',
    weightInKg: '',
    companyRegistrationNumber: undefined,
  })
  const [companyRegNumber, setCompanyRegNumber] = useState('')
  const [automaticModeData, setAutomaticModeData] = useState({
    companyRegistrationNumber: '',
    handicapped: false,
    priceCategoryTitle: '',
    price: 0,
  })
  const [isEnabled, setEnabled] = useState(true)
  const [showReservationError, setShowReservationError] = useState(false)
  const [showVehicleInfoError, setShowVehicleInfoError] = useState(false)
  const [mutationLoading, setMutationLoading] = useState(false)

  const {
    priceCategory,
    heightInCm,
    lengthInCm,
    widthInCm,
    weightInKg,
    companyRegistrationNumber: companyRegistrationNumberManual,
  } = manualModeData
  const { companyRegistrationNumber, handicapped } = automaticModeData
  const variablesForQuery = {
    route,
    sailRefId,
    isRoundTrip,
    isTrailer: type === TICKET_TYPE.TRAILER,
    reservationId,
    vehicleData: isManualMode
      ? {
          manual: {
            licencePlate: vehicleNumber,
            priceCategory: priceCategory,
            heightInCm: heightInCm,
            lengthInCm: lengthInCm,
            widthInCm: widthInCm,
            weightInKg: weightInKg,
            ...(companyRegistrationNumberManual && { companyRegistrationNumber: companyRegistrationNumberManual }),
          },
        }
      : {
          automatic: {
            licencePlate: vehicleNumber,
            ...(companyRegistrationNumber && { companyRegistrationNumber: companyRegistrationNumber }),
            ...(handicapped && { handicapped: handicapped }),
          },
        },
  }
  const variablesForRoundTripQuery = {
    route,
    sailRefIds: [sailRefId, backSailRefId],
    isRoundTrip,
    isTrailer: type === TICKET_TYPE.TRAILER,
    reservationId,
    vehicleData: {
      automatic: {
        licencePlate: vehicleNumber,
        ...(companyRegistrationNumber && { companyRegistrationNumber: companyRegistrationNumber }),
        ...(handicapped && { handicapped: handicapped }),
      },
    },
  }
  const [result] = useQuery<{
    calculateVehiclePrice: CalculateVehiclePrice
    calculateVehiclePriceForRoundtrip: CalculateVehiclePrice
  }>({
    query:
      (step === VehiclePopupStep.INITIAL || step === VehiclePopupStep.AUTOMATIC_FORM) && backSailRefId
        ? getVehicleInfoRoundTrip
        : getVehicleInfo,
    variables:
      (step === VehiclePopupStep.INITIAL || step === VehiclePopupStep.AUTOMATIC_FORM) && backSailRefId
        ? variablesForRoundTripQuery
        : variablesForQuery,
    pause: !isVehicleQueryTriggered,
    requestPolicy: 'network-only',
  })

  const { data, error } = result

  const handleOnStepForward = (addStep): void => {
    if (addStep === VehiclePopupStep.INITIAL) {
      setVehicleQueryTriggered(true)
      return
    } else if (addStep === VehiclePopupStep.AUTOMATIC_FORM) {
      setAutoFilledVehicleAdding(true)
      setEnabled(false)
      return
    } else {
      setVehicleQueryTriggered(false)
    }
    if (addStep === VehiclePopupStep.MANUAL_FORM) {
      setManuallyFilledVehicleAdding(true)
      // setManualMode(true)
      // setVehicleQueryTriggered(true)
      setEnabled(false)
      return
    } else {
      setManualMode(false)
    }
    setStep((addStep = addStep + 1))
  }
  const handleOnStepBackward = (addStep): void => {
    setEnabled(true)
    setShowReservationError(false)
    if (addStep === VehiclePopupStep.AUTOMATIC_FORM) {
      setStep(VehiclePopupStep.INITIAL)
      setCompanyRegNumber('')
      setAutomaticModeData({
        companyRegistrationNumber: '',
        handicapped: false,
        priceCategoryTitle: '',
        price: 0,
      })
      setVehicleQueryTriggered(false)
      setAutoFilledVehicleAdding(false)
      setManuallyFilledVehicleAdding(false)
      return
    }
    if (addStep === VehiclePopupStep.MANUAL_FORM) {
      setSelectedTicket({ text: '', price: 0 })
      setManualMode(false)
    }
    setStep((addStep = addStep - 1))
  }

  const handleVehicleType = (type: string): void => {
    setManualModeData((prevState) => ({
      ...prevState,
      priceCategory: type,
    }))
  }
  const handleManualVehicleParameters = ({
    heightInCm,
    lengthInCm,
    widthInCm,
    weightInKg,
    companyRegNumber = undefined,
  }): void => {
    setManualModeData((prevState) => ({
      ...prevState,
      heightInCm,
      lengthInCm,
      widthInCm,
      weightInKg,
      companyRegistrationNumber: companyRegNumber,
    }))
  }

  const handleAutomaticVehicleParameters = ({
    companyRegistrationNumber,
    handicapped,
    priceCategoryTitle,
    price,
  }): void => {
    setAutomaticModeData((prevState) => ({
      ...prevState,
      companyRegistrationNumber,
      handicapped,
      priceCategoryTitle,
      price,
    }))
  }
  const vehicleSelectCallback = (manageVehicleNumbers): void => {
    if (isVehicleQueryTriggered) {
      if (step === VehiclePopupStep.INITIAL) {
        if (data?.calculateVehiclePrice || data?.calculateVehiclePriceForRoundtrip) {
          setStep(VehiclePopupStep.AUTOMATIC_FORM)
        } else if (
          error &&
          (error.graphQLErrors[0]?.extensions?.code === VEHICLE_ERROR.VEHICLE_INFO_NOT_FOUND_IN_REGISTRY.code ||
            error.graphQLErrors[0]?.extensions?.code === VEHICLE_ERROR.VEHICLE_REGISTER_FAILURE.code)
        ) {
          if (error.graphQLErrors[0]?.extensions?.code === VEHICLE_ERROR.VEHICLE_REGISTER_FAILURE.code) {
            setCompanyInputShownForManualMode(true)
          }
          setStep(VehiclePopupStep.SELECT_TYPE)
        }
      }
      /*else if (step == VehiclePopupStep.MANUAL_FORM) {
        if (data?.calculateVehiclePrice || data?.calculateVehiclePriceForRoundtrip) {
          manageVehicleNumbers(vehicleNumber, type, {
            manual: {
              ...manualModeData,
              price: data?.calculateVehiclePrice
                ? data?.calculateVehiclePrice.price.price
                : data?.calculateVehiclePriceForRoundtrip.price.price,
            },
          })
          setMutationLoading(true)
        } else if (
          error &&
          error.graphQLErrors[0]?.extensions?.code === VEHICLE_ERROR.VEHICLE_INFO_NOT_FOUND_IN_REGISTRY.code
        ) {
          setStep(VehiclePopupStep.SELECT_TYPE)
        }
      }*/
    }
    if (!isVehicleQueryTriggered && step === VehiclePopupStep.AUTOMATIC_FORM && isAutoFilledVehicleAdding) {
      if (data?.calculateVehiclePrice || data?.calculateVehiclePriceForRoundtrip) {
        manageVehicleNumbers(vehicleNumber, type, { automatic: { ...automaticModeData } })
        setMutationLoading(true)
      } else if (error) {
        setEnabled(true)
      }
    }
    if (!isVehicleQueryTriggered && step == VehiclePopupStep.MANUAL_FORM && isManuallyFilledVehicleAdding) {
      if (data?.calculateVehiclePrice || data?.calculateVehiclePriceForRoundtrip) {
        manageVehicleNumbers(vehicleNumber, type, {
          manual: {
            ...manualModeData,
            price: data?.calculateVehiclePrice
              ? data?.calculateVehiclePrice.price.price
              : data?.calculateVehiclePriceForRoundtrip.price.price,
          },
        })
        setMutationLoading(true)
      } else if (
        error &&
        error.graphQLErrors[0]?.extensions?.code === VEHICLE_ERROR.VEHICLE_INFO_NOT_FOUND_IN_REGISTRY.code
      ) {
        setStep(VehiclePopupStep.SELECT_TYPE)
      }
    }
    setVehicleQueryTriggered(false)
  }
  const vehicleRemoveCallback = (isVehicleRemoved: string): void => {
    if (isVehicleRemoved) {
      setStep(VehiclePopupStep.INITIAL)
      setVehicleNumber('')
      setVehicleQueryTriggered(false)
      setAutomaticModeData({
        companyRegistrationNumber: '',
        handicapped: false,
        priceCategoryTitle: '',
        price: 0,
      })
      setManualMode(false)
      setManualModeData({
        priceCategory: '',
        heightInCm: '',
        lengthInCm: '',
        widthInCm: '',
        weightInKg: '',
        companyRegistrationNumber: undefined,
      })
      setShowReservationError(false)
      setShowVehicleInfoError(false)
      setEnabled(true)
      setAutoFilledVehicleAdding(false)
      setManuallyFilledVehicleAdding(false)
      setLength(VehicleLength.MIN)
      setWeight(VehicleWeight.MIN)
    }
  }

  const handleReservationError = (reservationError: { message: string; flag: boolean }): void => {
    if (reservationError.flag) {
      setShowReservationError(true)
      setAutoFilledVehicleAdding(false)
      setManuallyFilledVehicleAdding(false)
    }
  }

  return {
    isEnabled,
    setEnabled,
    vehicleNumber,
    setVehicleNumber,
    length,
    setLength,
    weight,
    setWeight,
    companyRegNumber,
    setCompanyRegNumber,
    step,
    result,
    isManualMode,
    setManualMode,
    isVehicleQueryTriggered,
    setVehicleQueryTriggered,
    handleOnStepForward,
    handleOnStepBackward,
    handleVehicleType,
    handleManualVehicleParameters,
    handleAutomaticVehicleParameters,
    vehicleSelectCallback,
    vehicleRemoveCallback,
    showReservationError,
    handleReservationError,
    showVehicleInfoError,
    setShowVehicleInfoError,
    mutationLoading,
    setMutationLoading,
    isAutoFilledVehicleAdding,
    setAutoFilledVehicleAdding,
    isManuallyFilledVehicleAdding,
    setManuallyFilledVehicleAdding,
    isCompanyInputShownForManualMode,
  }
}
