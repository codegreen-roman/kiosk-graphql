import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { Box, CircularProgress, FormControlLabel, RadioGroup } from '@material-ui/core'
import Radio, { RadioProps } from '@material-ui/core/Radio'
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox'
import { Icon } from '@components/Icon'
import {
  CheckboxLabel,
  Circle,
  CompanyInputButton,
  CompanyOutlinedInput,
  Description,
  FormLabel,
  InputLabel,
  RadioLabel,
  SizeBlock,
  Subtitle,
  SvgIconHolder,
  useCheckboxStyles,
  useRadioStyles,
  VehicleOutlinedInput,
  WheelchairIconHolder,
} from './PickOptionsStyled'
import { PortsToCheckDate, VehicleHeight, VehicleWidth } from '@interfaces/boraCore'
import { RohDateBoundaries, SviDateBoundaries } from '@const/vehicleCoefficients'
// import { Terms } from '@components/Terms'
import { WarningMessage } from '@components/AddVehiclePopup/themes/kihnuKiosk/AutoFilledOptionsStyles'
import VEHICLE_ERROR from '@const/vehicleErrorCodes'
import ATTRIBUTES from '@const/attributes'
import { useAppState } from '../../../../hooks/useAppState'
import { Terms } from '@components/Terms'
import { convertTermsManual } from '@components/AddVehiclePopup/themes/kihnuKiosk/helpers'
import { TimeOfDepartureOneWay, TimeOfDepartureRoundTrip } from '@components/AddVehiclePopup'

const StyledRadio: FC<RadioProps> = (props: RadioProps) => {
  const classes = useRadioStyles()

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  )
}

const StyledCheckbox: FC<CheckboxProps> = () => {
  const classes = useCheckboxStyles()

  return (
    <Checkbox
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
    />
  )
}

interface PickOptionsProps {
  isTriggeredToGetParameters: boolean
  getVehicleParameters: ({ height, lengthInCm, width, weightInKg }) => void
  reservationErrorObject: {
    reservationError: {
      flag: boolean
      message: string
      code: string
    }
    showReservationError: boolean
  }
  mutationLoading: boolean
  timeOfDeparture: TimeOfDepartureOneWay | TimeOfDepartureRoundTrip
}

const PickOptions: FC<PickOptionsProps> = ({
  isTriggeredToGetParameters,
  getVehicleParameters,
  reservationErrorObject,
  mutationLoading,
  timeOfDeparture,
}) => {
  const { t, i18n } = useTranslation()
  const { state } = useAppState()
  const isInvalidDiscount = false
  const isCompanyDiscount = false
  const currentLanguage = i18n.language.toUpperCase()
  const coefficientsFromAttributes = state?.sailPackages[0]?.route?.attributes?.filter(
    (item) =>
      item.code.includes(`${ATTRIBUTES.KIOSK_COEFFICIENTS_PREFIX}${state.route.code}`) &&
      item.code.endsWith(`_${currentLanguage}`)
  )
  const [width, setWidth] = useState({ value: VehicleWidth.LESS_THAN_200, textValue: t('less than 2m') })
  const [height, setHeight] = useState({ value: VehicleHeight.LESS_THAN_400, textValue: t('less than 4m') })
  const [length, setLength] = useState(5)
  const [weight, setWeight] = useState(2)

  const [companyRegNumber, setCompanyRegNumber] = useState('')

  const { reservationError, showReservationError } = reservationErrorObject

  const handleOnWidthChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const valueEnum: VehicleWidth = VehicleWidth[(event.target as HTMLInputElement).value]
    const textValue = (event.target as HTMLInputElement).name
    setWidth((prevState) => ({
      ...prevState,
      value: valueEnum,
      textValue: textValue,
    }))
  }

  const handleOnHeightChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const valueEnum: VehicleHeight = VehicleHeight[(event.target as HTMLInputElement).value]
    const textValue = (event.target as HTMLInputElement).name
    setHeight((prevState) => ({
      ...prevState,
      value: valueEnum,
      textValue: textValue,
    }))
  }

  const handleOnCompanyRegNumberType = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setCompanyRegNumber((event.target as HTMLInputElement).value)
  }

  const onCompanyRegNumberSave = (): void => {
    setCompanyRegNumber(companyRegNumber)
  }

  const onLengthDecrease = (): void => {
    length > 5 ? setLength(length - 1) : null
  }

  const onLengthIncrease = (): void => {
    length < 30 ? setLength(length + 1) : null
  }

  const onWeightDecrease = (): void => {
    weight > 2 ? setWeight(weight - 1) : null
  }

  const onWeightIncrease = (): void => {
    weight < 70 ? setWeight(weight + 1) : null
  }

  useEffect(() => {
    if (isTriggeredToGetParameters) {
      getVehicleParameters({
        height: height.value,
        lengthInCm: length * 100,
        width: width.value,
        weightInKg: weight * 1000,
      })
    }
  }, [isTriggeredToGetParameters])

  const terms = convertTermsManual({
    attributes: coefficientsFromAttributes,
    width: width.value,
    height: height.value,
    currentPort: state.port,
    departureTime: timeOfDeparture,
    departurePortPrimary: {
      port: PortsToCheckDate.ROH,
      dayOfWeek: RohDateBoundaries.dayOfWeek,
      hour: RohDateBoundaries.hour,
      dayPrefix: RohDateBoundaries.dayPrefix,
    },
    departurePortSecondary: {
      port: PortsToCheckDate.SVI,
      dayOfWeek: SviDateBoundaries.dayOfWeek,
      hour: SviDateBoundaries.hour,
      dayPrefix: SviDateBoundaries.dayPrefix,
    },
  })

  return (
    <Box display="flex" flexDirection="row" alignItems="center" width="100%" height="100%" padding="0 10px">
      <Box display="flex" flexDirection="column" flexBasis="70%" height="100%" justifyContent="space-around">
        <Box display="flex" flexDirection="row" justifyContent="space-around">
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="center" padding="15px 0 5px">
              <FormLabel>{t('Width')}</FormLabel>
            </Box>
            <RadioGroup aria-label="autoType" name="autoType" value={width.value} onChange={handleOnWidthChange}>
              <FormControlLabel
                value={VehicleWidth.LESS_THAN_200}
                name={t('less than 2m')}
                control={<StyledRadio />}
                label={<RadioLabel>{t('less than 2m')}</RadioLabel>}
              />
              <FormControlLabel
                value={VehicleWidth.BETWEEN_200_AND_250}
                name={t('2m up to 2,5m')}
                control={<StyledRadio />}
                label={<RadioLabel>{t('2m up to 2,5m')}</RadioLabel>}
              />
              <FormControlLabel
                value={VehicleWidth.MORE_THAN_250}
                name={t('more than 2,5m')}
                control={<StyledRadio />}
                label={<RadioLabel>{t('more than 2,5m')}</RadioLabel>}
              />
            </RadioGroup>
          </Box>
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="center" padding="15px 0 5px">
              <FormLabel>{t('Height')}</FormLabel>
            </Box>
            <RadioGroup aria-label="autoType" name="autoType" value={height.value} onChange={handleOnHeightChange}>
              <FormControlLabel
                value={VehicleHeight.LESS_THAN_400}
                name={t('less than 4m')}
                control={<StyledRadio />}
                label={<RadioLabel>{t('less than 4m')}</RadioLabel>}
              />
              <FormControlLabel
                value={VehicleHeight.MORE_THAN_400}
                name={t('more than 4m')}
                control={<StyledRadio />}
                label={<RadioLabel>{t('more than 4m')}</RadioLabel>}
              />
            </RadioGroup>
          </Box>
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="center" padding="15px 0">
              <FormLabel>{t('Length')}</FormLabel>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Circle onClick={(): void => onLengthDecrease()}>
                <SvgIconHolder as={Icon['minus']} />
              </Circle>
              <VehicleOutlinedInput placeholder={'0'} value={length} />
              <Circle onClick={(): void => onLengthIncrease()}>
                <SvgIconHolder as={Icon['plus']} />
              </Circle>
            </Box>
            <Box display="flex" justifyContent="center" paddingTop="10px">
              <Subtitle>{t('min 5m / max 30m')}</Subtitle>
            </Box>
          </Box>
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="center" padding="15px 0">
              <FormLabel>{t('Weight')}</FormLabel>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Circle onClick={(): void => onWeightDecrease()}>
                <SvgIconHolder as={Icon['minus']} />
              </Circle>
              <VehicleOutlinedInput placeholder={'0'} value={weight} />
              <Circle onClick={(): void => onWeightIncrease()}>
                <SvgIconHolder as={Icon['plus']} />
              </Circle>
            </Box>
            <Box display="flex" justifyContent="center" paddingTop="10px">
              <Subtitle>{t('min 2t / max 70t')}</Subtitle>
            </Box>
          </Box>
        </Box>
        <Box
          display-if={!isInvalidDiscount && !isCompanyDiscount}
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
          paddingTop="20px"
        >
          <SizeBlock>
            <p>{`${t('Width')}`}</p>
            <span>{`${width.textValue}`}</span>
          </SizeBlock>
          <SizeBlock>
            <p>{`${t('Height')}`}</p>
            <span>{`${height.textValue}`}</span>
          </SizeBlock>
          <SizeBlock>
            <p>{`${t('Length')}`}</p>
            <span>{`${length}000 ${t('mm')}`}</span>
          </SizeBlock>
          <SizeBlock>
            <p>{`${t('Weight')}`}</p>
            <span>{`${weight}000 ${t('kg')}`}</span>
          </SizeBlock>
        </Box>
        <Box display-if={isInvalidDiscount || isCompanyDiscount} display="flex" padding="0 35px" marginTop="10px">
          <Box display-if={isInvalidDiscount} display="flex" flexBasis="40%">
            <FormControlLabel
              style={{ display: 'flex', alignItems: 'flex-start' }}
              checked
              control={<StyledCheckbox />}
              label={
                <Box display="flex" paddingTop="5px">
                  <WheelchairIconHolder as={Icon['wheelchair']} />
                  <CheckboxLabel>{t('Sügava puudega isikut')}</CheckboxLabel>
                </Box>
              }
            />
          </Box>
          <Box display-if={isCompanyDiscount} display="flex" flexDirection="column" flexBasis="60%">
            <InputLabel>{`${t('If vehicle is owned by company')}:`}</InputLabel>
            <Box display="flex">
              <CompanyOutlinedInput
                placeholder={t('Vehicle owned by company placeholder')}
                value={companyRegNumber}
                onChange={handleOnCompanyRegNumberType}
              />
              <CompanyInputButton onClick={(): void => onCompanyRegNumberSave()}>
                {t('Check / save')}
              </CompanyInputButton>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" flexBasis="30%" justifyContent="space-between" height="100%">
        <Box display-if={isInvalidDiscount || isCompanyDiscount} display="flex" justifyContent="center">
          <Description>
            <div display-if={!isInvalidDiscount && !isCompanyDiscount}>
              <p>{`${t('Vehicle type')}`}</p>
              <span>M3</span>
            </div>
            <Box display="flex">
              <p>{`${t('Length')}`}</p>
              <span>{`${length}000 ${t('mm')}`}</span>
            </Box>
            <Box display="flex">
              <p>{`${t('Width')}`}</p>
              <span>{`${width}`}</span>
            </Box>
            <Box display="flex">
              <p>{`${t('Height')}`}</p>
              <span>{`${height}`}</span>
            </Box>
            <Box display="flex">
              <p>{`${t('Weight')}`}</p>
              <span>{`${weight}000 ${t('kg')}`}</span>
            </Box>
          </Description>
        </Box>
        {terms.length > 1 && <Terms terms={terms} />}
        {mutationLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%" py={1.5}>
            <CircularProgress />
          </Box>
        )}
        <Box
          display-if={reservationError.flag && showReservationError}
          display="flex"
          flexBasis="30%"
          justifyContent="center"
          height="100%"
          py={0.5}
        >
          <WarningMessage>
            <p>
              {VEHICLE_ERROR[reservationError.code]
                ? t(`${VEHICLE_ERROR[reservationError.code].message}`)
                : reservationError.message}
            </p>
          </WarningMessage>
        </Box>
      </Box>
    </Box>
  )
}

export default PickOptions
