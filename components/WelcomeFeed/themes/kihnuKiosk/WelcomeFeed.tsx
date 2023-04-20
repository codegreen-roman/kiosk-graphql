import React, { FC } from 'react'
import { FeedType, WelcomeFeedProps } from '@components/WelcomeFeed'
import { Root } from './WelcomeFeedStyles'

import Promo from './Promo'
import Warning from './Warning'
import News from './News'

const WelcomeFeed: FC<WelcomeFeedProps> = ({ type, image, message }) => {
  const isPromo = type === FeedType.promo
  const isNews = type === FeedType.news
  const isWarning = type === FeedType.warning

  return (
    <Root>
      <Promo
        display-if={isPromo}
        image={image}
        message={message}
        textColor={image === 'girl' ? 'mainText' : 'whiteText'}
      />
      <Warning display-if={isWarning} image={image} message={message} textColor="whiteText" />
      <News display-if={isNews} image={image} message={message} textColor="mainText" />
    </Root>
  )
}

export default WelcomeFeed
