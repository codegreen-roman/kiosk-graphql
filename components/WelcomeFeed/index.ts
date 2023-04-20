import { FC } from 'react'
import { chooseThemeComponent } from '@utils/theming'
import themeNames from '@const/themeNames'
import KihnuKiosk from './themes/kihnuKiosk/WelcomeFeed'
import { Values } from '@interfaces/salesCore'

export const FeedType = {
  promo: 'promo',
  news: 'news',
  warning: 'warning',
} as const

export interface WelcomeFeedProps {
  type: Values<typeof FeedType>
  image: string
  message: {
    translationKey: string
    text?: string
  }
}

export const WelcomeFeed: FC<WelcomeFeedProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
