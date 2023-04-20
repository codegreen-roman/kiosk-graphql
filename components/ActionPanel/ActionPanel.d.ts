type Default = {
  backText: string
  cancelText: string
  cancelHref: string
  submitText: string
  submitHref: string
  isEnabled?: boolean
}
type Payment = {
  cardText: string
  cardHref: string
  contractText: string
  contractHref: string
  handleCardButton?(): void
  handleContractButton?(): void
}
export interface ActionPanels {
  type: 'default' | 'payment'
  actions: Default | Payment
}

declare const actionPanels: ActionPanels
