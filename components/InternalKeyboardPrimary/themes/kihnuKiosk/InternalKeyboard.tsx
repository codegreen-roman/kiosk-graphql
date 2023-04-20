import React, { FC, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Keyboard from 'react-simple-keyboard'
import { InternalKeyboardProps } from '@components/InternalKeyboardPrimary'
import {
  KeyboardWrapper,
  KeyboardCustomStyle,
  MainPad,
  ActionKeys,
  BackspacePad,
  EnterPad,
  NumPad,
} from './InternalKeyboardStyles'
import 'react-simple-keyboard/build/css/index.css'
import KeyboardReact from 'react-simple-keyboard'

const InternalKeyboardPrimary: FC<InternalKeyboardProps> = ({
  setInputs,
  inputName,
  onEnter,
  enterIsEnabled,
  mainPadIsEnabled,
  enterIsShown,
  shouldRemoveInput,
  isNumerical,
}) => {
  const keyboard = useRef<KeyboardReact>(null)

  const commonKeyboardOptions = {
    theme: 'simple-keyboard hg-theme-default hg-layout-default',
    physicalKeyboardHighlight: false,
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

  const keyboardEnterOptions = {
    ...commonKeyboardOptions,

    layout: {
      default: ['{enter}'],
    },
    display: {
      '{enter}': `↵  ${t('Enter')}`,
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

  const onChangeAll = (inputs): void => {
    setInputs({ ...inputs })
  }
  const onKeyPress = (button): void => {
    if (button === '{enter}') {
      onEnter()
    }
  }

  useEffect(() => {
    if (shouldRemoveInput) {
      keyboard.current.clearInput(inputName)
    }
  }, [inputName, shouldRemoveInput])
  if (isNumerical) {
    return (
      <KeyboardWrapper isNumerical={isNumerical}>
        <KeyboardCustomStyle isNumerical={isNumerical} className={'keyboardContainer'}>
          <NumPad>
            <Keyboard
              baseClass={'simple-keyboard-numpad'}
              {...keyboardNumPadOptions}
              inputName={inputName}
              onChangeAll={onChangeAll}
            />
          </NumPad>
          <ActionKeys>
            <BackspacePad>
              <Keyboard
                baseClass={'simple-keyboard-arrows'}
                {...keyboardArrowsOptions}
                inputName={inputName}
                onChangeAll={onChangeAll}
              />
            </BackspacePad>
            <EnterPad display-if={enterIsShown} isEnabled={enterIsEnabled}>
              <Keyboard
                baseClass={'simple-keyboard-enter'}
                {...keyboardEnterOptions}
                inputName={inputName}
                onKeyPress={onKeyPress}
              />
            </EnterPad>
          </ActionKeys>
        </KeyboardCustomStyle>
      </KeyboardWrapper>
    )
  }
  return (
    <KeyboardWrapper>
      <KeyboardCustomStyle className={'keyboardContainer'}>
        <MainPad isEnabled={mainPadIsEnabled}>
          <Keyboard
            keyboardRef={(r): void => (keyboard.current = r)}
            layoutName={'default'}
            {...keyboardOptions}
            inputName={inputName}
            onChangeAll={onChangeAll}
          />
        </MainPad>
        <ActionKeys>
          <BackspacePad>
            <Keyboard
              baseClass={'simple-keyboard-arrows'}
              {...keyboardArrowsOptions}
              inputName={inputName}
              onChangeAll={onChangeAll}
            />
          </BackspacePad>
          <EnterPad display-if={enterIsShown} isEnabled={enterIsEnabled}>
            <Keyboard
              baseClass={'simple-keyboard-enter'}
              {...keyboardEnterOptions}
              inputName={inputName}
              onKeyPress={onKeyPress}
            />
          </EnterPad>
        </ActionKeys>
        <NumPad>
          <Keyboard
            baseClass={'simple-keyboard-numpad'}
            {...keyboardNumPadOptions}
            inputName={inputName}
            onChangeAll={onChangeAll}
          />
        </NumPad>
      </KeyboardCustomStyle>
    </KeyboardWrapper>
  )
}

export default InternalKeyboardPrimary
