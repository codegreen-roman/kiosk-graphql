import { Route, SailStatusType, TimetablePoint } from '@interfaces/boraCore'

export type Values<T> = T[keyof T]
// https://fettblog.eu/tidy-typescript-avoid-enums/

export interface Availability {
  passengers: number
  localPassengers?: number
  bicycles: number
  vehicles: number
  warnings: string[]
}

export interface Sail {
  route: Route
  routeLeg: string
  vessel: string
  departure: TimetablePoint
  arrival: TimetablePoint
  extraTicketsAvailableTime: Date
  reserveTicketsAvailableTime?: Date
  minutesTillExtraTicketsAvailable: number
  passengerSeatsAvailable: number
  extraPassengerSeatsAvailable: number
  bicycleSeatsAvailable: number
  extraBicycleSeatsAvailable: number
  vehicleSeatsAvailable: number
  extraVehicleSeatsAvailable: number
  travelTimeInMinutes: number
  sailRefId: number
  status: SailStatusType
  dangerousGoods: boolean
  salesClosed: boolean
  restrictedPrices: boolean
  maxPassengerSeats: number
  maxVehicleSeats: number
  maxBicycleSeats: number
  maxTickets: Availability
  availableTickets: Availability
  extraTickets: Availability
  reserveTickets?: Availability
  warnings: string[]
}

export interface SailWarning {
  dangerousGoods: boolean
  cancelled: boolean
  soldOut: boolean
}

export interface DaySummary {
  port: string
  locationName: string
  totalPassengerSeatsAvailable: number
  totalVehicleSeatsAvailable: number
  totalBicycleSeatsAvailable: number
  warning?: SailWarning
}

export interface Locale {
  name: string
  shortName: string
  preferred: boolean
}

export type Ticket = {
  count: number
  type: string
  subType: string
  price: number
  text: string
  resident: boolean
  promotion?: string
  promotionText?: string
  promotionPrice?: number
}

export interface PromotionTicketLoad {
  typesWithPromotion: string[]
  ticketsFromReservation: Ticket[]
}
