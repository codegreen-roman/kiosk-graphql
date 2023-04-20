import React, { FC, ReactElement } from 'react'
import { Box, Grid } from '@material-ui/core'
import { SubHeading } from '@components/InfoList/themes/kihnuKiosk/InfoListStyles'
import { Text } from '@components/Text'
import { useTranslation } from 'react-i18next'
import { LANGUAGE } from '@const/languages'
import { OffsetSpan } from '@components/PaymentPanel/themes/kihnuKiosk/PaymentPanelStyles'
import TripDescription from '@components/TripDirection/themes/kihnuKiosk/TripDirection'
import { TextType } from '@components/Text/TextProps'

export type PaymentObjectType = {
  heading: {
    route: string
    date: string
  }
  ticketTypes: {
    columns: {
      name: string
      qty: string
      price: string
      subtotal: string
    }
    data: {
      name: string
      qty: number
      price: string
      subtotal: string
      promotion?: string
    }[]
  }
  localDiscounts?: {
    columns: {
      name: string
    }
    data: {
      name: string
      data: string
    }[]
  }
  cars?: {
    columns: null
    data: {
      name: string
      data: string
    }[]
  }
  trailers?: {
    columns: null
    data: {
      name: string
      data: string
    }[]
  }
}

interface PaymentTableProps {
  paymentObject: PaymentObjectType
  borderStyle: {
    width: number
    color: string
  }
  hasBorder?: boolean
}
const PaymentTable: FC<PaymentTableProps> = ({ hasBorder = false, borderStyle, paymentObject }) => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language.toUpperCase()
  return (
    <Box
      display="flex"
      width={'100%'}
      minHeight={'666px'}
      border={1}
      borderTop={0}
      borderBottom={0}
      borderLeft={0}
      borderRight={hasBorder ? borderStyle.width : 0}
      borderColor={borderStyle.color}
      pr={hasBorder ? 6 : 3}
      pl={hasBorder ? -1 : 5}
      flexDirection="column"
    >
      <Grid container direction="row" justify="space-between">
        <Grid item xs={6}>
          <Box display="flex" justifyContent="flex-start">
            <TripDescription
              departure={paymentObject.heading.route.split('-')[0]}
              arrival={paymentObject.heading.route.split('-')[1]}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box display="flex" justifyContent="flex-end">
            <SubHeading>{paymentObject.heading.date}</SubHeading>
          </Box>
        </Grid>
      </Grid>
      <Box display="flex" flexDirection="column" height={'100%'} width={'100%'} justifyContent={'space-between'}>
        <Grid container>
          {Object.keys(paymentObject.ticketTypes.columns).map(
            (item, index): ReactElement => (
              <Grid key={`${item}${index}`} item xs={index === 0 ? 6 : 2}>
                <Box display="flex" justifyContent={index === 0 ? 'flex-start' : 'flex-end'}>
                  <Text type={TextType.SCALED_ANNOTATION}>{t([paymentObject.ticketTypes.columns[item]])}</Text>
                </Box>
              </Grid>
            )
          )}
        </Grid>
        <Grid container direction="column" item xs>
          {paymentObject.ticketTypes.data.map((item, index): ReactElement => {
            return (
              <Box
                pt={index === 0 ? 1.5 : 0.5}
                key={item.name}
                display={'flex'}
                flexDirection={'row'}
                minHeight={'38px'}
              >
                <Grid container direction="row" item xs={12}>
                  {Object.keys(item).map(
                    (it, index): ReactElement => (
                      <Grid
                        key={`${it}${index}`}
                        container
                        justify={index === 0 ? 'flex-start' : 'flex-end'}
                        item
                        xs={index === 0 ? 6 : 2}
                      >
                        <Text type={!item.qty ? TextType.PROMOTION : TextType.SCALED_PAYMENT}>{item[it]}</Text>
                      </Grid>
                    )
                  )}
                </Grid>
              </Box>
            )
          })}
        </Grid>
        <Box
          display-if={paymentObject.localDiscounts.data.find((item) => item.data !== '')}
          display="flex"
          flexDirection="column"
          mt={1.5}
          pt={1}
          pb={0.8}
          border={1}
          borderLeft={0}
          borderRight={0}
          borderColor={borderStyle.color}
        >
          <Grid container direction="row" item xs={12}>
            {Object.keys(paymentObject.localDiscounts.columns).map(
              (item, index): ReactElement => (
                <Grid
                  key={item}
                  container
                  item
                  xs={index === 0 ? 6 : 2}
                  justify={index === 0 ? 'flex-start' : 'flex-end'}
                >
                  <Text type={TextType.SCALED_ANNOTATION}>{t([paymentObject.localDiscounts.columns[item]])}</Text>
                </Grid>
              )
            )}
          </Grid>
          <Grid container direction="column" item xs>
            {paymentObject.localDiscounts.data.map((item): ReactElement => {
              return (
                <Box key={item.name} display={'flex'} flexDirection={'row'} py={0.5}>
                  <Grid container direction="row" item xs={12}>
                    {Object.keys(item).map(
                      (it, index): ReactElement => (
                        <Grid key={`${it}${index}`} container justify="flex-start" item xs={index === 0 ? 3 : 9}>
                          <Text type={it === 'name' ? TextType.SCALED_ANNOTATION : TextType.SCALED_PAYMENT}>
                            {it === 'name' ? t([item[it]]) : item[it]}
                          </Text>
                        </Grid>
                      )
                    )}
                  </Grid>
                </Box>
              )
            })}
          </Grid>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          pt={paymentObject.localDiscounts.data.find((item) => item.data !== '') ? 0 : 1}
          border={1}
          borderTop={0}
          borderLeft={0}
          borderRight={0}
          borderColor={borderStyle.color}
        >
          <Grid container direction="row" item xs={12}>
            <Grid container direction="column" item xs={6}>
              <Grid container direction="column" justify="space-evenly" item xs={12}>
                {paymentObject.cars.data.map((item): ReactElement => {
                  return (
                    <Box
                      key={item.name}
                      display={'flex'}
                      flexDirection={'row'}
                      pr={3}
                      height={currentLanguage === LANGUAGE.FI ? '38px' : '36px'}
                    >
                      <Grid container direction="row" item xs={12}>
                        {Object.keys(item).map(
                          (it, index): ReactElement => (
                            <Grid key={`${it}${index}`} container justify={'flex-start'} item xs={index === 0 ? 7 : 5}>
                              <Text type={index === 0 ? TextType.SCALED_ANNOTATION : TextType.UNITS}>
                                {it === 'data' ? <OffsetSpan>{item[it]}</OffsetSpan> : `${t([item[it]])}:`}
                              </Text>
                            </Grid>
                          )
                        )}
                      </Grid>
                    </Box>
                  )
                })}
              </Grid>
            </Grid>
            <Grid container direction="column" item xs={6}>
              <Grid container direction="column" item xs={12}>
                {paymentObject.trailers.data.map((item): ReactElement => {
                  return (
                    <Box
                      key={item.name}
                      display={'flex'}
                      flexDirection={'row'}
                      pr={3}
                      height={currentLanguage === LANGUAGE.FI ? '38px' : '36px'}
                    >
                      <Grid container direction="row" item xs={12}>
                        {Object.keys(item).map(
                          (it, index): ReactElement => (
                            <Grid key={`${it}${index}`} container justify={'flex-start'} item xs={index === 0 ? 7 : 5}>
                              <Text type={index === 0 ? TextType.SCALED_ANNOTATION : TextType.UNITS}>
                                {it === 'data' ? <OffsetSpan>{item[it]}</OffsetSpan> : `${t([item[it]])}:`}
                              </Text>
                            </Grid>
                          )
                        )}
                      </Grid>
                    </Box>
                  )
                })}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

export default PaymentTable
