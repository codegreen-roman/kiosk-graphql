import React, { FC } from 'react'
import { Grid, GridProps } from '@material-ui/core'

export type RowProps = GridProps

export const Row: FC<GridProps> = (props) => <Grid {...props} container={true} />
