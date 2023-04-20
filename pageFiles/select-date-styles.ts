import styled from 'styled-components'
import { themeSettings } from '@themeSettings'
import { Row as RowComponent } from '@components/Row'
import { Column as ColumnComponent } from '@components/Column'

const { contentDivider } = themeSettings.colors

export const Row = styled(RowComponent)`
  && {
    display: flex;
    flex-wrap: nowrap;
  }
`

export const Column = styled(ColumnComponent)`
  display: flex;
  flex-shrink: 0;
  flex-grow: 0;
  width: 50%;

  &:not(:last-child) {
    border-right: 1px solid ${contentDivider};
    padding-right: 10px;
  }

  &:not(:first-child) {
    padding-left: 10px;
  }
`
