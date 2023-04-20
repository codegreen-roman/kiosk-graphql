const ID_STATUS = {
  INITIAL: 'INITIAL',
  STARTED: 'READ_ID_CARD_REQUEST_START',
  READ_OK: 'READ_ID_CARD_REQUEST_READ_OK',
  SUCCESS: 'READ_ID_CARD_REQUEST_SUCCESS',
  FAILED: 'READ_ID_CARD_REQUEST_FAILED',
  FAILED_TIMEOUT: 'READ_ID_CARD_REQUEST_FAILED_TIMEOUT',
  FAILED_CANCELLED: 'READ_ID_CARD_REQUEST_FAILED_CANCELLED',
  READER_ERROR: 'READ_ID_CARD_REQUEST_FAILED_READER_ERROR',
  UNKNOWN: 'UNKNOWN',
  EXPIRED: 'DISCOUNT_IS_EXPIRED',
  NO_DISCOUNT_ON_ROUTE: 'NO_DISCOUNT_ON_ROUTE',
  USED_ON_SAIL: 'PAX_DISCOUNT_ALREADY_USED_ON_SAIL',
  DISCOUNT_ALREADY_USED_ON_SAIL: 'PAX_DISCOUNT_ALREADY_USED_IN_RESERVATION' || 'DISCOUNT_ALREADY_USED_ON_SAIL',
  DISCOUNT_ALREADY_USED_IN_RESERVATION: 'DISCOUNT_ALREADY_USED_IN_RESERVATION',
  RESERVATION_NOT_FOUND: 'RESERVATION_NOT_FOUND',
  CONNECT_FAILED: 'CONNECT_FAILED',
  PAYMENT_TERMINAL_CONNECT_FAILED: 'PAYMENT_TERMINAL_CONNECT_FAILED',
}
export default ID_STATUS