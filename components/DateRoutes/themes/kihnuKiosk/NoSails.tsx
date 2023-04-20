import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Box } from '@material-ui/core'
import CardMedia from '@material-ui/core/CardMedia'
import { TextWrapper } from '@components/DateRoutes/themes/kihnuKiosk/DateRouteStyles'

const NoSails: FC = () => {
  const { t } = useTranslation()
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-around"
      alignItems="center"
      width={'90%'}
      height={'100%'}
    >
      <Box mb={2}>
        <CardMedia component="img" image="/themes/kihnuKiosk/images/no-sails.png" />
      </Box>
      <Box display="flex" mb={2}>
        <TextWrapper>{t('No more sails')}</TextWrapper>
      </Box>
      <Box display="flex" width="70%">
        <TextWrapper>{t('Choose date')}</TextWrapper>
        {/* Will be uncommented if button is necessary, based on demo discussion */}
        {/*<DefaultButton isSecondary={true} onClick={handleNewDate}>
          <Box display="flex" width={'100%'}>
            <p>{t('Purchase next sail')}</p>
          </Box>
        </DefaultButton>*/}
      </Box>
    </Box>
  )
}

export default NoSails
