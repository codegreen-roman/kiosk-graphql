import React, { FC } from 'react'
import { Box } from '@material-ui/core'
import { ImageWrapper, ContentSection, Heading } from './PromoStyles'
import { useTranslation } from 'react-i18next'

export interface PromoProps {
  image: string
  message: {
    translationKey: string
    text?: string
  }
  textColor: string
}

const Promo: FC<PromoProps> = ({ image, message, textColor }) => {
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
export default Promo
