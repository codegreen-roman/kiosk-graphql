import { themeSettings } from '@themeSettings'
import styled from 'styled-components'
import { Container as ContainerComponent } from '@material-ui/core'
import { LangSwitcher as LangSwitcherComponent } from '@components/LangSwitcher'

const { header } = themeSettings.colors

export const Root = styled.div`
  width: 100%;
  background: ${header.background};
`

export const Container = styled(ContainerComponent)`
  position: relative;
  display: flex !important;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 104px;
  padding: 14px 0;
`

export const Relative = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

export const LogoHolder = styled.div`
  margin-right: 5vmin;
`

export const LeftSide = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
`

export const LangSwitcher = styled(LangSwitcherComponent)`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
`
