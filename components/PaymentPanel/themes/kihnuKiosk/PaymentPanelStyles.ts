import styled from 'styled-components'
import { getContentBlockColors, getContentDividerColors, getFonts, getTextColors } from '@themeSettings'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

const { secondary } = getFonts()

const textColors = getTextColors()
const contentBlockColors = getContentBlockColors()
const contentDividerColors = getContentDividerColors()

export const Root = styled.div`
  margin: 20px 0px 30px 0px;
`

export const TextWrapper = styled.div`
  max-width: 246px;
  font-family: ${secondary};
  font-size: 30px;
  letter-spacing: 0.96px;
  text-align: center;
  color: ${textColors.annotation};
  text-transform: uppercase;
`
export const BorderedDiv = styled.div`
  display: flex;
  flex-direction: column;
  border-width: 0px 1px 0px 0px;
  border-style: solid;
  border-color: ${contentDividerColors.contentDivider};
`

export const OffsetSpan = styled.span`
  margin-left: -12px;
`
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: contentBlockColors.whiteText,
    },
  })
)
