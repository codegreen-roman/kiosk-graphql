// import ID_STATUS from '@const/./idCardStatuses'

export const debugFlag = {
  idCard: {
    // valid for KIH-MUN
    // expectedPersonalIdentificationNumber: 39212190229,
    // expectedPersonalIdentificationNumber: 48703014236,
    // expectedPersonalIdentificationNumber: 35601304227,
    // expectedPersonalIdentificationNumber: 37102154222,
    // expectedPersonalIdentificationNumber: 49107300252,
    // expectedPersonalIdentificationNumber: 46812182719,

    // invalid id-number for debugging
    // expectedPersonalIdentificationNumber: 35106032725,

    // valid for SOR-TRI
    expectedPersonalIdentificationNumber: 38904220299,
    // expectedPersonalIdentificationNumber: 38107030263,
    // expectedPersonalIdentificationNumber: 36608260311,

    // expectedPersonalIdentificationNumber: 36608260311,
    // expectedPersonalIdentificationNumber: 49107300252,

    // valid for SVI-ROH
    // expectedPersonalIdentificationNumber: 35807064722,
    // expectedPersonalIdentificationNumber: 34404090236,
    // expectedPersonalIdentificationNumber: 48208174718,
    // expectedPersonalIdentificationNumber: 35703236015,
    // expectedPersonalIdentificationNumber: 35308280369,
    // expectedPersonalIdentificationNumber: 36307134215,
    // expectedPersonalIdentificationNumber: 49107300252,

    // expectedPersonalIdentificationNumber: 46008075330,

    // expectedPersonalIdentificationNumber: 38704096529,
    // expectedPersonalIdentificationNumber: 49107300252,
    // expectedPersonalIdentificationNumber: 46008075330,
    // expectedPersonalIdentificationNumber: 45608010547,
    // expectedPersonalIdentificationNumber: 38007080011,
    // expectedPersonalIdentificationNumber: 36104260081,
    // expectedPersonalIdentificationNumber: 35201154728,
    // expectedPersonalIdentificationNumber: 35803254718,
    // expectedPersonalIdentificationNumber: 46312174713,

    // Pupil
    // expectedPersonalIdentificationNumber: 61107250016,

    // expectedPersonalIdentificationNumber: 45505278439,
    // expectedPersonalIdentificationNumber: 48007091779,

    // expectedErrorCode: ID_STATUS.CONNECT_FAILED,
    delayInSeconds: 3,
  },
}

export const debugFlagNewAttempt = {
  idCard: {
    // valid for KIH-MUN
    // expectedPersonalIdentificationNumber: 37102154222,
    // expectedPersonalIdentificationNumber: 39212190229,

    // invalid id-number for debugging
    // expectedPersonalIdentificationNumber: 35106032725,

    // valid for SOR-TRI
    expectedPersonalIdentificationNumber: 36608260311,

    // valid for SVI-ROH
    // expectedPersonalIdentificationNumber: 35807064722,
    // expectedPersonalIdentificationNumber: 34404090236,
    // expectedPersonalIdentificationNumber: 48208174718,
    // expectedPersonalIdentificationNumber: 35703236015,
    // expectedPersonalIdentificationNumber: 35308280369,
    // expectedPersonalIdentificationNumber: 36307134215,

    // expectedPersonalIdentificationNumber: 49107300252,
    // expectedPersonalIdentificationNumber: 45608010547,
    // expectedPersonalIdentificationNumber: 45508034786,

    // Retired
    // expectedPersonalIdentificationNumber: 46312174713,

    // expectedPersonalIdentificationNumber: 46008075330,
    // expectedPersonalIdentificationNumber: 38007080011,

    // expectedErrorCode: ID_STATUS.FAILED,
    delayInSeconds: 3,
  },
}
