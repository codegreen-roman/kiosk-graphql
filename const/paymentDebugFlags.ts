import PAYMENT_STATUS from '@const/paymentStatuses'

export const debugFlag = {
  payment: {
    emulatePayment: true,
    expectedErrorCode: PAYMENT_STATUS.FAILED_CANCELLED,
    delayInSeconds: 3,
  },
  printer: {
    emulatePrint: true,
  },
}
export const debugFlagNewAttempt = {
  payment: {
    emulatePayment: true,
    // expectedErrorCode: PAYMENT_STATUS.UNKNOWN,
    delayInSeconds: 3,
  },
  printer: {
    emulatePrint: true,
  },
}
