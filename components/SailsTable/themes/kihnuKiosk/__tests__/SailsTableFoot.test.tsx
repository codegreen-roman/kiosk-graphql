import React, { ReactNode } from 'react'
import SailsTableFoot, { SailsTableFootProps } from '../SailsTableFoot'
import { shallow } from 'enzyme'

jest.mock('react-i18next', () => ({
  useTranslation: (): object => ({
    t: (): string => 'Translation',
    i18n: {
      language: 'et',
    },
  }),
}))

jest.mock('../../../../../hooks/useAppState', () => ({
  useAppState: (): object => ({
    state: {
      route: {
        code: 'SVI-ROH-SVI',
        attributes: [
          {
            code: 'KIOSK_SOLD_OUT_INFO_PART_TWO_FI',
            value:
              'Lippu tavalliselle reitille voi ostaa kioskista ennen lähtöä {{CASH_DESK_HIGH_METERS_LIMIT}} lineaarimetrillä {{CASH_DESK_DECK_LIMIT}} matkustajalle. Liput lisätään, kun ajastin nollataan.',
            __typename: 'RouteAttribute',
          },
          {
            code: 'KIOSK_SOLD_OUT_INFO_PART_TWO_RU',
            value:
              'Билет на регулярный рейс можно купить в киоске перед отправлением из расчёта {{CASH_DESK_HIGH_METERS_LIMIT}} линейных метров на {{CASH_DESK_DECK_LIMIT}} пассажиров. Билеты будут добавлены, когда таймер обнулится',
            __typename: 'RouteAttribute',
          },
          {
            code: 'KIOSK_SOLD_OUT_INFO_PART_ONE_DE',
            value: 'Tickets für den Vorverkauf sind ausverkauft.',
            __typename: 'RouteAttribute',
          },
          {
            code: 'KIOSK_SOLD_OUT_INFO_PART_ONE_ET',
            value: 'EELMÜÜGI KOHAD ON VÄLJA MÜÜDUD.',
            __typename: 'RouteAttribute',
          },
          {
            code: 'KIOSK_SOLD_OUT_INFO_PART_ONE_EN',
            value: 'Changed text. PRE-BOOKABLE CAPACITY IS SOLD OUT.',
            __typename: 'RouteAttribute',
          },
          {
            code: 'KIOSK_SOLD_OUT_INFO_PART_TWO_ET',
            value:
              'REGULAARREISIDEL MÜÜAKSE KIOSKIST ENNE LAEVA VÄLJUMIST {{CASH_DESK_DECK_LIMIT}} REISIJA KOHTA JA {{CASH_DESK_HIGH_METERS_LIMIT}} LIINIMEETRIT TEKIPINDA. KOHAD LISATAKSE, KUI TAIMER AEGUB.',
            __typename: 'RouteAttribute',
          },
          {
            code: 'KIOSK_SOLD_OUT_INFO_PART_TWO_EN',
            value:
              'Changed text. WHEN THE TIMER EXPIRES, ON THE REGULAR TRIPS IT WILL BE ADDED {{CASH_DESK_DECK_LIMIT}} PASSENGER TICKETS AND {{CASH_DESK_HIGH_METERS_LIMIT}} LINE METERS OF THE DECK BEFORE THE DEPARTURE.',
            __typename: 'RouteAttribute',
          },
          {
            code: 'KIOSK_SOLD_OUT_INFO_PART_TWO_DE',
            value:
              'Tickets für reguläre Fahrten können vor der Abfahrt im Kiosk in Berechnung von {{CASH_DESK_HIGH_METERS_LIMIT}} laufenden Metern für {{CASH_DESK_DECK_LIMIT}} Passagiere erworben werden. Die Tickets werden hinzugefügt, wenn der Timer auf Null geht.',
            __typename: 'RouteAttribute',
          },
          {
            code: 'KIOSK_SOLD_OUT_INFO_PART_ONE_FI',
            value: 'Ennakkoliput ovat loppuneet.',
            __typename: 'RouteAttribute',
          },
          {
            code: 'KIOSK_SOLD_OUT_INFO_PART_ONE_RU',
            value: 'Билеты для предварительной продажи закончились.',
            __typename: 'RouteAttribute',
          },
          {
            code: 'KIOSK_SOLD_OUT_INFO_PART_TWO_SV',
            value:
              'ALLA FÖRBOKBARA BILJETTER ÄR SLUTSÅLDA. NÄR TIMERN RÄKNAT NER, BLIR {{CASH_DESK_DECK_LIMIT}}  PASSAGERARBILJETTER OCH {{CASH_DESK_HIGH_METERS_LIMIT}} METER FORDONSPLATS YTTERLIGARE TILLGÄNGLIGA',
            __typename: 'RouteAttribute',
          },
          {
            code: 'KIOSK_SOLD_OUT_INFO_PART_ONE_SV',
            value: 'ALLA FÖRBOKBARA BILJETTER ÄR SLUTSÅLDA.',
            __typename: 'RouteAttribute',
          },
        ],
      },
    },
  }),
}))

describe('SailsTableHead', () => {
  const defaultProps: SailsTableFootProps = {
    hasDangerGoods: true,
    hasLocalPassengers: true,
    hasCanceledSails: true,
    isTicketsSoldOut: true,
    hasRestrictedPrice: false,
    hasReserveTickets: false,
    isSomeReserveTicketsSoldOut: false,
    noLocalsWarningFromAttributes: undefined,
    warnings: [
      'EELMÜÜGI KOHAD ON VÄLJA MÜÜDUD.',
      'REGULAARREISIDEL MÜÜAKSE KIOSKIST ENNE LAEVA VÄLJUMIST {{CASH_DESK_DECK_LIMIT}} REISIJA KOHTA JA {{CASH_DESK_HIGH_METERS_LIMIT}} LIINIMEETRIT TEKIPINDA. KOHAD LISATAKSE, KUI TAIMER AEGUB.',
    ],
  }
  let component

  function render(props?: Partial<SailsTableFootProps>): ReactNode {
    const updatedProps: SailsTableFootProps = {
      ...defaultProps,
      ...props,
    }
    return shallow(<SailsTableFoot {...updatedProps} />)
  }

  describe('when default props passed', () => {
    beforeAll(() => {
      component = render()
    })

    it('matches snapshot', () => {
      expect(component).toMatchSnapshot()
    })

    it('renders sold-out message', () => {
      expect(component.find('[data-test="sold-out"]')).toExist()
    })

    it('renders local message', () => {
      expect(component.find('[data-test="local"]')).toExist()
    })

    it('renders danger message', () => {
      expect(component.find('[data-test="danger"]')).toExist()
    })

    it('renders cancel message', () => {
      expect(component.find('[data-test="cancel"]')).toExist()
    })
  })

  describe('when hasDangerGoods prop is false', () => {
    beforeAll(() => {
      component = render({
        hasDangerGoods: false,
      })
    })

    it('does not render danger message', () => {
      expect(component.find('[data-test="danger"]')).not.toExist()
    })
  })

  describe('when isTicketsSoldOut prop is false', () => {
    beforeAll(() => {
      component = render({
        isTicketsSoldOut: false,
      })
    })

    it('does not render sold-out message', () => {
      expect(component.find('[data-test="sold-out"]')).not.toExist()
    })
  })

  describe('when hasLocalPassengers prop is false', () => {
    beforeAll(() => {
      component = render({
        hasLocalPassengers: false,
      })
    })

    it('does not render local message', () => {
      expect(component.find('[data-test="local"]')).not.toExist()
    })
  })

  describe('when hasCanceledSails prop is false', () => {
    beforeAll(() => {
      component = render({
        hasCanceledSails: false,
      })
    })
  })
})
