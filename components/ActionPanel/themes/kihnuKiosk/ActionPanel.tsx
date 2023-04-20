import React, { FC, Fragment } from 'react'
import { Root } from '@components/ActionPanel/themes/kihnuKiosk/ActionPanelStyles'
import Link from 'next/link'
import { Box, Grid } from '@material-ui/core'
import { Icon } from '@components/Icon'
import { ActionPanelProps } from '@components/ActionPanel'
import {
  BackTextButton,
  CancelButton,
  SubmitButton,
  SubmitText,
  BackTextButtonIconHolder,
  CancelButtonIconHolder,
  SubmitButtonIconHolder,
} from '@styles/buttonStyles'
import { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useHotkeys } from 'react-hotkeys-hook'
import { AppStateTypes, useAppState } from '../../../../hooks/useAppState'

const ActionPanel: FC<ActionPanelProps> = ({
  backText,
  cancelText,
  cancelHref,
  handleCancelButton,
  submitText,
  submitHref,
  isEnabled,
  onClickAsync,
  isBusy = false,
  customBackHandler,
}) => {
  const { back }: NextRouter = useRouter()

  const { dispatch } = useAppState()

  useHotkeys('ctrl+shift+f', () => {
    dispatch({ type: AppStateTypes.cursorEnable, payload: true })
  })

  const handleBackClick = customBackHandler || back

  return (
    <Root>
      <Grid container justify="space-around" alignItems="center">
        <Grid item xs>
          <Box display-if={backText} display="flex" justifyContent="flex-start">
            <BackTextButton onClick={handleBackClick}>
              <BackTextButtonIconHolder as={Icon['arrow-back']} />
              {backText}
            </BackTextButton>
          </Box>
        </Grid>
        <Grid display-if={cancelText} item xs>
          <Box display="flex" justifyContent="center">
            {typeof cancelHref !== 'undefined' ? (
              <Link href={`/${cancelHref}`} passHref>
                <CancelButton onClick={handleCancelButton}>
                  <CancelButtonIconHolder as={Icon['button-close']} />
                  {cancelText}
                </CancelButton>
              </Link>
            ) : (
              <CancelButton onClick={handleCancelButton}>
                <CancelButtonIconHolder as={Icon['button-close']} />
                {cancelText}
              </CancelButton>
            )}
          </Box>
        </Grid>
        <Grid display-if={submitText} item xs>
          <Box display="flex" justifyContent="flex-end">
            <Link passHref href={`/${submitHref}`} display-if={!onClickAsync}>
              <SubmitButton isEnabled={isEnabled}>
                <SubmitText dangerouslySetInnerHTML={{ __html: submitText }} />
                <SubmitButtonIconHolder as={Icon['arrow-right']} />
              </SubmitButton>
            </Link>
            <Fragment display-if={onClickAsync}>
              <SubmitButton isEnabled={isEnabled} onClick={onClickAsync}>
                <SubmitText dangerouslySetInnerHTML={{ __html: submitText }} />
                <SubmitButtonIconHolder display-if={!isBusy} as={Icon['arrow-right']} />
                <CircularProgress color="secondary" display-if={isBusy} />
              </SubmitButton>
            </Fragment>
          </Box>
        </Grid>
      </Grid>
    </Root>
  )
}

export default ActionPanel
