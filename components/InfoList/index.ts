import KihnuKiosk from './themes/kihnuKiosk/InfoList'
import themeNames from '@const/themeNames'
import { chooseThemeComponent } from '@utils/theming'
import { FC } from 'react'
import { TextProps } from '@components/Text/TextProps'

interface ListItem {
  svg: string
  data: string
}
export interface InfoListProps {
  heading: string
  items: ListItem[]
  column?: boolean
  textProps?: TextProps
  vesselCode?: string
}

export const InfoList: FC<InfoListProps> = chooseThemeComponent({
  [themeNames.kihnuKiosk]: KihnuKiosk,
})
