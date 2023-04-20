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
  SuccessMessage,
} from './AutoFilledOptionsStyles'
import VEHICLE_ERROR from '@const/vehicleErrorCodes'
import { Terms } from '@components/Terms'
import { variableToString } from '@utils/formatters'
import { useAppState } from '../../../../hooks/useAppState'
import ATTRIBUTES from '@const/attributes'
import { compose, defaultTo, find, pathOr, propOr } from 'ramda'
import { companyRegNumberTriggerLength, RouteAttribute } from '@interfaces/boraCore'
import { convertTermsAutoFilled } from '@components/AddVehiclePopup/themes/kihnuKiosk/helpers'
import TICKET_TYPE from '@const/ticketTypes'

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
  type: string
  companyRegNumber: string
  isTriggeredToGetParameters: boolean
  getAdditionalVehicleParameters: (flag: boolean) => void
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
  type,
  companyRegNumber,
  isTriggeredToGetParameters,
  getAdditionalVehicleParameters,
  getVehicleParameters,
  data,
  error,
  reservationErrorObject,
  mutationLoading,
  getValue,
}) => {
  const { t, i18n } = useTranslation()
  const { state } = useAppState()
  const [isCompanyFound, setCompanyFound] = useState(false)
  const currentLanguage = i18n.language.toUpperCase()
  const coefficientsFromAttributes = state?.sailPackages[0]?.route?.attributes?.filter(
    (item) =>
      item.code.includes(`${ATTRIBUTES.KIOSK_COEFFICIENTS_PREFIX}${state.route.code}`) &&
      (item.code.endsWith(`_${currentLanguage}`) || item.code.endsWith(`_${currentLanguage}_BEFORE_01.03.2022`))
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
    getAdditionalVehicleParameters(true)
  }

  useEffect(() => {
    if (isTriggeredToGetParameters) {
      setCompanyFound(false)
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
      if (companyRegNumber && companyRegNumber.length === companyRegNumberTriggerLength) {
        setCompanyFound(true)
      } else {
        setCompanyFound(false)
      }
      setSavedParameters((prevState) => ({
        ...prevState,
        priceCategoryTitle: price.priceCategoryTitle,
        price: price.price,
        coefficients: price.coefficients,
      }))
    }
  }, [data])

  useEffect(() => {
    if (mutationLoading) {
      setCompanyFound(false)
    }
  }, [mutationLoading])

  const selectedDate = state?.selectedDate as Date
  const useContentBefore01march = Number(selectedDate) < Number(new Date('2022/03/01'))

  const terms = convertTermsAutoFilled({
    attributes: coefficientsFromAttributes,
    coefficientsFromQuery: savedParameters.coefficients,
    currentLanguage,
    useContentBefore01march,
  })
  return (
    <Box display="flex" flexDirection="row" alignItems="center" width="100%" height="100%" padding="0 10px">
      <Box display="flex" flexDirection="row" flexBasis="70%" height="100%" justifyContent="space-around">
        <Box display="flex" flexDirection="column" justifyContent="center" flexBasis="40%" paddingLeft="15px">
          <Box display="flex" flexDirection="column" justifyContent="space-around" flexBasis="60%" px="20px">
            <Box
              display-if={isCompanyDiscount}
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <InputLabel>{`${t('If vehicle is owned by company')}:`}</InputLabel>
              <Box display="flex" width="50%">
                <CompanyOutlinedInput
                  placeholder={t('Vehicle owned by company placeholder')}
                  value={getValue(variableToString({ companyRegNumber }))}
                />
              </Box>
            </Box>
            <Box display-if={isInvalidDiscount} display="flex" justifyContent="space-between" mb={2}>
              <CheckboxLabel>{t('Sügava puudega isikut')}</CheckboxLabel>
              <Box display="flex" width="50%">
                <FormControlLabel
                  style={{ display: 'flex', alignItems: 'flex-start' }}
                  control={<StyledCheckbox checked={isHandicapped.checked} onChange={handleChange} name="checked" />}
                  label={
                    <Box display="flex" flexDirection="row" paddingTop="5px">
                      <WheelchairIconHolder as={Icon['wheelchair']} />
                      <WheelchairIconHolder as={Icon['dash']} />
                      <WheelchairIconHolder as={Icon['visually-impaired']} />
                      <WheelchairIconHolder as={Icon['dash']} />
                      <WheelchairIconHolder as={Icon['accompanying-impaired']} />
                    </Box>
                  }
                />
              </Box>
            </Box>
          </Box>
          <Title>{`${t('Here is data, provided by Transportation Department')}:`}</Title>
          <Box display="flex" paddingLeft="20px">
            <Description>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <p>{`${t('Vehicle type')}`}</p>
                <span>{savedParameters.category}</span>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <p>{`${t('Length')}`}</p>
                <span>{`${savedParameters.lengthInMm} ${t('mm')}`}</span>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <p>{`${t('Width')}`}</p>
                <span>{`${savedParameters.widthInMm} ${t('mm')}`}</span>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <p>{`${t('Height')}`}</p>
                <span>{`${savedParameters.heightInMm} ${t('mm')}`}</span>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <p>{`${t('Weight')}`}</p>
                <span>{`${savedParameters.weightInKg} ${t('kg')}`}</span>
              </Box>
            </Description>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        flexBasis="30%"
        pl={0.15}
        justifyContent={terms.length > 1 ? 'center' : 'flex-start'}
        height="100%"
      >
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
          py={0}
        >
          <WarningMessage>
            {error.code === VEHICLE_ERROR.INAPPROPRIATE_UI_FORM.code ? (
              <p>
                {type === TICKET_TYPE.TRAILER
                  ? t(`${VEHICLE_ERROR[error.code].message.vehicle}`)
                  : t(`${VEHICLE_ERROR[error.code].message.trailer}`)}
              </p>
            ) : (
              <p>
                {VEHICLE_ERROR[error.code]
                  ? t(`${VEHICLE_ERROR[error.code].message}`)
                  : t(`${VEHICLE_ERROR.COMMON_ERROR.message}`)}
              </p>
            )}
          </WarningMessage>
        </Box>
        <Box
          display-if={
            companyRegNumber &&
            isCompanyFound &&
            companyRegNumber.length === companyRegNumberTriggerLength &&
            !mutationLoading
          }
          display="flex"
          flexBasis="30%"
          justifyContent="center"
          height="100%"
          py={0}
        >
          <SuccessMessage>
            <p>{t('Company found')}</p>
          </SuccessMessage>
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
                : t(`${VEHICLE_ERROR.COMMON_ERROR.message}`)}
            </p>
          </WarningMessage>
        </Box>
      </Box>
    </Box>
  )
}

export default InsertVehicleNumber
