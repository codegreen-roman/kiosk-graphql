import React, { FC } from 'react'
import { Box, Dialog } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { EditIdCardPopupProps } from '@components/EditIdCardPopup'
import { Icon } from '@components/Icon'
import {
  DialogWrapper,
  CloseDialog,
  ContentWrapper,
  Title,
  Description,
  IdNumber,
  CloseIconHolder,
  MinusIconHolder,
  RemoveIdNumber,
  ConfimIdDeletion,
} from './EditIdCardPopupStyles'
import { DefaultButton } from '@styles/buttonStyles'

const EditIdCardPopup: FC<EditIdCardPopupProps> = ({
  open,
  handleOnClose,
  selectedIdNumberIdx,
  setSelectedIdNumberIdx,
  data,
  handleConfirmDeletion,
}) => {
  const { t } = useTranslation()
  const { idNumbers, type } = data
  return (
    <Dialog
      open={open}
      onClose={handleOnClose}
      maxWidth="lg"
      PaperProps={{
        style: {
          overflow: 'unset',
        },
      }}
    >
      <CloseDialog onClick={handleOnClose}>
        <CloseIconHolder as={Icon['close']} />
      </CloseDialog>
      <DialogWrapper>
        <ContentWrapper>
          <Box display="flex" flexDirection="column" alignItems="center" width="100%">
            <Title>{t('Edit ID')}</Title>
            <Description>{t('Select ID')}</Description>
            <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="center">
              {idNumbers?.map((number, idx) => {
                const isSelected: boolean = selectedIdNumberIdx === idx
                return (
                  <IdNumber key={idx} onClick={(): void => setSelectedIdNumberIdx(idx)} isSelected={isSelected}>
                    <span>{number}</span>
                    <RemoveIdNumber isSelected={isSelected}>
                      <MinusIconHolder as={Icon['minus']}></MinusIconHolder>
                    </RemoveIdNumber>
                  </IdNumber>
                )
              })}
            </Box>
          </Box>
          <ConfimIdDeletion display-if={selectedIdNumberIdx !== -1}>
            {t('Confirm ID deletion', { idNumber: idNumbers[selectedIdNumberIdx] })}
          </ConfimIdDeletion>
          <Box display="flex" justifyContent="center">
            <Box display-if={selectedIdNumberIdx === -1} width="399px">
              <DefaultButton onClick={handleOnClose}>{t('Close this')}</DefaultButton>
            </Box>
            <Box display-if={selectedIdNumberIdx !== -1} display="flex">
              <Box width="399px">
                <DefaultButton background="primaryBackground" onClick={(): void => setSelectedIdNumberIdx(-1)}>
                  {t('Cancel')}
                </DefaultButton>
              </Box>
              <Box margin="0 5px" />
              <Box width="399px">
                <DefaultButton onClick={(): void => handleConfirmDeletion(type)}>{t('Confirm')}</DefaultButton>
              </Box>
            </Box>
          </Box>
        </ContentWrapper>
      </DialogWrapper>
    </Dialog>
  )
}

export default EditIdCardPopup
