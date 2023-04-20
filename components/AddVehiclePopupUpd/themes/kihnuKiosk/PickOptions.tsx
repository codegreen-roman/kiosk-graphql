import React, { Dispatch, FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { Box, CircularProgress, FormControlLabel, RadioGroup } from '@material-ui/core'
import Radio, { RadioProps } from '@material-ui/core/Radio'
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox'
import { Icon } from '@components/Icon'
import {
  CheckboxLabel,
  Circle,
  CompanyOutlinedInput,
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
import { VehicleLength, VehicleSizes, VehicleWeight } from '@interfaces/boraCore'
import { WarningMessage } from '@components/AddVehiclePopup/themes/kihnuKiosk/AutoFilledOptionsStyles'
import VEHICLE_ERROR from '@const/vehicleErrorCodes'
import ATTRIBUTES from '@const/attributes'
import { useAppState } from '../../../../hooks/useAppState'
import { Terms } from '@components/Terms'
import { convertTermsAutoFilled } from '@components/AddVehiclePopup/themes/kihnuKiosk/helpers'
import { TimeOfDepartureOneWay, TimeOfDepartureRoundTrip } from '@components/AddVehiclePopup'
import { variableToString } from '@utils/formatters'
import { usePreviousType } from '../../../../hooks/usePrevious'

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
  getVehicleParameters: ({ heightInCm, lengthInCm, widthInCm, weightInKg }) => void
  data: {
    price?: {
      price: number
      priceCategory: string
      priceCategorySubType: string
      priceCategoryTitle: string
      priceFormatted: string
      residentCompany: boolean
      coefficients?: Array<string>
    }
    vehicleInfo: {
      category: string
      heightInMm: number
      lengthInMm: number
      licensePlate: string
      weightInKg: number
      widthInMm: number
    }
  }
  reservationErrorObject: {
    reservationError: {
      flag: boolean
      message: string
      code: string
    }
    showReservationError: boolean
  }
  getAdditionalVehicleParameters: (flag: boolean) => void
  mutationLoading: boolean
  timeOfDeparture: TimeOfDepartureOneWay | TimeOfDepartureRoundTrip
  length: number
  setLengthCallback: (value: number, reset?: boolean) => void
  weight: number
  setWeightCallback: (value: number, reset?: boolean) => void
  setInputName: Dispatch<string>
  isCompanyDiscount: boolean
  getValue?: (inputName: string) => string
  companyRegNumber?: string
}

const PickOptions: FC<PickOptionsProps> = ({
  isTriggeredToGetParameters,
  data,
  getVehicleParameters,
  reservationErrorObject,
  getAdditionalVehicleParameters,
  mutationLoading,
  length,
  setLengthCallback,
  weight,
  setWeightCallback,
  isCompanyDiscount,
  setInputName,
  getValue,
  companyRegNumber,
}) => {
  const { t, i18n } = useTranslation()
  const { state } = useAppState()
  const isInvalidDiscount = false
  const currentLanguage = i18n.language.toUpperCase()

  const selectedDate = state?.selectedDate as Date

  const useContentBefore01march = Number(selectedDate) < Number(new Date('2022/03/01'))
  const predicate = (vehicleSize) => vehicleSize.code === state?.sailPackages[0]?.route?.code && useContentBefore01march
  const vehicleSizesForCurrentRoute =
    VehicleSizes.find(predicate) || VehicleSizes.find((vehicleSize) => vehicleSize.code === 'DEFAULT')

  const coefficientsFromAttributes = state?.sailPackages[0]?.route?.attributes?.filter(
    (item) =>
      item.code.includes(`${ATTRIBUTES.KIOSK_COEFFICIENTS_PREFIX}${state.route.code}`) &&
      (item.code.endsWith(`_${currentLanguage}`) || item.code.endsWith(`_${currentLanguage}_BEFORE_01.03.2022`))
  )
  const [width, setWidth] = useState({
    value: vehicleSizesForCurrentRoute.widthRange.less.value,
    textValue: t('less than 2m', { lessWidthValue: vehicleSizesForCurrentRoute.widthRange.less.border }),
  })
  const [height, setHeight] = useState({
    value: vehicleSizesForCurrentRoute.heightRange.less.value,
    textValue: t('less than 4m', { lessHeightValue: vehicleSizesForCurrentRoute.heightRange.less.border }),
  })
  const [isLengthFocused, setLengthFocused] = useState(false)
  const [isWeightFocused, setWeightFocused] = useState(false)

  // const [companyRegNumber, setCompanyRegNumber] = useState('')
  const [savedParameters, setSavedParameters] = useState({
    priceCategoryTitle: '',
    price: 0,
    coefficients: [],
  })
  const prevWeight = Number(usePreviousType(weight))
  const prevLength = Number(usePreviousType(length))

  const { reservationError, showReservationError } = reservationErrorObject

  const handleOnWidthChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // const valueEnum: VehicleWidth = VehicleWidth[(event.target as HTMLInputElement).value]
    const value = Number((event.target as HTMLInputElement).value)
    const textValue = (event.target as HTMLInputElement).name
    setWidth((prevState) => ({
      ...prevState,
      value,
      textValue: textValue,
    }))
    getAdditionalVehicleParameters(true)
  }

  const handleOnHeightChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // const valueEnum: VehicleHeight = VehicleHeight[(event.target as HTMLInputElement).value]
    const value = Number((event.target as HTMLInputElement).value)
    const textValue = (event.target as HTMLInputElement).name
    setHeight((prevState) => ({
      ...prevState,
      value,
      textValue: textValue,
    }))
    getAdditionalVehicleParameters(true)
  }

  // const handleOnCompanyRegNumberType = (event: React.ChangeEvent<HTMLInputElement>): void => {
  //   setCompanyRegNumber((event.target as HTMLInputElement).value)
  // }
  //
  // const onCompanyRegNumberSave = (): void => {
  //   setCompanyRegNumber(companyRegNumber)
  // }

  const onLengthDecrease = (): void => {
    if (isLengthFocused) {
      setLengthFocused(false)
    }
    length > VehicleLength.MIN ? setLengthCallback(length - 1) : null
  }

  const onLengthIncrease = (): void => {
    if (isLengthFocused) {
      setLengthFocused(false)
    }
    length < VehicleLength.MAX ? setLengthCallback(length + 1) : null
  }

  const onWeightDecrease = (): void => {
    if (isLengthFocused) {
      setLengthFocused(false)
    }
    if (isWeightFocused) {
      setWeightFocused(false)
    }
    weight > VehicleWeight.MIN ? setWeightCallback(weight - 1) : null
  }

  const onWeightIncrease = (): void => {
    if (isLengthFocused) {
      setLengthFocused(false)
    }
    if (isWeightFocused) {
      setWeightFocused(false)
    }
    weight < VehicleWeight.MAX ? setWeightCallback(weight + 1) : null
  }

  useEffect(() => {
    if (isTriggeredToGetParameters) {
      getVehicleParameters({
        heightInCm: height.value,
        lengthInCm: length * 100,
        widthInCm: width.value,
        weightInKg: weight * 1000,
        ...(isCompanyDiscount && { companyRegNumber }),
      })
    }
  }, [isTriggeredToGetParameters])

  useEffect(() => {
    if (!isNaN(weight) && weight > 0 && prevWeight !== weight) {
      getAdditionalVehicleParameters(true)
    }
  }, [weight, prevWeight])

  useEffect(() => {
    if (!isNaN(length) && length > 0 && prevLength !== length) {
      getAdditionalVehicleParameters(true)
    }
  }, [length, prevLength])

  useEffect(() => {
    if (data?.vehicleInfo) {
      getAdditionalVehicleParameters(false)
    }
    if (data?.price) {
      const { price } = data
      setSavedParameters((prevState) => ({
        ...prevState,
        priceCategoryTitle: price.priceCategoryTitle,
        price: price.price,
        coefficients: price.coefficients,
      }))
    }
  }, [data])

  const terms = convertTermsAutoFilled({
    attributes: coefficientsFromAttributes,
    coefficientsFromQuery: savedParameters.coefficients,
    currentLanguage,
    useContentBefore01march,
  })

  useEffect(() => {
    getAdditionalVehicleParameters(true)
    return (): void => {
      getAdditionalVehicleParameters(false)
    }
  }, [])

  // Will be deleted after successful testing
  /*const terms = convertTermsManual({
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
  })*/

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
                // value={VehicleWidth.LESS_THAN_200}
                value={vehicleSizesForCurrentRoute.widthRange.less.value}
                name={t('less than 2m', { lessWidthValue: vehicleSizesForCurrentRoute.widthRange.less.border })}
                control={<StyledRadio />}
                label={
                  <RadioLabel>
                    {t('less than 2m', { lessWidthValue: vehicleSizesForCurrentRoute.widthRange.less.border })}
                  </RadioLabel>
                }
              />
              <FormControlLabel
                value={vehicleSizesForCurrentRoute.widthRange.between.value}
                name={t('2m up to 2,5m', {
                  lessWidthValue: vehicleSizesForCurrentRoute.widthRange.less.border,
                  moreWidthValue: vehicleSizesForCurrentRoute.widthRange.more.border,
                })}
                control={<StyledRadio />}
                label={
                  <RadioLabel>
                    {t('2m up to 2,5m', {
                      lessWidthValue: vehicleSizesForCurrentRoute.widthRange.less.border,
                      moreWidthValue: vehicleSizesForCurrentRoute.widthRange.more.border,
                    })}
                  </RadioLabel>
                }
              />
              <FormControlLabel
                value={vehicleSizesForCurrentRoute.widthRange.more.value}
                name={t('more than 2,5m', { moreWidthValue: vehicleSizesForCurrentRoute.widthRange.more.border })}
                control={<StyledRadio />}
                label={
                  <RadioLabel>
                    {t('more than 2,5m', { moreWidthValue: vehicleSizesForCurrentRoute.widthRange.more.border })}
                  </RadioLabel>
                }
              />
            </RadioGroup>
          </Box>
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="center" padding="15px 0 5px">
              <FormLabel>{t('Height')}</FormLabel>
            </Box>
            <RadioGroup aria-label="autoType" name="autoType" value={height.value} onChange={handleOnHeightChange}>
              <FormControlLabel
                value={vehicleSizesForCurrentRoute.heightRange.less.value}
                name={t('less than 4m', { lessHeightValue: vehicleSizesForCurrentRoute.heightRange.less.border })}
                control={<StyledRadio />}
                label={
                  <RadioLabel>
                    {t('less than 4m', { lessHeightValue: vehicleSizesForCurrentRoute.heightRange.less.border })}
                  </RadioLabel>
                }
              />
              <FormControlLabel
                value={vehicleSizesForCurrentRoute.heightRange.more.value}
                name={t('more than 4m', { moreHeightValue: vehicleSizesForCurrentRoute.heightRange.more.border })}
                control={<StyledRadio />}
                label={
                  <RadioLabel>
                    {t('more than 4m', { moreHeightValue: vehicleSizesForCurrentRoute.heightRange.more.border })}
                  </RadioLabel>
                }
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
              <VehicleOutlinedInput
                placeholder={'0'}
                onFocus={(): void => {
                  setLengthFocused(true)
                  setWeightFocused(false)
                  setInputName(variableToString({ length }))
                  setLengthCallback(0, false)
                }}
                value={isLengthFocused ? getValue(variableToString({ length })) : isNaN(length) ? 0 : length}
              />
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
              <VehicleOutlinedInput
                placeholder={'0'}
                onFocus={(): void => {
                  setWeightFocused(true)
                  setLengthFocused(false)
                  setInputName(variableToString({ weight }))
                  setWeightCallback(0, false)
                }}
                value={isWeightFocused ? getValue(variableToString({ weight })) : isNaN(weight) ? 0 : weight}
              />
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
            {!isNaN(length) && Boolean(length) ? (
              <span>{`${length}000 ${t('mm')}`}</span>
            ) : (
              <span>{`0 ${t('mm')}`}</span>
            )}
          </SizeBlock>
          <SizeBlock>
            <p>{`${t('Weight')}`}</p>
            {!isNaN(weight) && Boolean(weight) ? (
              <span>{`${weight}000 ${t('kg')}`}</span>
            ) : (
              <span>{`0 ${t('kg')}`}</span>
            )}
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
                value={getValue(variableToString({ companyRegNumber }))}
                onFocus={(): void => {
                  setWeightFocused(false)
                  setLengthFocused(false)
                  setInputName(variableToString({ companyRegNumber }))
                }}
              />
              {/*<CompanyInputButton onClick={(): void => onCompanyRegNumberSave()}>*/}
              {/*  {t('Check / save')}*/}
              {/*</CompanyInputButton>*/}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" flexBasis="30%" justifyContent="space-between" height="100%">
        {/*<Box display-if={isInvalidDiscount || isCompanyDiscount} display="flex" justifyContent="center">
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
        </Box>*/}
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
                : t(`${VEHICLE_ERROR.COMMON_ERROR.message}`)}
            </p>
          </WarningMessage>
        </Box>
      </Box>
    </Box>
  )
}

export default PickOptions
