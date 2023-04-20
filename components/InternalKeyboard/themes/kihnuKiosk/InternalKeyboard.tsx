import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Keyboard from 'react-simple-keyboard'
import { InternalKeyboardProps } from '@components/InternalKeyboard'
import { KeyboardWrapper, KeyboardCustomStyle, MainPad, BackspacePad, NumPad } from './InternalKeyboardStyles'
import 'react-simple-keyboard/build/css/index.css'

const InternalKeyboard: FC<InternalKeyboardProps> = ({ step, setVehicleNumber }) => {
  const keyboard = React.useRef()

  const commonKeyboardOptions = {
    theme: 'simple-keyboard hg-theme-default hg-layout-default',
    physicalKeyboardHighlight: true,
    syncInstanceInputs: true,
    mergeDisplay: true,
    debug: false,
  }

  const { t } = useTranslation()

  const keyboardOptions = {
    ...commonKeyboardOptions,

    layout: {
      default: ['Q W E R T Y U I O P', 'A S D F G H J K L', 'Z X C V B N M', '{space}'],
    },
    display: {
      '{space}': `${t('Space')}`,
    },
  }

  const keyboardArrowsOptions = {
    ...commonKeyboardOptions,

    layout: {
      default: ['{backspace}'],
    },
    display: {
      '{backspace}': `⇤ ${t('Delete')}`,
    },
  }

  const keyboardNumPadOptions = {
    ...commonKeyboardOptions,
    layout: {
      default: [
        '{numpad7} {numpad8} {numpad9}',
        '{numpad4} {numpad5} {numpad6}',
        '{numpad1} {numpad2} {numpad3}',
        '{numpad0} {numpadsubtract}',
      ],
    },
  }

  const handleVehicleOnInputChange = (number: string): void => {
    number.length <= 15 ? setVehicleNumber(number) : null
  }

  return (
    <KeyboardWrapper>
      <KeyboardCustomStyle className={'keyboardContainer'}>
        <MainPad>
          <Keyboard
            keyboardRef={(r): void => (keyboard.current = r)}
            layoutName={'default'}
            {...keyboardOptions}
            onChange={(number: string): void => {
              if (step === 0) {
                handleVehicleOnInputChange(number)
              }
            }}
          />
        </MainPad>
        <BackspacePad>
          <Keyboard
            baseClass={'simple-keyboard-arrows'}
            {...keyboardArrowsOptions}
            onChange={(number: string): void => {
              if (step === 0) {
                handleVehicleOnInputChange(number)
              }
            }}
          />
        </BackspacePad>
        <NumPad>
          <Keyboard
            baseClass={'simple-keyboard-numpad'}
            {...keyboardNumPadOptions}
            onChange={(number: string): void => {
              if (step === 0) {
                handleVehicleOnInputChange(number)
              }
            }}
          />
        </NumPad>
      </KeyboardCustomStyle>
    </KeyboardWrapper>
  )
}

export default InternalKeyboard
