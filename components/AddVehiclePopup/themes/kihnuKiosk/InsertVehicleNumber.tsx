import React, { FC } from 'react'
import { Box } from '@material-ui/core'
import { StyledOutlinedInput, InputDescription, InputWarning } from './InsertVehicleNumberStyles'
import { WarningMessage } from './AutoFilledOptionsStyles'
import VEHICLE_ERROR from '@const/vehicleErrorCodes'
import { useTranslation } from 'react-i18next'
import { variableToString } from '@utils/formatters'
import TICKET_TYPE from '@const/ticketTypes'

export interface InsertVehicleNumberProps {
  type: string
  placeholder: string
  warning: string
  description: string
  vehicleNumber: string
  getValue: (inputName: string) => string
  error?: {
    message: string
    code: string
    // extensions: {
    //   code: string
    // }
  }
}

const InsertVehicleNumber: FC<InsertVehicleNumberProps> = ({
  type,
  placeholder,
  warning,
  description,
  vehicleNumber,
  getValue,
  error,
}) => {
  const { t } = useTranslation()
  return (
    <Box display="flex" justifyContent="center">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        height="100%"
        padding="50px 0 0"
        maxWidth="485px"
      >
        <StyledOutlinedInput
          /* eslint-disable-next-line jsx-a11y/no-autofocus */
          autoFocus={true}
          placeholder={placeholder}
          value={getValue(variableToString({ vehicleNumber }))}
        />
        <Box
          display-if={
            error &&
            error.code !== VEHICLE_ERROR.VEHICLE_INFO_NOT_FOUND_IN_REGISTRY.code &&
            error.code !== VEHICLE_ERROR.COMPANY_NOT_FOUND_IN_EBUSINESS_REGISTER.code
          }
          display="flex"
          flexBasis="30%"
          justifyContent="center"
          height="100%"
          py={1.5}
        >
          <WarningMessage>
            {error.code === VEHICLE_ERROR.INAPPROPRIATE_UI_FORM.code ? (
              <p>
                {type === TICKET_TYPE.TRAILER
                  ? t(`${VEHICLE_ERROR[error.code].message.vehicle}`)
                  : t(`${VEHICLE_ERROR[error.code].message.trailer}`)}
              </p>
            ) : (
              <p>{VEHICLE_ERROR[error.code] ? t(`${VEHICLE_ERROR[error.code].message}`) : error.message}</p>
            )}
          </WarningMessage>
        </Box>
        <InputWarning display-if={false}>{warning}</InputWarning>
        <InputDescription>{description}</InputDescription>
      </Box>
    </Box>
  )
}

export default InsertVehicleNumber
