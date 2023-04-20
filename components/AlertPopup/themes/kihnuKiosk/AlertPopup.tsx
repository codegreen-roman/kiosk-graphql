import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Dialog } from '@material-ui/core'
import { Icon } from '@components/Icon'
import { AlertPopupProps } from '@components/AlertPopup'
import {
  DialogWrapper,
  CloseDialog,
  CloseIconHolder,
  Header,
  Message,
  WarningIconHolder,
  CancelButtonIconHolder,
} from './AlertPopupStyles'
import { CancelButton, OkButton, OkButtonIconHolder } from '@styles/buttonStyles'
import { AlertPopupType } from '@interfaces/popupStatus'

const AlertPopup: FC<AlertPopupProps> = ({ alertOpen, handleAlertOnClose, handleOnSubmit, type, message }) => {
  const { t } = useTranslation()

  return (
    <Dialog
      open={alertOpen}
      onClose={handleAlertOnClose}
      maxWidth="md"
      PaperProps={{
        style: {
          overflow: 'unset',
        },
      }}
    >
      <CloseDialog onClick={handleAlertOnClose}>
        <CloseIconHolder as={Icon['close']} />
      </CloseDialog>
      <DialogWrapper>
        <Header>
          <WarningIconHolder as={Icon['warning']} />
          {t('Warning')}
        </Header>
        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
          <Message
            dangerouslySetInnerHTML={{
              __html: message,
            }}
          />
        </Box>
        <Box display-if={type === AlertPopupType.ERROR} display="flex" justifyContent="center" marginBottom="29px">
          <CancelButton onClick={handleAlertOnClose}>
            <CancelButtonIconHolder as={Icon['button-close']} />
            <Box paddingLeft="15px">{t('Close this')}</Box>
          </CancelButton>
        </Box>
        <Box display-if={type === AlertPopupType.ALERT} display="flex" justifyContent="center" marginBottom="29px">
          <Box marginRight="15px">
            <CancelButton onClick={handleAlertOnClose}>
              <CancelButtonIconHolder as={Icon['button-close']} />
              <Box paddingLeft="15px">{t('No')}</Box>
            </CancelButton>
          </Box>
          <OkButton onClick={handleOnSubmit}>
            <OkButtonIconHolder as={Icon['okMark']} />
            <Box paddingLeft="15px">{t('Yes')}</Box>
          </OkButton>
        </Box>
      </DialogWrapper>
    </Dialog>
  )
}

export default AlertPopup
