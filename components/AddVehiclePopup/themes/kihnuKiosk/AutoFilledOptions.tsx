import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { Box, CircularProgress, FormControlLabel } from '@material-ui/core'
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox'
import { Icon } from '@components/Icon'
import {
  Title,
  Description,
  WarningMessage,
  InputLabel,
  CompanyOutlinedInput,
  useCheckboxStyles,
  WheelchairIconHolder,
  CheckboxLabel,
} from './AutoFilledOptionsStyles'
import VEHICLE_ERROR from '@const/vehicleErrorCodes'
import { Terms } from '@components/Terms'
import { variableToString } from '@utils/formatters'
import { useAppState } from '../../../../hooks/useAppState'
import ATTRIBUTES from '@const/attributes'
import { compose, defaultTo, find, pathOr, propOr } from 'ramda'
import { RouteAttribute } from '@interfaces/boraCore'
import { convertTermsAutoFilled } from '@components/AddVehiclePopup/themes/kihnuKiosk/helpers'

const StyledCheckbox: FC<CheckboxProps> = (props: CheckboxProps) => {
  const classes = useCheckboxStyles()

  return (
    <Checkbox
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  )
}

interface AutoFilledOptionsProps {
  companyRegNumber: string
  isTriggeredToGetParameters: boolean
  getVehicleParameters: ({ companyRegistrationNumber, handicapped, priceCategoryTitle, price }) => void
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
  error?: {
    message: string
    code: string
  }
  reservationErrorObject: {
    reservationError: {
      flag: boolean
      message: string
      code: string
    }
    showReservationError: boolean
  }
  mutationLoading: boolean
  getValue: (inputName: string) => string
}
const InsertVehicleNumber: FC<AutoFilledOptionsProps> = ({
  companyRegNumber,
  isTriggeredToGetParameters,
  getVehicleParameters,
  data,
  error,
  reservationErrorObject,
  mutationLoading,
  getValue,
}) => {
  const { t, i18n } = useTranslation()
  const { state } = useAppState()
  const currentLanguage = i18n.language.toUpperCase()
  const coefficientsFromAttributes = state?.sailPackages[0]?.route?.attributes?.filter(
    (item) =>
      item.code.includes(`${ATTRIBUTES.KIOSK_COEFFICIENTS_PREFIX}${state.route.code}`) &&
      item.code.endsWith(`_${currentLanguage}`)
  )

  const attributeValue = compose(
    defaultTo('false'),
    propOr('false', 'value'),
    find((item: RouteAttribute) => item.code === ATTRIBUTES.ENABLE_HANDICAPPED_VEHICLES),
    pathOr([], ['route', 'attributes'])
  )(state)

  const handicappedEnabled = attributeValue === 'false' || false
  const isInvalidDiscount = !handicappedEnabled
  const companyEnabled = state?.route?.attributes.find((item) => item.code === ATTRIBUTES.ENABLE_COMPANY_LOYALTIES)
  const isCompanyDiscount = companyEnabled ? companyEnabled.value : false
  const [isHandicapped, setHandicapped] = useState({
    checked: false,
  })
  const [savedParameters, setSavedParameters] = useState({
    category: '',
    heightInMm: 0,
    lengthInMm: 0,
    weightInKg: 0,
    widthInMm: 0,
    priceCategoryTitle: '',
    price: 0,
    coefficients: [],
  })

  const { reservationError, showReservationError } = reservationErrorObject

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setHandicapped({ ...isHandicapped, [event.target.name]: event.target.checked })
  }

  useEffect(() => {
    if (isTriggeredToGetParameters) {
      getVehicleParameters({
        handicapped: isHandicapped.checked,
        companyRegistrationNumber: companyRegNumber,
        priceCategoryTitle: savedParameters.priceCategoryTitle,
        price: savedParameters.price,
      })
    }
  }, [isTriggeredToGetParameters])
  useEffect(() => {
    if (data?.vehicleInfo) {
      const { vehicleInfo } = data
      const { category, heightInMm, lengthInMm, weightInKg, widthInMm } = vehicleInfo
      setSavedParameters((prevState) => ({
        ...prevState,
        category,
        heightInMm,
        lengthInMm,
        weightInKg,
        widthInMm,
      }))
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
  })
  return (
    <Box display="flex" flexDirection="row" alignItems="center" width="100%" height="100%" padding="0 10px">
      <Box display="flex" flexDirection="row" flexBasis="70%" height="100%" justifyContent="space-around">
        <Box display="flex" flexDirection="column" justifyContent="center" flexBasis="40%" paddingLeft="15px">
          <Title>{`${t('Here is data, provided by Transportation Department')}:`}</Title>
          <Box display="flex" paddingLeft="20px">
            <Description>
              <Box display="flex">
                <p>{`${t('Vehicle type')}`}</p>
                <span>{savedParameters.category}</span>
              </Box>
              <Box display="flex">
                <p>{`${t('Length')}`}</p>
                <span>{`${savedParameters.lengthInMm} ${t('mm')}`}</span>
              </Box>
              <Box display="flex">
                <p>{`${t('Width')}`}</p>
                <span>{`${savedParameters.widthInMm} ${t('mm')}`}</span>
              </Box>
              <Box display="flex">
                <p>{`${t('Height')}`}</p>
                <span>{`${savedParameters.heightInMm} ${t('mm')}`}</span>
              </Box>
              <Box display="flex">
                <p>{`${t('Weight')}`}</p>
                <span>{`${savedParameters.weightInKg} ${t('kg')}`}</span>
              </Box>
            </Description>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="space-around" flexBasis="60%" px="20px">
          <Box display-if={isInvalidDiscount} display="flex">
            <FormControlLabel
              style={{ display: 'flex', alignItems: 'flex-start' }}
              control={<StyledCheckbox checked={isHandicapped.checked} onChange={handleChange} name="checked" />}
              label={
                <Box display="flex" paddingTop="5px">
                  <WheelchairIconHolder as={Icon['wheelchair']} />
                  <CheckboxLabel>{t('Sügava puudega isikut')}</CheckboxLabel>
                </Box>
              }
            />
          </Box>
          <Box display-if={isCompanyDiscount} display="flex" flexDirection="column">
            <InputLabel>{`${t('If vehicle is owned by company')}:`}</InputLabel>
            <Box display="flex">
              <CompanyOutlinedInput
                placeholder={t('Vehicle owned by company placeholder')}
                value={getValue(variableToString({ companyRegNumber }))}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" flexBasis="30%" justifyContent="center" height="100%">
        {terms.length > 1 && <Terms terms={terms} />}
        {mutationLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%" py={1.5}>
            <CircularProgress />
          </Box>
        )}
        <Box
          display-if={error && error.code !== VEHICLE_ERROR.VEHICLE_INFO_NOT_FOUND_IN_REGISTRY.code}
          display="flex"
          flexBasis="30%"
          justifyContent="center"
          height="100%"
          py={1.5}
        >
          <WarningMessage>
            <p>{VEHICLE_ERROR[error.code] ? t(`${VEHICLE_ERROR[error.code].message}`) : error.message}</p>
          </WarningMessage>
        </Box>
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

export default InsertVehicleNumber
