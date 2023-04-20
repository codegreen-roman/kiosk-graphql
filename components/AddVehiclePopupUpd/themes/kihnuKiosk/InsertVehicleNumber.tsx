import React, { FC } from 'react'
import { Box, CircularProgress } from '@material-ui/core'
import { InputDescription, InputWarning } from './InsertVehicleNumberStyles'
import { WarningMessage } from './AutoFilledOptionsStyles'
import VEHICLE_ERROR from '@const/vehicleErrorCodes'
import { useTranslation } from 'react-i18next'
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
  fetching: boolean
}

const InsertVehicleNumber: FC<InsertVehicleNumberProps> = ({ type, warning, description, error, fetching }) => {
  const { t } = useTranslation()
  return (
    <Box display="flex" justifyContent="center">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        height="100%"
        padding="50px 0"
        maxWidth="485px"
      >
        {/*<StyledOutlinedInput
          autoFocus={true}
          placeholder={placeholder}
          value={getValue(variableToString({ vehicleNumber }))}
        />*/}
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
              <p>
                {VEHICLE_ERROR[error.code]
                  ? t(`${VEHICLE_ERROR[error.code].message}`)
                  : t(`${VEHICLE_ERROR.COMMON_ERROR.message}`)}
              </p>
            )}
          </WarningMessage>
        </Box>
        <InputWarning display-if={false}>{warning}</InputWarning>
        {fetching ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="120px" pt={4} pb={8}>
            <CircularProgress />
          </Box>
        ) : (
          <InputDescription>{description}</InputDescription>
        )}
      </Box>
    </Box>
  )
}

export default InsertVehicleNumber
