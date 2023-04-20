import React, { useEffect } from 'react'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Grid } from '@material-ui/core'
import { Root } from './PaymentPanelStyles'
import { ActionPanel } from '@components/ActionPanel'
import { getContentDividerColors } from '@themeSettings'
import PaymentActionPanel from '@components/ActionPanel/themes/kihnuKiosk/PaymentActionPanel'
import { Terms } from '@components/Terms'
import PaymentSummary from './PaymentSumary'
import PaymentTable from './PaymentTable'
import CardMedia from '@material-ui/core/CardMedia'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import { AddIdCardPaymentPopup } from '@components/AddIdCardPaymentPopup'
import { AddPaymentCardPopup } from '@components/AddPaymentCardPopup'
import { PaymentPanelProps } from '@components/PaymentPanel'
import { formatServerDataForPayment, convertTermsData } from './helpers'
import { TextWrapper, useStyles, BorderedDiv } from './PaymentPanelStyles'
import { useSubscription } from 'urql'
import { SubmitButton, SubmitText } from '@styles/buttonStyles'
import { usePaymentCard } from '@components/AddPaymentCardPopup/themes/kihnuKiosk/usePaymentCard'
import subscribePaymentTerminal from '@gql/subscription/subscribePaymentTerminal.graphql'
import { debugFlag } from '@const/paymentDebugFlags'
import { usePaymentPanelOperations } from '@components/PaymentPanel/themes/kihnuKiosk/usePaymentPanel'
import { useAppState } from '../../../../hooks/useAppState'
import ATTRIBUTES from '@const/attributes'
import { VesselPrefix } from '@interfaces/boraCore'

const debugMode = false
const contentDividerColors = getContentDividerColors()
const borderStyle = {
  width: 1,
  color: `${contentDividerColors.contentDivider}`,
}

const actions = {
  submitText: null,
  submitHref: '',
}

const NoRoundTrip: FC = () => {
  const { t } = useTranslation()
  return (
    <Box display="flex" mt={2} flexDirection="column" justifyContent="center" alignItems="center">
      <Box>
        <CardMedia component="img" image="/themes/kihnuKiosk/images/RoundTripScheme.png" />
      </Box>
      <Box mx={5} marginTop={4}>
        <TextWrapper>{t('One way ticket')}</TextWrapper>
      </Box>
    </Box>
  )
}

const PaymentPanel: FC<PaymentPanelProps> = ({ serverData }) => {
  const { t, i18n } = useTranslation()
  const { state } = useAppState()
  const currentLanguage = i18n.language.toUpperCase()
  const termsFromAttributes: string = state?.sailPackages[0]?.route?.attributes?.find((item) =>
    item.code.includes(`${ATTRIBUTES.KIOSK_TERMS_PREFIX}${currentLanguage}`)
  )?.value
  const terms = convertTermsData({
    data: termsFromAttributes,
  })

  const { reservationId, paymentInfo } = serverData
  const { totalPrice } = paymentInfo
  const isZeroPricedReservation = totalPrice.amount === 0

  const port = serverData?.sailPackages[0]?.sailRefs[0]?.departureFrom
  const routeLeg = serverData?.sailPackages[0]?.sailRefs[0]?.routeLeg
  const route = serverData?.sailPackages[0]?.sailRefs[0]?.route
  let vesselName = serverData?.sailPackages[0]?.sailRefs[0]?.vesselTitle
  if (vesselName.includes(VesselPrefix.DEFAULT)) {
    vesselName = vesselName.replace(VesselPrefix.DEFAULT, '')
  }

  const classes = useStyles()
  const forwardPaymentObject = formatServerDataForPayment(serverData, 0)
  const backwardPaymentObject =
    serverData?.sailPackages.length > 1 ? formatServerDataForPayment(serverData, 1) : undefined

  const {
    openAddMode,
    dataForMutation,
    setDataForMutation,
    operationId,
    openCardMode,
    isShadowed,
    handleAddModeClose,
    handleCardModeClose,
    callBack,
    handleZeroPriceReservation,
    redirectToConfirmationPage,
    returnOneWayTrip,
  } = usePaymentPanelOperations(reservationId, port)
  const { requestPaymentCard } = usePaymentCard((): void => returnOneWayTrip(routeLeg, route), true)

  const [result] = useSubscription({
    query: subscribePaymentTerminal,
    variables: {
      port: port,
      operationId: operationId,
    },
    pause: !operationId,
  })
  const shouldCompareStatuses =
    result.data && result.data.paymentTerminalOperationProgress && result.data.paymentTerminalOperationProgress.status

  // Will be uncommented after backend is done for modification scenario
  /*const onBackClick = async (): Promise<void> => {
    try {
      const res = await startModification({ reservationId }).catch(console.error)
      const { data, error } = res
      if (data && !error) {
        back()
        dispatch({
          type: AppStateTypes.setEditingTickets,
          payload: { flag: true, reservationId: data.startModification.reservationId },
        })
      }
      if (error) {
        throw new Error(error.toString())
      }
    } catch (e) {
      console.error(e)
    }
  }*/

  useEffect(() => {
    setDataForMutation((prevState) => ({
      ...prevState,
      reservationId,
    }))
  }, [])

  useEffect(() => {
    let timer = null
    if (operationId) {
      timer = setTimeout(async () => {
        try {
          await requestPaymentCard(operationId, reservationId, port, debugMode ? debugFlag : null)
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e)
        }
      }, 2000)
    }
    return (): void => clearTimeout(timer)
  }, [operationId])

  useEffect(() => {
    shouldCompareStatuses &&
      redirectToConfirmationPage(result.data.paymentTerminalOperationProgress.status, vesselName, reservationId)
  }, [shouldCompareStatuses])

  return (
    <Root>
      <Grid container>
        <Grid direction="column" container item xs={9}>
          <BorderedDiv>
            <Grid container direction="row" item xs={12}>
              <Grid container item xs={6}>
                <PaymentTable
                  paymentObject={forwardPaymentObject.paymentObject}
                  borderStyle={borderStyle}
                  hasBorder={!!backwardPaymentObject}
                />
              </Grid>
              <Grid container justify={'center'} item xs={6}>
                {/*Lower code will be changed as soon as round trip are available vie reservation query*/}
                {backwardPaymentObject ? (
                  <PaymentTable paymentObject={backwardPaymentObject.paymentObject} borderStyle={borderStyle} />
                ) : (
                  <NoRoundTrip />
                )}
              </Grid>
            </Grid>
            <Grid container item xs={12}>
              <Box
                width={'100%'}
                display="flex"
                mt={2}
                pr={20}
                pl={5}
                justifyContent="space-between"
                alignItems="center"
              >
                <ActionPanel
                  {...actions}
                  // backText={t('Back to edit tickets')}
                  cancelText={t('Cancel and restart')}
                  isEnabled={true}
                  handleCancelButton={(): void => returnOneWayTrip(routeLeg, route)}
                  // customBackHandler={onBackClick}
                />
              </Box>
            </Grid>
          </BorderedDiv>
        </Grid>
        <Grid container direction="column" item xs={3}>
          <Grid container direction={'column'} alignItems={'center'} justify={'space-between'} item xs>
            <Box marginLeft={1.4} flexDirection="column" justifyContent="center" px={6} width={'100%'}>
              <PaymentSummary heading={t('Summary')} summaryData={forwardPaymentObject.summaryObject} />
            </Box>
            <Box marginLeft={1.6} flexDirection="column" justifyContent="center" px={6}>
              <Terms terms={terms} hasBoldTerm={true} callBack={callBack} />
            </Box>
            <Box marginLeft={1.6} flexDirection="column" justifyContent="center">
              {isZeroPricedReservation ? (
                <Box display="flex" justifyContent="center" mb={2}>
                  <SubmitButton onClick={handleZeroPriceReservation} isEnabled={true} isAdaptive={false}>
                    <SubmitText
                      dangerouslySetInnerHTML={{
                        __html: t('Continue to checkout', {
                          tagLowercaseStart: '<span class="lowercase-text">',
                          tagUppercaseStart: '<span class="uppercase-text">',
                          tagEnd: '</span>',
                        }),
                      }}
                    />
                  </SubmitButton>
                </Box>
              ) : (
                <PaymentActionPanel
                  contractText={t('Contract text')}
                  cardText={t('Proceed to card payment', {
                    tagLowercaseStart: '<span class="lowercase-text">',
                    tagUppercaseStart: '<span class="uppercase-text">',
                    tagEnd: '</span>',
                  })}
                  handleCardButton={handleCardModeClose}
                  handleContractButton={handleAddModeClose}
                  isEnabled={true}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <AddIdCardPaymentPopup
        open={openAddMode}
        handleOnClose={handleAddModeClose}
        dataForMutation={dataForMutation}
        payWithCard={handleCardModeClose}
        vesselName={vesselName}
        cancelInvalidReservation={(): void => returnOneWayTrip(routeLeg, route)}
      />
      <AddPaymentCardPopup
        open={openCardMode}
        handleOnClose={handleCardModeClose}
        dataForMutation={dataForMutation}
        vesselName={vesselName}
        cancelInvalidReservation={(): void => returnOneWayTrip(routeLeg, route)}
      />
      {isShadowed && (
        <Backdrop className={classes.backdrop} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Root>
  )
}
export default PaymentPanel
