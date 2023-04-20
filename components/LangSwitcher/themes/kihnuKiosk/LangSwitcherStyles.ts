import styled, { css, FlattenSimpleInterpolation } from 'styled-components'
import { themeSettings } from '@themeSettings'

const { header } = themeSettings.colors

export const Root = styled.div`
  display: flex;
`

interface ItemProps {
  active: boolean
}

export const Item = styled.div`
  position: relative;
  display: block;
  border-radius: 50%;
  cursor: pointer;

  &:not(:last-child) {
    margin-right: 30px;
  }

  ${({ active }: ItemProps): FlattenSimpleInterpolation =>
    active &&
    css`
      cursor: default;

      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: calc(100% + 15px);
        height: calc(100% + 15px);
        border-radius: 50%;
        border: 4px solid ${header.content};
      }
    `}
`

export const IconHolder = styled.div`
  border-radius: 50%;
  overflow: hidden;
`
