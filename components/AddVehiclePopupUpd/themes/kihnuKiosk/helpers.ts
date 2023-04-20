import ATTRIBUTES from '@const/attributes'
import { GeneralCodeAndTitle, VehicleHeight, VehicleWidth } from '@interfaces/boraCore'
import { TimeOfDepartureOneWay, TimeOfDepartureRoundTrip } from '@components/AddVehiclePopup'

interface ParametersForAutomaticConvertation {
  attributes: GeneralCodeAndTitle[]
  coefficientsFromQuery: string[]
  currentLanguage: string
}
export const convertTermsAutoFilled = ({
  attributes,
  coefficientsFromQuery,
  currentLanguage,
}: ParametersForAutomaticConvertation): string[] => {
  return attributes.length
    ? [
        attributes.find((item) => item.code.includes(`${ATTRIBUTES.KIOSK_COEFFICIENTS_HEADER}`))?.value,
        ...(coefficientsFromQuery
          ? coefficientsFromQuery.map(
              (item) => attributes.find((it) => it.code === `${item}_${currentLanguage}`)?.value
            )
          : []),
      ]
    : []
}

interface Departure {
  port: string
  dayOfWeek: number
  hour: number
  dayPrefix: string
}

interface ParametersForManualConvert {
  attributes: GeneralCodeAndTitle[]
  width: string
  height: string
  currentPort: string
  departureTime: TimeOfDepartureOneWay | TimeOfDepartureRoundTrip
  departurePortPrimary: Departure
  departurePortSecondary: Departure
}
export const convertTermsManual = ({
  attributes,
  width,
  height,
  currentPort,
  departureTime,
  departurePortPrimary,
  departurePortSecondary,
}: ParametersForManualConvert): string[] => {
  const terms = attributes.length
    ? [
        attributes.find((item) => item.code.includes(`${ATTRIBUTES.KIOSK_COEFFICIENTS_HEADER}`))?.value,
        ...(width === VehicleWidth.MORE_THAN_250
          ? [attributes.find((item) => item.code.includes(`${ATTRIBUTES.KIOSK_COEFFICIENTS_WIDTH}`))?.value]
          : []),
        ...(height === VehicleHeight.MORE_THAN_400
          ? [attributes.find((item) => item.code.includes(`${ATTRIBUTES.KIOSK_COEFFICIENTS_HEIGHT}`))?.value]
          : []),
      ]
    : []
  if (currentPort === departurePortPrimary.port) {
    if (
      new Date(departureTime.to).getDay() === departurePortPrimary.dayOfWeek &&
      new Date(departureTime.to).getHours() >= departurePortPrimary.hour
    ) {
      terms.push(attributes.find((item) => item.code.includes(`${departurePortPrimary.dayPrefix}`))?.value)
    }
    if (
      departureTime.hasOwnProperty('from') &&
      new Date((departureTime as TimeOfDepartureRoundTrip).from).getDay() === departurePortSecondary.dayOfWeek &&
      new Date((departureTime as TimeOfDepartureRoundTrip).from).getHours() >= departurePortSecondary.hour
    ) {
      terms.push(attributes.find((item) => item.code.includes(`${departurePortSecondary.dayPrefix}`))?.value)
    }
  } else if (currentPort === departurePortSecondary.port) {
    if (
      new Date(departureTime.to).getDay() === departurePortSecondary.dayOfWeek &&
      new Date(departureTime.to).getHours() >= departurePortSecondary.hour
    ) {
      terms.push(attributes.find((item) => item.code.includes(`${departurePortSecondary.dayPrefix}`))?.value)
    }
    if (
      departureTime.hasOwnProperty('from') &&
      new Date((departureTime as TimeOfDepartureRoundTrip).from).getDay() === departurePortPrimary.dayOfWeek &&
      new Date((departureTime as TimeOfDepartureRoundTrip).from).getHours() >= departurePortPrimary.hour
    ) {
      terms.push(attributes.find((item) => item.code.includes(`${departurePortPrimary.dayPrefix}`))?.value)
    }
  }
  return terms
}
