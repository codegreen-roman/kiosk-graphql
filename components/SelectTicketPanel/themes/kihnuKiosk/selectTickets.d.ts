import { GeneralCodeAndTitle } from '@interfaces/boraCore'
import { DriverTicketFromReserve } from '@components/SelectTicketPanel/themes/kihnuKiosk/SelectTicketPanel'

export interface SelectedTicketsPanelProps {
  readonly carNumber: string
  readonly trailerNumber: string
  readonly tempTickets: TicketType[]
  readonly onTicketTypeRemove: (type: string) => void
  readonly onTicketCountIncrease: (type: string, resident: boolean, priceCategoryInitial?: string) => void
  readonly onTicketCountDecrease: (type: string) => void
  readonly onTicketEdit: (type: string) => void
  readonly onVehicleTicketView: () => void
  readonly carTicket: {
    text: string
    price: number
  }
  readonly trailerTicket: {
    text: string
    price: number
  }
  readonly isDriverFromReserveAdded: DriverTicketFromReserve
  readonly isResidentFromReserveAdded: boolean
  readonly isLocalCompanyVehicleHasBeenAdded: boolean
  readonly handleAddingDriverFromReserve: (flag: boolean, ticket: TicketType) => void
  readonly openDriverFromReserveAlert: () => void
  readonly handleAddingResidentFromReserve: (flag: boolean) => void
}

export interface TicketType {
  type: string
  text: string
  seqN?: number
  count?: number
  price?: number
  priceCategory?: string
  priceCategoryInitial?: string
  resident?: boolean
  icon?: string
  virtual?: boolean
  promotion?: string
  promotionPrice?: number
  promotionText?: string
  attributes?: GeneralCodeAndTitle[]
}

export interface TicketGroupProps {
  ticketTypes: TicketType[]
  onTicketTypeAdd: (param: TicketType) => void
}

export type PriceDataInput = {
  amount: number
  priceCategory: string
}

export type VehiclePriceDataInput = {
  automatic?: {
    licencePlate: string
    companyRegistrationNumber?: string
    handicapped?: boolean
  }
  manual?: {
    licencePlate: string
    priceCategory: string
    heightInCm: number
    lengthInCm: number
    widthInCm: number
    weightInKg: number
    companyRegistrationNumber?: string
  }
}

export type PackageInput = {
  sailPackage: string
  sailRefId: number
  passenger?: PriceDataInput
  bicycle?: PriceDataInput
  vehicle?: VehiclePriceDataInput
}

export interface PackagesInput {
  packages: PackageInput[]
}

export type ResidentPackageInput = {
  sailPackage: string
  sailRefId: number
  personalIdentificationNumber: string
  priceCategory: string
}

export interface ResidentPackagesInput {
  packages: ResidentPackageInput[]
}
