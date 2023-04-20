import { PromotionTicketLoad, Ticket } from '@interfaces/salesCore'
import { ReservationItem } from '@interfaces/boraCore'
import { map } from 'ramda'

export const itemToTicket: (i: ReservationItem) => Ticket = (item) => ({
  count: item.quantity,
  price: item.price,
  resident: item.resident,
  type: item.priceCategory,
  subType: item.priceCategorySubType,
  text: item.priceCategoryTranslation,
  promotion: item.promotion,
  promotionText: item.promotionText,
  promotionPrice: item.promotionPrice,
})

export const itemToTickets = map(itemToTicket)

export const formatItemsWithPromotions = ({
  typesWithPromotion,
  ticketsFromReservation,
}: PromotionTicketLoad): Ticket[] => {
  const ticketsWithPromotion = typesWithPromotion
    .map((type) => ticketsFromReservation.filter((item) => item.type === type))
    .map((ticketWithPromotion) => {
      const regularTicket = ticketWithPromotion.find((ticket) => !ticket.promotion)
      if (!regularTicket) return ticketWithPromotion
      return {
        ...regularTicket,
        promotion: ticketWithPromotion.find((ticket) => ticket.promotion)?.promotion,
        promotionText: ticketWithPromotion.find((ticket) => ticket.promotion)?.text,
        promotionPrice: ticketWithPromotion.find((ticket) => ticket.promotion)?.price,
      }
    })
  return [
    ticketsFromReservation.filter((item) => !typesWithPromotion.includes(item.type)),
    ...ticketsWithPromotion,
  ].flat()
}
