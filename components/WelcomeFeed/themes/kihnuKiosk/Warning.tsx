import React, { FC } from 'react'
import { Box } from '@material-ui/core'
import { ImageWrapper, ContentSection, Heading } from './WarningStyles'
import { useTranslation } from 'react-i18next'
import { PromoProps } from '@components/WelcomeFeed/themes/kihnuKiosk/Promo'

const Warning: FC<PromoProps> = ({ image, message, textColor }) => {
  const { t } = useTranslation()
  return (
    <ImageWrapper image={image}>
      <Box display="flex">
        <ContentSection>
          <Heading textColor={textColor}>{t(message.translationKey)}</Heading>
        </ContentSection>
      </Box>
    </ImageWrapper>
  )
}
export default Warning
