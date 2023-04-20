import { SubHeading } from '@components/InfoList/themes/kihnuKiosk/InfoListStyles'
import { Box, Grid } from '@material-ui/core'
import React, { FC, ReactElement } from 'react'
import { Text } from '@components/Text'
import { useTranslation } from 'react-i18next'
import { TextType, Justify } from '@components/Text/TextProps'

export type SummaryData = {
  name: string
  value: string
}
interface SummaryProps {
  heading: string
  summaryData: SummaryData[]
}
const PaymentSummary: FC<SummaryProps> = ({ heading, summaryData }) => {
  const { t } = useTranslation()
  return (
    <>
      <SubHeading>{heading}</SubHeading>
      <Grid container direction={'column'} justify={'space-between'} item>
        {summaryData.map((item, index, array): ReactElement => {
          return (
            <Box key={item.name} pb={1} pt={index === 0 ? 0 : 1} height={'42px'}>
              <Grid item container direction={'row'} xs={12}>
                <Grid item xs={8}>
                  <Text type={TextType.ANNOTATION}>{t([item.name])}</Text>
                </Grid>
                <Grid container item xs={4} justify={'flex-end'}>
                  <Text
                    customJustify={Justify.FLEX_END}
                    type={index === array.length - 1 ? TextType.DEFAULT : TextType.PAYMENT}
                  >
                    {item.value}
                  </Text>
                </Grid>
              </Grid>
            </Box>
          )
        })}
      </Grid>
    </>
  )
}

export default PaymentSummary
