import { themeSettings } from '@themeSettings'
import { Icon } from '@components/Icon'
import styled from 'styled-components'

const { header } = themeSettings.colors
const { secondary } = themeSettings.fonts

export const Root = styled.div`
  display: flex;
  align-items: center;
`

export const ClockIcon = styled(Icon.clock)`
  margin-right: 10px;
`

export const Time = styled.div`
  font: normal 46px/62px ${secondary};
  color: ${header.content};
`
