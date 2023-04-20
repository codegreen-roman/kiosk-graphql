import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AddVehiclePopupProps } from '@components/AddVehiclePopup'
import { Box, CircularProgress, Dialog } from '@material-ui/core'
import { Icon } from '@components/Icon'
import { ModalWrapper, CloseModal, CloseIconHolder, DisablingLayer } from './AddVehiclePopupStyles'
import InsertVehicleNumber from './InsertVehicleNumber'
import ChooseTicketType from './ChooseTicketType'
import PickOptions from './PickOptions'
import AutoFilledOptions from './AutoFilledOptions'
import StepTitle from './StepTitle'
import StepPanel from './StepPanel'
import { InternalKeyboardPrimary } from '@components/InternalKeyboardPrimary'
import { asMoneyString, variableToString } from '@utils/formatters'
import TICKET_TYPE from '@const/ticketTypes'
import { useVehicleOperations } from './useVehicleAddition'

const AddVehiclePopup: FC<AddVehiclePopupProps> = ({
  dataForVehicleQuery,
  open,
  handleOnClose,
  manageVehicleNumbers,
  chosenVehicleTicketIdx,
  setChosenVehicleTicketIdx,
  tickets,
  selectedTicket,
  isVehicleRemoved,
  reservationError,
  timeOfDeparture,
  isVehicleAddedToReservation,
}) => {
  const { t } = useTranslation()
  const { type, route, sailRefId, reservationId, isRoundTrip, backSailRefId } = dataForVehicleQuery
  const {
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
  } = useVehicleOperations(type, route, sailRefId, backSailRefId, reservationId, isRoundTrip)

  // TODO Keyboard for 2 inputs logic will be refactored into separate file
  const [inputs, setInputs] = useState({})
  const [inputName, setInputName] = useState('default')

  const getInputValue = (inputName): string => {
    if (inputName === variableToString({ vehicleNumber })) {
      setVehicleNumber(inputs[inputName])
    } else if (inputName === variableToString({ companyRegNumber })) {
      setCompanyRegNumber(inputs[inputName])
    }
    return inputs[inputName] || ''
  }
  const { data, fetching, error } = result

  useEffect(() => {
    if (step === 0) {
      setInputName(variableToString({ vehicleNumber }))
    } else if (step === 3) {
      setInputName(variableToString({ companyRegNumber }))
    }
  }, [step])

  useEffect(() => {
    vehicleSelectCallback(manageVehicleNumbers)
  }, [data])
  useEffect(() => {
    setShowVehicleInfoError(true)
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
              display-if={step === 0}
              step={0}
              price={totalPrice}
              title={
                type && type === TICKET_TYPE.TRAILER
                  ? t('Input your trailer plate number')
                  : t('Input your vehicle plate number')
              }
              number={vehicleNumber}
            />

            <StepTitle
              display-if={step === 1}
              step={1}
              price={totalPrice}
              title={
                type && type === TICKET_TYPE.TRAILER
                  ? t('Choose appropriate trailer type')
                  : t('Choose appropriate vehicle type')
              }
              number={vehicleNumber}
            />

            <StepTitle
              display-if={step === 2}
              step={2}
              price={totalPrice}
              title={
                type && type === TICKET_TYPE.TRAILER
                  ? t('Input required data, pick trailer necessary options')
                  : t('Input required data, pick vehicle necessary options')
              }
              number={vehicleNumber}
            />

            <StepTitle
              display-if={step === 3}
              step={3}
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
            <Box paddingY="15px">
              <InsertVehicleNumber
                display-if={step === 0}
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
              />
              <ChooseTicketType
                display-if={step === 1}
                tickets={tickets}
                chosenVehicleTicketIdx={chosenVehicleTicketIdx}
                setChosenVehicleTicketIdx={setChosenVehicleTicketIdx}
                setChosenType={handleVehicleType}
              />

              <PickOptions
                display-if={step === 2}
                isTriggeredToGetParameters={isManualMode}
                getVehicleParameters={handleManualVehicleParameters}
                reservationErrorObject={{ reservationError, showReservationError }}
                mutationLoading={fetching || mutationLoading}
                timeOfDeparture={timeOfDeparture}
              />

              <AutoFilledOptions
                companyRegNumber={companyRegNumber}
                isTriggeredToGetParameters={isVehicleQueryTriggered}
                getVehicleParameters={handleAutomaticVehicleParameters}
                display-if={step === 3}
                data={data?.calculateVehiclePrice || data?.calculateVehiclePriceForRoundtrip}
                error={!fetching && error && { message: error.message, code: error.graphQLErrors[0].extensions.code }}
                reservationErrorObject={{ reservationError, showReservationError }}
                mutationLoading={fetching || mutationLoading}
                getValue={getInputValue}
              />
            </Box>
            {fetching && step < 2 && (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%" py={4}>
                <CircularProgress />
              </Box>
            )}
            <StepPanel
              display-if={!fetching || (fetching && step >= 2)}
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
      <DisablingLayer display-if={step === 0 || step === 3} loading={fetching || mutationLoading ? 'true' : undefined}>
        <Box visibility={step === 0 || step === 3 ? 'visible' : 'hidden'}>
          <InternalKeyboardPrimary
            setInputs={setInputs}
            inputName={inputName}
            enterIsEnabled={false}
            mainPadIsEnabled={true}
            enterIsShown={false}
          />
        </Box>
      </DisablingLayer>
    </Dialog>
  )
}

export default AddVehiclePopup
