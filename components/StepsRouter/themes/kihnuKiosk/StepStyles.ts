import { themeSettings } from '@themeSettings'
import styled, { css } from 'styled-components'
import { SimpleInterpolation } from 'styled-components'

const { header } = themeSettings.colors
const { primary } = themeSettings.fonts

interface RootProps {
  readonly active: boolean
  readonly passed: boolean
}

interface PointProps {
  readonly passed: boolean
}

export const Root = styled.div`
  position: relative;
  opacity: 0.35;

  &:not(:first-child) {
    margin-left: 130px;
  }

  &:not(:first-child)::before {
    content: '';
    position: absolute;
    top: 50%;
    right: calc(100% + 10px);
    display: block;
    width: 110px;
    height: 4px;
    background: ${header.content};
    border-radius: 2px;
  }

  ${({ active }: RootProps): false | ReadonlyArray<SimpleInterpolation> =>
    active &&
    css`
      opacity: 1;
    `}
`

export const Point = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
  border: 4px solid ${header.content};
  border-radius: 50%;

  ${({ passed }: PointProps): false | ReadonlyArray<SimpleInterpolation> =>
    passed &&
    css`
      cursor: pointer;

      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: calc(100% - 8px);
        height: calc(100% - 8px);
        background: ${header.content};
        border-radius: 50%;
      }
    `}
`

export const Label = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  word-break: keep-all;
  white-space: nowrap;
  font: normal 14px ${primary};
  color: ${header.content};
  cursor: pointer;
`
