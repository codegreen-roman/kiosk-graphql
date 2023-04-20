import React, { FC } from 'react'
import { Icon } from '@components/Icon'
import { IconHolder } from './SailsTableHeadStyles'
import { TicketsAmount } from '@components/SailsTable'
import { Box, Grid } from '@material-ui/core'

export interface SailsTableHeadProps {
  maxTickets: TicketsAmount
}

const SailsTableHead: FC = () => (
  <Grid item xs={12}>
    <Box padding="7px 25px">
      <Grid container spacing={0} justify="space-between" alignItems="center">
        <Grid item xs={4}>
          <Box paddingLeft="10px">
            <IconHolder as={Icon.clock} gray height="24px" />
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Grid container spacing={0} justify="space-between" alignItems="center">
            <Grid item xs={4}>
              <IconHolder as={Icon.passenger} height="20px" />
            </Grid>
            <Grid item xs={4}>
              <IconHolder as={Icon.vehicle} height="15px" />
            </Grid>
            <Grid item xs={4}>
              <IconHolder as={Icon.bicycle} height="15px" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  </Grid>
)

export default SailsTableHead
