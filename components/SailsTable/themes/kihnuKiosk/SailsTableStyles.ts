import styled from 'styled-components'
import SailRowComponent from './SailRow'

export const Root = styled.div`
  display: block;
  width: 100%;
`

export const SailRow = styled(SailRowComponent)`
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`
