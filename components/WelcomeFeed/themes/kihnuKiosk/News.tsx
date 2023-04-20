import React, { FC } from 'react'
import { Box } from '@material-ui/core'
import { ImageWrapper, ContentSection, Heading, Paragraph } from './NewsStyles'
import { PromoProps } from '@components/WelcomeFeed/themes/kihnuKiosk/Promo'
import { useTranslation } from 'react-i18next'

const News: FC<PromoProps> = ({ image, message, textColor }) => {
  const { t } = useTranslation()
  return (
    <ImageWrapper image={image}>
      <Box display="flex">
        <ContentSection>
          <Heading textColor={textColor}>{t(message.translationKey)}</Heading>
          <Paragraph dangerouslySetInnerHTML={{ __html: message.text }} textColor={textColor}></Paragraph>
        </ContentSection>
      </Box>
    </ImageWrapper>
  )
}
export default News
