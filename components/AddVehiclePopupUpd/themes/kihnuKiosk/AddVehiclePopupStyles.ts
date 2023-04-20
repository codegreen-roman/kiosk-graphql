import styled from 'styled-components'
import { themeSettings } from '@themeSettings'

const { dialog } = themeSettings.colors

export const ModalWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 1273px;
  height: auto;
  border-radius: 2px;
  overflow: hidden;
  border: 1px solid ${dialog.sectionBorder};
  background: white;
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14),
    0px 9px 46px 8px rgba(0, 0, 0, 0.12);
`

export const CloseIconHolder = styled.div`
  display: flex;
  justify-content: center;
`

export const CloseModal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -20px;
  right: -20px;
  width: 46px;
  height: 46px;
  background-color: ${dialog.closeButton};
  border-radius: 50%;
  z-index: 10;
`

export const DisablingLayer = styled.div<{ loading?: string }>`
  display: flex;
  z-index: ${(props): string => (props.loading ? '-10' : '10')};
`
