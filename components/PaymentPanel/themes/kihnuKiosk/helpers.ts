import { ReservationGuest, ReservationLoad, ReservationVehicle } from '@interfaces/boraCore'
import { asMoneyString, formatDate, formatTime } from '@utils/formatters'
import { PaymentObjectType } from './PaymentTable'
import { SummaryData } from './PaymentSumary'
import ITEM_TYPE from '@const/summaryItemsTypes'
import { useTranslation } from 'react-i18next'
import * as R from 'ramda'
import ATTRIBUTES from '@const/attributes'

export const formatServerDataForPayment = (
  serverData: ReservationLoad,
  index: number
): {
  paymentObject: PaymentObjectType
  summaryObject: SummaryData[]
} => {
  const { i18n } = useTranslation()

  const formattedDateObj = `${formatTime(
    new Date(serverData.sailPackages[index].sailRefs[0].departureAt),
    'h:m',
    i18n.language
  )},${formatDate(
    new Date(serverData.sailPackages[index].sailRefs[0].departureAt),
    'dd:mm:yy:long',
    i18n.language
  ).toUpperCase()}`

  const passengers = serverData.sailPackages[index].sailRefs[0].items.filter(
    (item) => item.type === ITEM_TYPE.PASSENGER
  )
  const localIds = R.flatten(
    passengers
      .filter((item) => item.resident === true && !item.promotion)
      .map((item) =>
        item.owners?.map((item: ReservationGuest, index, array) =>
          array.length - 1 === index
            ? `${item.personalIdentificationNumber === 'undefined' ? '' : item.personalIdentificationNumber} `
            : `${item.personalIdentificationNumber === 'undefined' ? '' : item.personalIdentificationNumber}, `
        )
      )
  )
  const vehicles = serverData.sailPackages[index].sailRefs[0].items.filter(
    (item) => item.type === ITEM_TYPE.VEHICLE && item.priceCategorySubType !== ITEM_TYPE.BICYCLE
  )
  const localVehiclesNumbers = vehicles
    .filter((item) => item.resident === true)
    .map((it, index, array) =>
      array.length - 1 === index
        ? `${(it.owners[0] as ReservationVehicle).licencePlate} `
        : `${(it.owners[0] as ReservationVehicle).licencePlate}, `
    )
  const car = vehicles.find((item) => item.priceCategorySubType !== ITEM_TYPE.TRAILER)
  const trailer = vehicles.find((item) => item.priceCategorySubType === ITEM_TYPE.TRAILER)

  const objToFit = {
    heading: {
      route: serverData.sailPackages[index].sailRefs[0].routeLegTitle.toUpperCase(),
      date: formattedDateObj,
    },
    ticketTypes: {
      columns: {
        name: 'Ticket type',
        qty: 'Qty',
        price: 'Price',
        subtotal: 'SubtotalColumn',
      },
      data: serverData.sailPackages[index].sailRefs[0].items
        .sort((a, b) => a.priceCategory.localeCompare(b.priceCategory))
        .map((item) => {
          return {
            name: item.priceCategoryTranslation,
            qty: item.promotion ? undefined : item.quantity,
            price: asMoneyString(item.pricePerUnit / 100),
            subtotal: asMoneyString(item.price / 100),
          }
        }),
    },
    localDiscounts: {
      columns: {
        name: 'Local discounts applied',
      },
      data: [
        {
          name: localIds?.length ? 'ID kood' : '',
          data: localIds?.length ? localIds.join(' ') : '',
        },
        {
          name: localVehiclesNumbers?.length ? 'Vehicle' : '',
          data: localVehiclesNumbers?.length ? localVehiclesNumbers.join(' ') : '',
        },
      ],
    },
    cars: {
      columns: null,
      data: car
        ? [
            {
              name: 'Car reg',
              data: (car.owners[0] as ReservationVehicle).licencePlate,
            },
            {
              name: 'Car width',
              data: `${(car.owners[0] as ReservationVehicle).widthInCm / 100} ${i18n.t('m')}`,
            },
            {
              name: 'Car height',
              data: `${(car.owners[0] as ReservationVehicle).heightInCm / 100} ${i18n.t('m')}`,
            },
            {
              name: 'Car weight',
              data: `${(car.owners[0] as ReservationVehicle).weightInKg / 1000} ${i18n.t('t')}`,
            },
            {
              name: 'Car length',
              data: `${(car.owners[0] as ReservationVehicle).lengthInCm / 100} ${i18n.t('m')}`,
            },
          ]
        : [],
    },
    trailers: {
      columns: null,
      data: trailer
        ? [
            {
              name: 'Trailer reg',
              data: (trailer.owners[0] as ReservationVehicle).licencePlate,
            },
            {
              name: 'Trailer width',
              data: `${(trailer.owners[0] as ReservationVehicle).widthInCm / 100} ${i18n.t('m')}`,
            },
            {
              name: 'Trailer height',
              data: `${(trailer.owners[0] as ReservationVehicle).heightInCm / 100} ${i18n.t('m')}`,
            },
            {
              name: 'Trailer weight',
              data: `${(trailer.owners[0] as ReservationVehicle).weightInKg / 1000} ${i18n.t('t')}`,
            },
            {
              name: 'Trailer length',
              data: `${(trailer.owners[0] as ReservationVehicle).lengthInCm / 100} ${i18n.t('m')}`,
            },
          ]
        : [],
    },
  }

  const summaryToFit = [
    {
      name: 'Subtotal, excl VAT',
      value: asMoneyString(serverData.paymentInfo.totalPrice.amountWithoutTaxes / 100),
    },
    {
      name: 'VAT',
      value: asMoneyString(serverData.paymentInfo.totalPrice.taxAmount / 100),
    },
    {
      name: 'Subtotal',
      value: asMoneyString(serverData.paymentInfo.totalPrice.amount / 100),
    },
  ]

  return {
    paymentObject: objToFit,
    summaryObject: summaryToFit,
  }
}

export const convertTermsData = ({ data }): string[] => {
  return data ? data.split('\n').map((item) => item.replace(/(<([^>]+)>)/gi, '')) : ATTRIBUTES.KIOSK_TERMS_EN
}
