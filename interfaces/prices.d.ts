import { Route } from '@interfaces/boraCore'

export type TripDeck = PassengerDeck | CarDeck

export interface CarDeckItem {
  subType: string
  types: TicketType[]
}

export interface CarDeck {
  __typename: string
  vehicleTypes: CarDeckItem[]
}

export interface PassengerDeck {
  __typename: string
  types: TicketType[]
}

export interface TicketType {
  type: string
  text: string
  currency: string
  price: number
  disabled?: boolean
}

export interface SailPrices {
  sailPricing: {
    ticketDecks: TripDeck[]
    tripSummary: {
      timeOfDepartureTo: Date
      timeOfDepartureFrom: Date
      route: Route
    }
  }
}

export interface QueryError {
  errorMessage: string
  exceptionClassName: string
}
export interface VehiclePrice {
  coefficients: string[]
  price: number
  priceCategory: string
  priceCategorySubType: string
  priceCategoryTitle: string
  priceFormatted: string
  residentCompany: boolean
}
export interface VehicleInfo {
  category: string
  heightInMm: number
  lengthInMm: number
  licensePlate: string
  weightInKg: number
  widthInMm: number
}
export interface CalculateVehiclePrice {
  error: QueryError
  inventoryClass: string
  price: VehiclePrice
  vehicleInfo: VehicleInfo
  vehicleType: string
}
