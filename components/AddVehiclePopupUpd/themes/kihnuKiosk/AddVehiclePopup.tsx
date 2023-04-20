import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AddVehiclePopupProps } from '@components/AddVehiclePopupUpd'
import { Box, Dialog } from '@material-ui/core'
import { Icon } from '@components/Icon'
import { ModalWrapper, CloseModal, CloseIconHolder, DisablingLayer } from './AddVehiclePopupStyles'
import InsertVehicleNumber from './InsertVehicleNumber'
import { companyRegNumberTriggerLength, VehicleLength, VehicleWeight } from '@interfaces/boraCore'
import ChooseTicketType from './ChooseTicketType'
import PickOptions from './PickOptions'
import AutoFilledOptions from './AutoFilledOptions'
import StepTitle from './StepTitle'
import StepPanel from './StepPanel'
import { InternalKeyboardPrimary } from '@components/InternalKeyboardPrimary'
import { asMoneyString, variableToString } from '@utils/formatters'
import TICKET_TYPE from '@const/ticketTypes'
import { useVehicleOperations } from './useVehicleAddition'
import { usePreviousType } from '../../../../hooks/usePrevious'
import VEHICLE_ERROR from '@const/vehicleErrorCodes'
import { VehiclePopupStep } from '@interfaces/popupStatus'
import { useHotkeys } from 'react-hotkeys-hook'
import { AppStateTypes, useAppState } from '../../../../hooks/useAppState'

const AddVehiclePopup: FC<AddVehiclePopupProps> = ({
  dataForVehicleQuery,
  open,
  handleOnClose,
  manageVehicleNumbers,
  chosenVehicleTicketIdx,
  setChosenVehicleTicketIdx,
  tickets,
  selectedTicket,
  setSelectedTicket,
  isVehicleRemoved,
  reservationError,
  timeOfDeparture,
  isVehicleAddedToReservation,
}) => {
  const { t } = useTranslation()
  const { type, route, sailRefId, reservationId, isRoundTrip, backSailRefId } = dataForVehicleQuery
  const {
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
  } = useVehicleOperations(type, route, sailRefId, backSailRefId, reservationId, isRoundTrip, setSelectedTicket)
  const prevCompanyRegNumber = usePreviousType(companyRegNumber)
  // TODO Keyboard for 2 inputs logic will be refactored into separate file
  const [inputs, setInputs] = useState({})
  const [inputName, setInputName] = useState('default')
  const startGettingManualAdditionalVehicleParameters = (flag: boolean): void => {
    setManualMode(flag)
    setVehicleQueryTriggered(flag)
    setEnabled(!flag)
  }
  const getInputValue = (inputName): string => {
    if (inputName === variableToString({ vehicleNumber })) {
      setVehicleNumber(inputs[inputName])
    } else if (inputName === variableToString({ companyRegNumber })) {
      setCompanyRegNumber(inputs[inputName])
    } else if (inputName === variableToString({ length })) {
      setLength(Number(inputs[inputName]))
    } else if (inputName === variableToString({ weight })) {
      setWeight(Number(inputs[inputName]))
    }
    return inputs[inputName] || ''
  }
  const { data, fetching, error } = result

  const setLengthCallback = (value: number, reset?: boolean): void => {
    setLength(value)
    if (reset) {
      setInputs((prevState) => ({ ...prevState, length: '' }))
    } else {
      setInputs((prevState) => ({ ...prevState, length: value.toString() }))
    }
  }
  const setWeightCallback = (value: number, reset?: boolean): void => {
    setWeight(value)
    if (reset) {
      setInputs((prevState) => ({ ...prevState, weight: '' }))
    } else {
      setInputs((prevState) => ({ ...prevState, weight: value.toString() }))
    }
  }

  const startGettingAdditionalVehicleParameters = (flag: boolean): void => {
    setVehicleQueryTriggered(flag)
  }

  const { dispatch } = useAppState()

  useHotkeys('ctrl+shift+f', () => {
    dispatch({ type: AppStateTypes.cursorEnable, payload: true })
  })

  useEffect(() => {
    if (step === VehiclePopupStep.INITIAL) {
      setInputName(variableToString({ vehicleNumber }))
      setInputs((prevState) => ({ ...prevState, companyRegNumber: '' }))
    } else if (step === VehiclePopupStep.AUTOMATIC_FORM) {
      setInputName(variableToString({ companyRegNumber }))
    }
  }, [step])

  useEffect(() => {
    if (!isAutoFilledVehicleAdding || !isManuallyFilledVehicleAdding) {
      vehicleSelectCallback(manageVehicleNumbers)
    }
  }, [data, isAutoFilledVehicleAdding, isManuallyFilledVehicleAdding])

  useEffect(() => {
    if (isAutoFilledVehicleAdding || isManuallyFilledVehicleAdding) {
      vehicleSelectCallback(manageVehicleNumbers)
    }
  }, [isAutoFilledVehicleAdding, isManuallyFilledVehicleAdding])

  useEffect(() => {
    if (companyRegNumber && prevCompanyRegNumber !== companyRegNumber) {
      if (companyRegNumber.length === companyRegNumberTriggerLength) {
        if (isCompanyInputShownForManualMode) {
          setManualMode(true)
        }
        setVehicleQueryTriggered(true)
      } else if (companyRegNumber.length !== companyRegNumberTriggerLength) {
        if (isCompanyInputShownForManualMode) {
          setManualMode(false)
        }
        setVehicleQueryTriggered(false)
      }
    } else if (prevCompanyRegNumber && prevCompanyRegNumber.length === 1 && companyRegNumber.length === 0) {
      if (isCompanyInputShownForManualMode) {
        setManualMode(true)
      }
      setVehicleQueryTriggered(true)
    } else if (companyRegNumber && companyRegNumber === prevCompanyRegNumber) {
      if (isCompanyInputShownForManualMode) {
        setManualMode(false)
      }
      setVehicleQueryTriggered(false)
    }
  }, [companyRegNumber])

  useEffect(() => {
    if (companyRegNumber) {
      if (companyRegNumber.length < companyRegNumberTriggerLength) {
        setEnabled(false)
      } else if (companyRegNumber.length >= companyRegNumberTriggerLength + 1) {
        setEnabled(false)
      } else if (companyRegNumber.length === companyRegNumberTriggerLength && !fetching && !error) {
        setEnabled(true)
      } else if (
        (companyRegNumber.length === companyRegNumberTriggerLength && fetching) ||
        (companyRegNumber.length === companyRegNumberTriggerLength &&
          !fetching &&
          error &&
          error.graphQLErrors[0].extensions.code === VEHICLE_ERROR.COMPANY_NOT_FOUND_IN_EBUSINESS_REGISTER.code)
      ) {
        setEnabled(false)
      }
    } else {
      setEnabled(true)
    }
  }, [companyRegNumber, fetching, error])
  useEffect(() => {
    if (
      (isNaN(length) && isNaN(weight)) ||
      (isNaN(length) && !isNaN(weight)) ||
      (!isNaN(length) && isNaN(weight)) ||
      length < VehicleLength.MIN ||
      length > VehicleLength.MAX ||
      weight < VehicleWeight.MIN ||
      weight > VehicleWeight.MAX ||
      (length < VehicleLength.MIN && weight < VehicleWeight.MIN) ||
      (length < VehicleLength.MIN && weight > VehicleWeight.MAX) ||
      (length > VehicleLength.MAX && weight < VehicleWeight.MIN) ||
      (length > VehicleLength.MAX && weight > VehicleWeight.MAX)
    ) {
      setEnabled(false)
    } else {
      setEnabled(true)
    }
  }, [length, weight])

  useEffect(() => {
    setShowVehicleInfoError(true)
    setAutoFilledVehicleAdding(false)
    setManuallyFilledVehicleAdding(false)
  }, [error])

  useEffect(() => {
    if (open && isVehicleRemoved) {
      setInputs({})
      vehicleRemoveCallback(isVehicleRemoved)
    }
  }, [isVehicleRemoved, open])

  useEffect(() => {
    setMutationLoading(false)
    if (reservationError.flag) {
      handleReservationError(reservationError)
      return
    }
  }, [reservationError])

  useEffect(() => {
    if (isVehicleAddedToReservation) {
      handleOnClose()
    }
  }, [isVehicleAddedToReservation])

  const totalPrice = selectedTicket ? asMoneyString(selectedTicket.price * 0.01) : '0.00'

  return (
    <Dialog
      open={open}
      onClose={handleOnClose}
      disableBackdropClick={true}
      maxWidth="xl"
      PaperProps={{
        style: {
          overflow: 'unset',
          background: 'none',
          boxShadow: 'unset',
          alignItems: 'center',
        },
      }}
    >
      <Box position="relative">
        <CloseModal
          onClick={(): void => {
            handleOnClose()
            setInputs({})
            setTimeout(() => vehicleRemoveCallback(type), 100)
          }}
        >
          <CloseIconHolder as={Icon['close']} />
        </CloseModal>
        <ModalWrapper>
          <Box display="flex" flexDirection="column" width="100%" overflow="hidden">
            <StepTitle
              display-if={step === VehiclePopupStep.INITIAL}
              step={VehiclePopupStep.INITIAL}
              price={totalPrice}
              title={
                type && type === TICKET_TYPE.TRAILER
                  ? t('Input your trailer plate number')
                  : t('Input your vehicle plate number')
              }
              number={vehicleNumber}
              vehicleNumber={vehicleNumber}
              getValue={getInputValue}
            />

            <StepTitle
              display-if={step === VehiclePopupStep.SELECT_TYPE}
              step={VehiclePopupStep.SELECT_TYPE}
              price={totalPrice}
              title={
                type && type === TICKET_TYPE.TRAILER
                  ? t('Choose appropriate trailer type')
                  : t('Choose appropriate vehicle type')
              }
              number={vehicleNumber}
            />

            <StepTitle
              display-if={step === VehiclePopupStep.MANUAL_FORM}
              step={VehiclePopupStep.MANUAL_FORM}
              price={
                (!error &&
                  asMoneyString(
                    data?.calculateVehiclePrice
                      ? data?.calculateVehiclePrice.price?.price * 0.01
                      : data?.calculateVehiclePriceForRoundtrip.price?.price * 0.01
                  )) ||
                totalPrice
              }
              title={
                type && type === TICKET_TYPE.TRAILER
                  ? t('Input required data, pick trailer necessary options')
                  : t('Input required data, pick vehicle necessary options')
              }
              number={vehicleNumber}
            />

            <StepTitle
              display-if={step === VehiclePopupStep.AUTOMATIC_FORM}
              step={VehiclePopupStep.AUTOMATIC_FORM}
              price={
                (!error &&
                  asMoneyString(
                    data?.calculateVehiclePrice
                      ? data?.calculateVehiclePrice.price?.price * 0.01
                      : data?.calculateVehiclePriceForRoundtrip.price?.price * 0.01
                  )) ||
                totalPrice
              }
              title={
                type && type === TICKET_TYPE.TRAILER
                  ? t('Pick necessary trailer options')
                  : t('Pick necessary vehicle options')
              }
              number={vehicleNumber}
            />
            <Box paddingY="20px">
              <InsertVehicleNumber
                display-if={step === VehiclePopupStep.INITIAL}
                placeholder={t('License plate number')}
                warning={t('No tickets available')}
                description={t('Estonian Transportation Dapartment data')}
                vehicleNumber={vehicleNumber}
                error={
                  !fetching &&
                  showVehicleInfoError &&
                  error && { message: error.message, code: error.graphQLErrors[0].extensions.code }
                }
                getValue={getInputValue}
                type={type}
                fetching={fetching}
              />
              <ChooseTicketType
                display-if={step === VehiclePopupStep.SELECT_TYPE}
                tickets={tickets}
                setChosenVehicleTicketIdx={setChosenVehicleTicketIdx}
                setChosenType={handleVehicleType}
                handleOnStepForward={(): void => handleOnStepForward(step)}
              />

              <PickOptions
                display-if={step === VehiclePopupStep.MANUAL_FORM}
                isTriggeredToGetParameters={isManualMode}
                data={data?.calculateVehiclePrice || data?.calculateVehiclePriceForRoundtrip}
                getAdditionalVehicleParameters={startGettingManualAdditionalVehicleParameters}
                getVehicleParameters={handleManualVehicleParameters}
                reservationErrorObject={{ reservationError, showReservationError }}
                mutationLoading={fetching || mutationLoading}
                timeOfDeparture={timeOfDeparture}
                length={length}
                setLengthCallback={setLengthCallback}
                weight={weight}
                setWeightCallback={setWeightCallback}
                getValue={getInputValue}
                setInputName={setInputName}
                isCompanyDiscount={isCompanyInputShownForManualMode}
                companyRegNumber={companyRegNumber}
              />

              <AutoFilledOptions
                type={type}
                companyRegNumber={companyRegNumber}
                isTriggeredToGetParameters={isVehicleQueryTriggered}
                getAdditionalVehicleParameters={startGettingAdditionalVehicleParameters}
                getVehicleParameters={handleAutomaticVehicleParameters}
                display-if={step === VehiclePopupStep.AUTOMATIC_FORM}
                data={data?.calculateVehiclePrice || data?.calculateVehiclePriceForRoundtrip}
                error={!fetching && error && { message: error.message, code: error.graphQLErrors[0].extensions.code }}
                reservationErrorObject={{ reservationError, showReservationError }}
                mutationLoading={fetching || mutationLoading}
                getValue={getInputValue}
              />
            </Box>
            <StepPanel
              display-if={!fetching || (fetching && step >= VehiclePopupStep.MANUAL_FORM)}
              step={step}
              isNumber={vehicleNumber}
              choosenVehicleTicketIdx={chosenVehicleTicketIdx}
              handleOnStepForward={(): void => handleOnStepForward(step)}
              handleOnStepBackward={(): void => handleOnStepBackward(step)}
              handleOnClose={handleOnClose}
              isEnabled={isEnabled}
            />
          </Box>
        </ModalWrapper>
      </Box>
      <DisablingLayer
        loading={fetching || mutationLoading || step === VehiclePopupStep.SELECT_TYPE ? 'true' : undefined}
      >
        <Box>
          <InternalKeyboardPrimary
            setInputs={setInputs}
            inputName={inputName}
            enterIsEnabled={vehicleNumber && vehicleNumber.length >= VehiclePopupStep.MANUAL_FORM}
            mainPadIsEnabled={step !== VehiclePopupStep.MANUAL_FORM}
            enterIsShown={step === VehiclePopupStep.INITIAL}
            onEnter={(): void => handleOnStepForward(step)}
            shouldRemoveInput={companyRegNumber === '' && companyRegNumber !== prevCompanyRegNumber}
          />
        </Box>
      </DisablingLayer>
    </Dialog>
  )
}

export default AddVehiclePopup
