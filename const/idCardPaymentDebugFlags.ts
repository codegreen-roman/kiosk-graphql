import ID_PAYMENT_STATUS from '@const/./idPaymentStatuses'

export const debugFlag = {
  idCard: {
    // valid for one company
    // expectedPersonalIdentificationNumber: 39212190229,

    // valid for multiple companies
    // expectedPersonalIdentificationNumber: 46610010274,
    // expectedPersonalIdentificationNumber: 10101010005,
    // expectedPersonalIdentificationNumber: 36606202788,
    expectedPersonalIdentificationNumber: 38708152724,
    // expectedPersonalIdentificationNumber: 46703270243,
    // KIH-MUN
    // expectedPersonalIdentificationNumber: 49107300252,

    // invalid for any company
    // expectedPersonalIdentificationNumber: 44501222738,
    // expectedPersonalIdentificationNumber: 48007122740,
    // KIH-MUN
    // expectedPersonalIdentificationNumber: 39009274713,

    // valid for SOR-TRI
    // expectedPersonalIdentificationNumber: 38904220299,

    // expectedErrorCode: ID_PAYMENT_STATUS.FAILED_NOT_ALLOWED,
    delayInSeconds: 3,
  },
  printer: {
    emulatePrint: true,
  },
}

export const debugFlagNewAttempt = {
  idCard: {
    // valid for KIH-MUN
    // expectedPersonalIdentificationNumber: 37102154222,

    // invalid id-number for debugging
    // expectedPersonalIdentificationNumber: 35106032725,

    // valid for one company
    // expectedPersonalIdentificationNumber: 39212190229,

    // valid for multiple companies
    // expectedPersonalIdentificationNumber: 46610010274,
    // expectedPersonalIdentificationNumber: 10101010005,
    expectedPersonalIdentificationNumber: 36606202788,

    // invalid for any company
    // expectedPersonalIdentificationNumber: 44501222738,

    // valid for SOR-TRI
    // expectedPersonalIdentificationNumber: 38904220299,

    // valid for SOR-TRI
    // expectedPersonalIdentificationNumber: 36608260311,

    expectedErrorCode: ID_PAYMENT_STATUS.LOW_FUNDS,
    delayInSeconds: 3,
  },
}
