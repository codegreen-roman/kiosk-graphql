import React, { FC, ReactElement } from 'react'
import { Box, Grid } from '@material-ui/core'
import { IconHolder, SubHeading } from './InfoListStyles'
import { Text } from '@components/Text'
import { Icon } from '@components/Icon'
import { InfoListProps } from '@components/InfoList'
import { useTranslation } from 'react-i18next'
import { TextType } from '@components/Text/TextProps'

enum FlexDirection {
  column = 'column',
  row = 'row',
}

const InfoList: FC<InfoListProps> = ({
  heading = '',
  items = [],
  column = true,
  textProps = { type: TextType.DEFAULT },
  vesselCode = '',
}) => {
  const { t } = useTranslation()

  const orientation = column ? FlexDirection.column : FlexDirection.row
  return (
    <Box display="flex" flexDirection={FlexDirection.column}>
      <SubHeading>{t([heading], { ...(vesselCode && { vesselCode }) })}</SubHeading>
      <Grid container direction={orientation} spacing={3} alignItems="center">
        {items.map((item): ReactElement => {
          const { svg, data } = item
          if (!data) {
            return (
              <Grid key={svg} container direction={FlexDirection.row} item xs>
                <IconHolder as={Icon[svg]} />
              </Grid>
            )
          }
          return (
            <Grid key={data} container direction={FlexDirection.row} alignItems="center" item xs={12}>
              <Grid item container xs justify="flex-start">
                <IconHolder as={Icon[svg]} />
              </Grid>
              <Grid item xs={11}>
                <Text type={textProps.type}>{textProps.type !== TextType.WEATHER ? t([data]) : data}</Text>
              </Grid>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default InfoList
