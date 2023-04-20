import { CombinedError, useQuery } from 'urql'
import getVehicleInfo from '@gql/getVehicleData.graphql'
import getVehicleInfoRoundTrip from '@gql/getVehicleDataRoundtrip.graphql'
import TICKET_TYPE from '@const/ticketTypes'
import { Dispatch, useState } from 'react'
import VEHICLE_ERROR from '@const/vehicleErrorCodes'

interface Result {
  vehicleRemoveCallback: (isVehicleRemoved: string) => void
  vehicleSelectCallback: (manageVehicleNumbers) => void
  handleAutomaticVehicleParameters: ({ companyRegistrationNumber, handicapped, priceCategoryTitle }) => void
  handleManualVehicleParameters: ({ height, lengthInCm, width, weightInKg }) => void
  handleVehicleType: (type: string) => void
  handleOnStepBackward: (addStep: number) => void
  handleOnStepForward: (addStep: number) => void
  isManualMode: boolean
  isVehicleQueryTriggered: boolean
  result: {
    data?
    fetching: boolean
    error?: CombinedError
  }
  step: number
  vehicleNumber: string
  setVehicleNumber: Dispatch<string>
  companyRegNumber: string
  setCompanyRegNumber: Dispatch<string>
  isEnabled: boolean
  handleReservationError: (reservationError: { message: string; flag: boolean }) => void
  showReservationError: boolean
  showVehicleInfoError: boolean
  setShowVehicleInfoError: Dispatch<boolean>
  mutationLoading: boolean
  setMutationLoading: Dispatch<boolean>
}

export function useVehicleOperations(
  type: string,
  route: string,
  sailRefId: number,
  backSailRefId: number | undefined,
  reservationId: number,
  isRoundTrip: boolean
): Result {
  const [vehicleNumber, setVehicleNumber] = useState('')
  const [step, setStep] = useState(0)
  const [isVehicleQueryTriggered, setVehicleQueryTriggered] = useState(false)
  const [isManualMode, setManualMode] = useState(false)
  const [manualModeData, setManualModeData] = useState({
    priceCategory: '',
    height: '',
    lengthInCm: '',
    width: '',
    weightInKg: '',
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

  const { priceCategory, height, lengthInCm, width, weightInKg } = manualModeData
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
            height: height,
            lengthInCm: lengthInCm,
            width: width,
            weightInKg: weightInKg,
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
  const [result] = useQuery({
    query: (step === 0 || step === 3) && backSailRefId ? getVehicleInfoRoundTrip : getVehicleInfo,
    variables: (step === 0 || step === 3) && backSailRefId ? variablesForRoundTripQuery : variablesForQuery,
    pause: !isVehicleQueryTriggered,
    requestPolicy: 'network-only',
  })

  const { data, error } = result

  const handleOnStepForward = (addStep): void => {
    if (addStep === 0) {
      setVehicleQueryTriggered(true)
      return
    } else if (addStep === 3) {
      setVehicleQueryTriggered(true)
      setEnabled(false)
      return
    } else {
      setVehicleQueryTriggered(false)
    }
    if (addStep === 2) {
      setManualMode(true)
      setVehicleQueryTriggered(true)
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
    if (addStep === 3) {
      setStep(0)
      setAutomaticModeData({
        companyRegistrationNumber: '',
        handicapped: false,
        priceCategoryTitle: '',
        price: 0,
      })
      setVehicleQueryTriggered(false)
      return
    }
    if (addStep === 2) {
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
  const handleManualVehicleParameters = ({ height, lengthInCm, width, weightInKg }): void => {
    setManualModeData((prevState) => ({
      ...prevState,
      height,
      lengthInCm,
      width,
      weightInKg,
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
      if (step === 0) {
        if (data?.calculateVehiclePrice || data?.calculateVehiclePriceForRoundtrip) {
          setStep(3)
        } else if (
          error &&
          error.graphQLErrors[0]?.extensions?.code === VEHICLE_ERROR.VEHICLE_INFO_NOT_FOUND_IN_REGISTRY.code
        ) {
          setStep(1)
        }
      } else if (step === 3) {
        if (data?.calculateVehiclePrice || data?.calculateVehiclePriceForRoundtrip) {
          manageVehicleNumbers(vehicleNumber, type, { automatic: { ...automaticModeData } })
          setMutationLoading(true)
        } else if (error) {
          setEnabled(true)
        }
      } else if (step == 2) {
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
          setStep(1)
        }
      }
    }
    setVehicleQueryTriggered(false)
  }
  const vehicleRemoveCallback = (isVehicleRemoved: string): void => {
    if (isVehicleRemoved) {
      setStep(0)
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
        height: '',
        lengthInCm: '',
        width: '',
        weightInKg: '',
      })
      setShowReservationError(false)
      setShowVehicleInfoError(false)
      setEnabled(true)
    }
  }

  const handleReservationError = (reservationError: { message: string; flag: boolean }): void => {
    if (reservationError.flag) {
      setShowReservationError(true)
    }
  }

  return {
    isEnabled,
    vehicleNumber,
    setVehicleNumber,
    companyRegNumber,
    setCompanyRegNumber,
    step,
    result,
    isManualMode,
    isVehicleQueryTriggered,
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
  }
}
