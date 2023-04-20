import React, { FC } from 'react'
import { Box, Grid } from '@material-ui/core'
import {
  ContractButton,
  ContractButtonIconHolder,
  SubmitButton,
  SubmitButtonIconHolder,
  SubmitText,
} from '@styles/buttonStyles'
import { Icon } from '@components/Icon'

interface PaymentActionPanelProps {
  cardText: string
  contractText: string
  isEnabled?: boolean
  handleCardButton?(): void
  handleContractButton?(): void
}
const PaymentActionPanel: FC<PaymentActionPanelProps> = ({
  contractText,
  cardText,
  isEnabled,
  handleCardButton,
  handleContractButton,
}) => {
  return (
    <Box flexDirection={'column'}>
      <Grid container direction={'column'}>
        <Grid item xs display-if={cardText}>
          <Box display="flex" justifyContent="center" mb={2}>
            <SubmitButton onClick={handleCardButton} isEnabled={isEnabled} isAdaptive={true}>
              <SubmitText display-if={cardText} dangerouslySetInnerHTML={{ __html: cardText }} />
              <SubmitButtonIconHolder as={Icon['pay-cards']} />
            </SubmitButton>
          </Box>
        </Grid>
        <Grid item xs display-if={contractText}>
          <Box display="flex" justifyContent="center">
            <ContractButton onClick={handleContractButton} isEnabled={isEnabled}>
              {contractText}
              <ContractButtonIconHolder as={Icon['contracts']} />
            </ContractButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PaymentActionPanel
