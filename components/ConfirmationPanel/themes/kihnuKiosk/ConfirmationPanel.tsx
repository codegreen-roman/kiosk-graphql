import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid } from '@material-ui/core'
import { InfoList, InfoListProps } from '@components/InfoList'
import { IconHolder, Root } from './ConfirmationPanelStyles'
import { Text } from '@components/Text'
import { Icon } from '@components/Icon'
import CardMedia from '@material-ui/core/CardMedia'
import { ConfirmationPanelProps } from '@components/ConfirmationPanel'
import { TextType } from '@components/Text/TextProps'

//here a method for fetching weather could be added later
// const getWeather: object = (date: Date) => {}

const informationSecondColumnArray: Array<InfoListProps> = [
  {
    heading: 'Services on board',
    items: [
      {
        svg: 'passengers',
        data: 'Seats',
      },
      {
        svg: 'wifi',
        data: 'Wifi',
      },
      {
        svg: 'coffee-snacks',
        data: 'Snacks and beverages',
      },
      {
        svg: 'cards',
        data: 'Payment cards',
      },
      {
        svg: 'wc',
        data: 'WC',
      },
      {
        svg: 'no-signal',
        data: 'Mobile signal',
      },
    ],
  },
]

const ConfirmationPanel: FC<ConfirmationPanelProps> = ({ vessel }) => {
  const { t } = useTranslation()
  return (
    <Root>
      <Grid container direction="column" justify={'space-between'}>
        <Grid spacing={4} container item xs={12}>
          <Grid item xs={6}>
            <Box display="flex" mt={2} flexDirection="column" justifyContent="center" alignItems="center">
              <Box>
                <CardMedia component="img" image="/themes/kihnuKiosk/images/tickets-slot.png" />
              </Box>
              <Box mx={5} marginTop={4}>
                <Text type={TextType.DEFAULT}>{t('Your ticket')}</Text>
              </Box>
            </Box>
          </Grid>
          <Grid container item alignItems={'stretch'} xs={6}>
            {informationSecondColumnArray.map((data) => (
              <InfoList
                key={data.heading}
                heading={data.heading}
                items={data.items}
                textProps={data.textProps ? data.textProps : { type: TextType.DEFAULT }}
                column={!!data.column}
                vesselCode={vessel}
              />
            ))}
          </Grid>
        </Grid>
        <Grid container item justify="center" xs={12}>
          <Grid item xs>
            <Box display="flex" mt={'250px'} justifyContent="center" alignItems="center">
              <IconHolder as={Icon['triangle-grey']} />
              <Box mx={2}>
                <Text type={TextType.DEFAULT}>{t('Your ticket with arrows')}</Text>
              </Box>
              <IconHolder as={Icon['triangle-grey']} />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Root>
  )
}
export default ConfirmationPanel
