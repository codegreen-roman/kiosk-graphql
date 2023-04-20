import React, { FC } from 'react'
import { asMoneyString } from '@utils/formatters'
import { BookingStepTitleProps } from '@components/BookingStepTitle'
import {
  Root,
  Container,
  LeftSide,
  RightSide,
  TotalAmount,
  TotalAmountLabel,
  FinalStepLabel,
  FinishBox,
} from './BookingStepTitleStyles'
import { useTranslation } from 'react-i18next'
import { AppStateTypes, useAppState } from '../../../../hooks/useAppState'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Box } from '@material-ui/core'

const BookingStepTitle: FC<BookingStepTitleProps> = ({ totalAmount, children, finalStep }) => {
  const { t } = useTranslation()
  const { dispatch } = useAppState()
  const handleRedirect = (): void => {
    dispatch({ type: AppStateTypes.startAgain, payload: true })
  }
  return (
    <Root totalAmount={totalAmount} finalStep={finalStep}>
      <Container maxWidth={finalStep ? false : 'xl'} disableGutters={!!finalStep}>
        <LeftSide finalStep={finalStep}>{children}</LeftSide>
        <RightSide display-if={totalAmount !== undefined}>
          <TotalAmountLabel>{t('Total price label')}</TotalAmountLabel>
          {totalAmount >= 0 ? (
            <TotalAmount>{asMoneyString(totalAmount / 100)}</TotalAmount>
          ) : (
            <Box display="flex" alignItems="center" justifyContent="center" marginRight="15%">
              <CircularProgress color="primary" />
            </Box>
          )}
        </RightSide>
        <RightSide display-if={Boolean(finalStep)} finalStep={finalStep}>
          <FinishBox onClick={handleRedirect}>
            <FinalStepLabel>{t('Finish button')}</FinalStepLabel>
          </FinishBox>
        </RightSide>
      </Container>
    </Root>
  )
}
export default BookingStepTitle
