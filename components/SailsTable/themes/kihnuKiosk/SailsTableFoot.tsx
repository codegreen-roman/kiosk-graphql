import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@components/Icon'
import { Root, Message, IconHolder } from './SailsTableFootStyles'

export interface SailsTableFootProps {
  hasDangerGoods: boolean
  hasLocalPassengers: boolean
  hasCanceledSails: boolean
  isTicketsSoldOut: boolean
  hasRestrictedPrice: boolean
  hasReserveTickets: boolean
  isSomeReserveTicketsSoldOut: boolean
  noLocalsWarningFromAttributes: string
  warnings: string[]
}

const SailsTableHead: FC<SailsTableFootProps> = ({
  isTicketsSoldOut,
  hasLocalPassengers,
  hasDangerGoods,
  hasCanceledSails,
  hasRestrictedPrice,
  hasReserveTickets,
  isSomeReserveTicketsSoldOut,
  noLocalsWarningFromAttributes,
  warnings,
}) => {
  const { t } = useTranslation()

  return (
    <Root>
      <Message data-test="sold-out" display-if={isTicketsSoldOut} type="warning">
        {warnings && warnings.map((warning, index) => warning && (index === 0 ? `* ${warning} \n` : warning))}
      </Message>

      <Message data-test="local" display-if={hasLocalPassengers} type="annotation">
        {t('Presale')}
      </Message>

      <Message data-test="danger" display-if={hasDangerGoods} type="danger">
        <IconHolder as={Icon.danger} />
        {t('Dangerous goods')}
      </Message>

      <Message data-test="cancel" display-if={hasCanceledSails} type="error">
        <IconHolder as={Icon.anchor} />
        {t('Sail was cancelled')}
      </Message>

      <Message data-test="cancel" display-if={hasRestrictedPrice} type="default">
        <IconHolder as={Icon.noTrucks} />
        {t('Heavy trucks')}
      </Message>

      <Message data-test="locals-description" display-if={hasReserveTickets} type="default">
        {t('For locals')}
      </Message>

      <Message
        data-test="no-locals"
        display-if={isSomeReserveTicketsSoldOut && noLocalsWarningFromAttributes}
        type="danger"
      >
        ** {noLocalsWarningFromAttributes}
      </Message>
    </Root>
  )
}

export default SailsTableHead
