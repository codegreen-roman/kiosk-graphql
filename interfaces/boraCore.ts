import { Values } from '@interfaces/salesCore'

export interface TimetablePoint {
  date: string
  port: string
  time: string
  timestamp: Date
  locationName: string
}

export const SailStatus = {
  CANCELLED: 'CANCELLED',
  CHECK_IN: 'CHECK-IN',
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  TRAVELLED: 'TRAVELLED',
} as const

export type SailStatusType = Values<typeof SailStatus>

export enum SailDirection {
  FORWARD = 'FORWARD',
  BACKWARD = 'BACKWARD',
}

export interface TimetableRow {
  arrival: TimetablePoint
  departure: TimetablePoint
  createdAt: Date
  dangerousGoods: boolean
  departureDate: string
  externalSystemId: string
  route: string
  routeLeg: string
  sailRefId: number
  salesClosed: boolean
  schedule: number
  status: SailStatusType
}

export enum ValueLevel {
  LOW = 'low',
  MIDDLE = 'mid',
  HIGH = 'high',
  HIGH_UPCOMING = 'highUpcoming',
}

export interface DatesDiff {
  isFirstDateNewer: boolean
  isSecondDateNewer: boolean
  isDifferent: boolean
  days: number
  hours: number
  minutes: number
  seconds: number
}

interface TelephoneOutput {
  intlCode: number
  phoneNumber: number
}

export interface ReservationGuest {
  seqN: number
  firstName: string
  lastName: string
  personalIdentificationNumber: string
  __typename: string
}

export interface ReservationVehicle {
  seqN: number
  lengthInCm: number
  widthInCm: number
  heightInCm: number
  weightInKg: number
  type: string
  licencePlate: string
  handicapped: boolean
  companyRegistrationNumber: string
  __typename: string
}
export const OwnerTypeNames = {
  RESERVATION_VEHICLE: 'ReservationVehicle',
  RESERVATION_GUEST: 'ReservationGuest',
}

type ItemOwner = ReservationGuest | ReservationVehicle

export interface ReservationItem {
  quantity: number
  priceCategory: string
  priceCategorySubType: string
  priceCategoryTranslation: string
  pricePerUnit: number
  price: number
  sailPackageSeqN: number
  type: string
  resident: boolean
  inventoryClass: string
  owners: ItemOwner[]
  ownerSeqNs: number[]
  promotion?: string
  promotionText?: string
  promotionPrice?: number
}

interface SailPackage {
  seqN: number
  code: string
  title: string
  sailRefs: SailRef[]
}

interface SailRef {
  sailRefId: number
  route: string
  routeLeg: string
  routeLegTitle: string
  vessel: string
  vesselTitle: string
  departureDate: string
  departureTime: string
  departureAt: string
  port: string
  departureFrom: string
  items: ReservationItem[]
}

type totalPrice = {
  totalPrice: {
    amount: number
    amountFormatted: string
    amountWithoutTaxes: number
    currency: string
    formatPattern: string
    tax: number
    taxAmount: number
  }
}

export enum BoraReservationStatus {
  TEMP = 'TEMP',
  OFFER = 'OFFER',
  BOOKED = 'BOOKED',
  OK = 'OK',
  CANCELLED = 'CN',
  DELETED = 'DL',
}

export enum VehicleWidth {
  LESS_THAN_200 = 'LESS_THAN_200',
  BETWEEN_200_AND_250 = 'BETWEEN_200_AND_250',
  MORE_THAN_250 = 'MORE_THAN_250',
}
export enum VehicleHeight {
  LESS_THAN_400 = 'LESS_THAN_400',
  MORE_THAN_400 = 'MORE_THAN_400',
}

export const VehicleSizes = [
  {
    code: 'SOR-TRI-SOR',
    widthRange: {
      less: {
        value: 190,
        border: '2',
      },
      between: {
        value: 210,
      },
      more: {
        value: 270,
        border: '2.5',
      },
    },
    heightRange: {
      less: {
        value: 390,
        border: '4',
      },
      more: {
        value: 410,
        border: '4',
      },
    },
  },
  {
    code: 'DEFAULT',
    widthRange: {
      less: {
        value: 190,
        border: '2',
      },
      between: {
        value: 210,
      },
      more: {
        value: 270,
        border: '2.6',
      },
    },
    heightRange: {
      less: {
        value: 390,
        border: '4',
      },
      more: {
        value: 410,
        border: '4',
      },
    },
  },
]

export const VehicleLength = {
  MIN: 5,
  MAX: 30,
} as const
export const VehicleWeight = {
  MIN: 2,
  MAX: 70,
} as const

export enum VehicleParameter {
  HEADER = '_HEADER',
  WIDTH = '_WIDTH',
  HEIGHT = '_HEIGHT',
}
export enum PortsToCheckDate {
  SVI = 'SVI',
  ROH = 'ROH',
}

export const companyRegNumberTriggerLength = 8
export const manualIdTriggerLength = 11

export const VesselPrefix = {
  DEFAULT: 'P/L ',
} as const

export const CustomDestination = {
  MUN_MAN: {
    code: 'MUN-MAN',
    map: 'map-man-mun',
  },
  MAN_MUN: {
    code: 'MAN-MUN',
    map: 'map-man-mun',
  },
  MUN_KIH: {
    code: 'MUN-KIH',
    map: 'map-mun-kih',
  },
} as const

export interface ReservationOwnerOutput {
  firstName: string
  lastName: string
  email: string
  phones: TelephoneOutput[]
}
export interface ReservationLoad {
  reservationId: number
  status: BoraReservationStatus
  reservationOwner: ReservationOwnerOutput
  sailPackages: SailPackage[]
  paymentInfo: totalPrice
}

export interface PaymentTerminalOperation {
  operationId: string
}

export type GeneralCodeAndTitle = {
  code: string
  title?: string
  value?: never
}

export type RouteLegPart = {
  location: string
} & GeneralCodeAndTitle

export type RouteLeg = {
  parts: RouteLegPart[]
} & GeneralCodeAndTitle

export type RouteAttribute = GeneralCodeAndTitle

export type Route = {
  legs: RouteLeg[]
  attributes?: RouteAttribute[]
} & GeneralCodeAndTitle

export type KioskSailPackage = { route: Route } & GeneralCodeAndTitle

export type KioskInfo = {
  kioskId: number
  enabled: boolean
  port: string
  sailPackages: KioskSailPackage[]
}

export type KioskInfoData = {
  kiosk: KioskInfo
}
export interface CreditCompanyMember {
  cardNumber: string
  personalIdentificationNumber: string
  customerId: string
  creditCompany: {
    id: string
    name: string
    registrationNumber: string
  }
}
