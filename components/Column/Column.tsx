import React, { FC } from 'react'
import { Grid, GridProps } from '@material-ui/core'

export type ColumnProps = Readonly<GridProps>

export const Column: FC<GridProps> = (props) => <Grid {...props} item />
