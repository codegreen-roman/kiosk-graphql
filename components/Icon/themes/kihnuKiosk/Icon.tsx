import ArrowBackSVG from './icons/arrow-back.svg'
import ArrowRightSVG from './icons/arrow-right.svg'
import ArrowSolidRightSVG from './icons/arrow-solid-rigth.svg'
import ArrowSolidRightBlueSVG from './icons/arrow-solid-right-blue.svg'
import ButtonCloseSVG from './icons/button-close.svg'
import CitizenSVG from './icons/citizen.svg'
import ClockSvg from './icons/clock.svg'
import CloseSvg from './icons/close.svg'
import LogoSvg from './icons/logo.svg'
import MinusSvg from './icons/minus.svg'
import PassengerSvg from './icons/passenger.svg'
import PedestrianSvg from './icons/pedestrian.svg'
import BicycleSvg from './icons/bicycle.svg'
import VehicleSvg from './icons/vehicle.svg'
import OkMarkSvg from './icons/ok-mark.svg'
import DangerSvg from './icons/danger.svg'
import EditSvg from './icons/edit.svg'
import AnchorSvg from './icons/anchor.svg'
import ShipSvg from './icons/ship.svg'
import PassengerTicketSvg from './icons/passenger-ticket.svg'
import PlusSvg from './icons/plus.svg'
import ReturnSvg from './icons/return.svg'
import CarSvg from './icons/car.svg'
import CarSolidSvg from './icons/car-solid.svg'
import BikeSvg from './icons/bike.svg'
import LangEtSvg from './icons/lang/et.svg'
import LangFiSvg from './icons/lang/fi.svg'
import LangDeSvg from './icons/lang/de.svg'
import LangRuSvg from './icons/lang/ru.svg'
import LangSvSvg from './icons/lang/sv.svg'
import LangEnSvg from './icons/lang/en.svg'
import TrailerSVG from './icons/trailer.svg'
import WarningSVG from './icons/warning.svg'
import WheelchairSVG from './icons/wheelchair.svg'
import ArrowRight from './icons/right_arrow.svg'
import ArrowLeft from './icons/left_arrow.svg'
import Alco from './icons/alco.svg'
import Cards from './icons/cards.svg'
import CoffeeSnacks from './icons/coffee-snacks.svg'
import Dog from './icons/dog.svg'
import Litter from './icons/litter.svg'
import NoSignal from './icons/no-signal.svg'
import Passengers from './icons/passengers.svg'
import Skate from './icons/skate.svg'
import Smoke from './icons/smoke.svg'
import Swim from './icons/swim.svg'
import TriangleGrey from './icons/arrow-print.svg'
import Waves from './icons/waves.svg'
import WC from './icons/wc.svg'
import Weather from './icons/weather.svg'
import Wifi from './icons/wifi.svg'
import BikeAndMan from './icons/bike_and_man.svg'
import PayCards from './icons/payCards.svg'
import Contracts from './icons/contracts.svg'
import Tick from './icons/tick.svg'
import AddRoundTrip from './icons/round-trip.svg'
import NoTrucks from './icons/no-trucks.svg'
import WheelChair from './icons/wheelchair-access.svg'
import Accompanying from './icons/behind-wheelchair.svg'
import Blind from './icons/blind.svg'
import Dash from './icons/dash.svg'

import React, { ReactElement, FC } from 'react'
import { IconHolder } from './IconStyles'
import { IconProps } from '@components/Icon'

function wrapSvg(Icon): FC<IconProps> {
  return ({ className }): ReactElement => (
    <IconHolder className={className}>
      <Icon />
    </IconHolder>
  )
}

const Icon = {
  'arrow-back': wrapSvg(ArrowBackSVG),
  'arrow-right': wrapSvg(ArrowRightSVG),
  'arrow-solid-right': wrapSvg(ArrowSolidRightSVG),
  'arrow-solid-right-blue': wrapSvg(ArrowSolidRightBlueSVG),
  'button-close': wrapSvg(ButtonCloseSVG),
  clock: wrapSvg(ClockSvg),
  close: wrapSvg(CloseSvg),
  logo: wrapSvg(LogoSvg),
  minus: wrapSvg(MinusSvg),
  passenger: wrapSvg(PassengerSvg),
  bicycle: wrapSvg(BicycleSvg),
  vehicle: wrapSvg(VehicleSvg),
  okMark: wrapSvg(OkMarkSvg),
  danger: wrapSvg(DangerSvg),
  edit: wrapSvg(EditSvg),
  anchor: wrapSvg(AnchorSvg),
  ship: wrapSvg(ShipSvg),
  'passenger-ticket': wrapSvg(PassengerTicketSvg),
  plus: wrapSvg(PlusSvg),
  return: wrapSvg(ReturnSvg),
  car: wrapSvg(CarSvg),
  'car-solid': wrapSvg(CarSolidSvg),
  bike: wrapSvg(BikeSvg),
  'lang-et': wrapSvg(LangEtSvg),
  'lang-fi': wrapSvg(LangFiSvg),
  'lang-de': wrapSvg(LangDeSvg),
  'lang-ru': wrapSvg(LangRuSvg),
  'lang-sv': wrapSvg(LangSvSvg),
  'lang-en': wrapSvg(LangEnSvg),
  'ticket-citizen': wrapSvg(CitizenSVG),
  'ticket-adult': wrapSvg(PedestrianSvg),
  'ticket-disabledChildren': wrapSvg(WheelchairSVG),
  'ticket-companionForDisabled': wrapSvg(WheelchairSVG),
  'ticket-blindPerson': wrapSvg(WheelchairSVG),
  'ticket-companionForBlind': wrapSvg(WheelchairSVG),
  'ticket-disabledPeople': wrapSvg(WheelchairSVG),
  'ticket-vehicle': wrapSvg(VehicleSvg),
  'ticket-trailer': wrapSvg(TrailerSVG),
  'ticket-bicycle': wrapSvg(BicycleSvg),
  'arrow-left-calendar': wrapSvg(ArrowLeft),
  'arrow-right-calendar': wrapSvg(ArrowRight),
  warning: wrapSvg(WarningSVG),
  alco: wrapSvg(Alco),
  cards: wrapSvg(Cards),
  'coffee-snacks': wrapSvg(CoffeeSnacks),
  dog: wrapSvg(Dog),
  litter: wrapSvg(Litter),
  'no-signal': wrapSvg(NoSignal),
  passengers: wrapSvg(Passengers),
  skate: wrapSvg(Skate),
  smoke: wrapSvg(Smoke),
  swim: wrapSvg(Swim),
  'triangle-grey': wrapSvg(TriangleGrey),
  waves: wrapSvg(Waves),
  wc: wrapSvg(WC),
  weather: wrapSvg(Weather),
  wifi: wrapSvg(Wifi),
  'bike-and-man': wrapSvg(BikeAndMan),
  'pay-cards': wrapSvg(PayCards),
  contracts: wrapSvg(Contracts),
  tick: wrapSvg(Tick),
  wheelchair: wrapSvg(WheelchairSVG),
  'round-trip': wrapSvg(AddRoundTrip),
  noTrucks: wrapSvg(NoTrucks),
  'visually-impaired': wrapSvg(Blind),
  'accompanying-impaired': wrapSvg(Accompanying),
  'handicapped-person': wrapSvg(WheelChair),
  dash: wrapSvg(Dash),
}

export default Icon
