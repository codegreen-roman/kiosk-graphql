import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import welcomeEn from './locales/en/welcome.json'
import commonEn from './locales/en/common.json'
import buttonsEn from './locales/en/buttons.json'
import selectDateEn from './locales/en/select-date.json'
import selectTicketEn from './locales/en/select-ticket.json'
import summaryEn from './locales/en/summary.json'
import confirmationEn from './locales/en/confirmation.json'
import popupCommonEn from './locales/en/popup.common.json'
import popupIdAddingEn from './locales/en/popup.id.adding.json'
import popupIdReadingEn from './locales/en/popup.id.reading.json'
import popupIdWaitingEn from './locales/en/popup.id.waiting.json'
import popupPaymentAddingEn from './locales/en/popup.payment.adding.json'
import popupPaymentReadingEn from './locales/en/popup.payment.reading.json'
import popupPaymentWaitingEn from './locales/en/popup.payment.waiting.json'
import popupVehicleAddingEn from './locales/en/popup.vehicle.adding.json'
import warningsEn from './locales/en/warnings.json'

import welcomeEt from './locales/et/welcome.json'
import commonEt from './locales/et/common.json'
import buttonsEt from './locales/et/buttons.json'
import selectDateEt from './locales/et/select-date.json'
import selectTicketEt from './locales/et/select-ticket.json'
import summaryEt from './locales/et/summary.json'
import confirmationEt from './locales/et/confirmation.json'
import popupCommonEt from './locales/et/popup.common.json'
import popupIdAddingEt from './locales/et/popup.id.adding.json'
import popupIdReadingEt from './locales/et/popup.id.reading.json'
import popupIdWaitingEt from './locales/et/popup.id.waiting.json'
import popupPaymentAddingEt from './locales/et/popup.payment.adding.json'
import popupPaymentReadingEt from './locales/et/popup.payment.reading.json'
import popupPaymentWaitingEt from './locales/et/popup.payment.waiting.json'
import popupVehicleAddingEt from './locales/et/popup.vehicle.adding.json'
import warningsEt from './locales/et/warnings.json'

import welcomeRu from './locales/ru/welcome.json'
import commonRu from './locales/ru/common.json'
import buttonsRu from './locales/ru/buttons.json'
import selectDateRu from './locales/ru/select-date.json'
import selectTicketRu from './locales/ru/select-ticket.json'
import summaryRu from './locales/ru/summary.json'
import confirmationRu from './locales/ru/confirmation.json'
import popupCommonRu from './locales/ru/popup.common.json'
import popupIdAddingRu from './locales/ru/popup.id.adding.json'
import popupIdReadingRu from './locales/ru/popup.id.reading.json'
import popupIdWaitingRu from './locales/ru/popup.id.waiting.json'
import popupPaymentAddingRu from './locales/ru/popup.payment.adding.json'
import popupPaymentReadingRu from './locales/ru/popup.payment.reading.json'
import popupPaymentWaitingRu from './locales/ru/popup.payment.waiting.json'
import popupVehicleAddingRu from './locales/ru/popup.vehicle.adding.json'
import warningsRu from './locales/ru/warnings.json'

import welcomeFi from './locales/fi/welcome.json'
import commonFi from './locales/fi/common.json'
import buttonsFi from './locales/fi/buttons.json'
import selectDateFi from './locales/fi/select-date.json'
import selectTicketFi from './locales/fi/select-ticket.json'
import summaryFi from './locales/fi/summary.json'
import confirmationFi from './locales/fi/confirmation.json'
import popupCommonFi from './locales/fi/popup.common.json'
import popupIdAddingFi from './locales/fi/popup.id.adding.json'
import popupIdReadingFi from './locales/fi/popup.id.reading.json'
import popupIdWaitingFi from './locales/fi/popup.id.waiting.json'
import popupPaymentAddingFi from './locales/fi/popup.payment.adding.json'
import popupPaymentReadingFi from './locales/fi/popup.payment.reading.json'
import popupPaymentWaitingFi from './locales/fi/popup.payment.waiting.json'
import popupVehicleAddingFi from './locales/fi/popup.vehicle.adding.json'
import warningsFi from './locales/fi/warnings.json'

import welcomeDe from './locales/de/welcome.json'
import commonDe from './locales/de/common.json'
import buttonsDe from './locales/de/buttons.json'
import selectDateDe from './locales/de/select-date.json'
import selectTicketDe from './locales/de/select-ticket.json'
import summaryDe from './locales/de/summary.json'
import confirmationDe from './locales/de/confirmation.json'
import popupCommonDe from './locales/de/popup.common.json'
import popupIdAddingDe from './locales/de/popup.id.adding.json'
import popupIdReadingDe from './locales/de/popup.id.reading.json'
import popupIdWaitingDe from './locales/de/popup.id.waiting.json'
import popupPaymentAddingDe from './locales/de/popup.payment.adding.json'
import popupPaymentReadingDe from './locales/de/popup.payment.reading.json'
import popupPaymentWaitingDe from './locales/de/popup.payment.waiting.json'
import popupVehicleAddingDe from './locales/de/popup.vehicle.adding.json'
import warningsDe from './locales/de/warnings.json'

import welcomeSv from './locales/sv/welcome.json'
import commonSv from './locales/sv/common.json'
import buttonsSv from './locales/sv/buttons.json'
import selectDateSv from './locales/sv/select-date.json'
import selectTicketSv from './locales/sv/select-ticket.json'
import summarySv from './locales/sv/summary.json'
import confirmationSv from './locales/sv/confirmation.json'
import popupCommonSv from './locales/sv/popup.common.json'
import popupIdAddingSv from './locales/sv/popup.id.adding.json'
import popupIdReadingSv from './locales/sv/popup.id.reading.json'
import popupIdWaitingSv from './locales/sv/popup.id.waiting.json'
import popupPaymentAddingSv from './locales/sv/popup.payment.adding.json'
import popupPaymentReadingSv from './locales/sv/popup.payment.reading.json'
import popupPaymentWaitingSv from './locales/sv/popup.payment.waiting.json'
import popupVehicleAddingSv from './locales/sv/popup.vehicle.adding.json'
import warningsSv from './locales/sv/warnings.json'

const resources = {
  en: {
    translation: {
      ...welcomeEn,
      ...commonEn,
      ...buttonsEn,
      ...selectDateEn,
      ...selectTicketEn,
      ...summaryEn,
      ...confirmationEn,
      ...popupCommonEn,
      ...popupIdAddingEn,
      ...popupIdReadingEn,
      ...popupIdWaitingEn,
      ...popupPaymentAddingEn,
      ...popupPaymentReadingEn,
      ...popupPaymentWaitingEn,
      ...popupVehicleAddingEn,
      ...warningsEn,
    },
  },
  ru: {
    translation: {
      ...welcomeRu,
      ...commonRu,
      ...buttonsRu,
      ...selectDateRu,
      ...selectTicketRu,
      ...summaryRu,
      ...confirmationRu,
      ...popupCommonRu,
      ...popupIdAddingRu,
      ...popupIdReadingRu,
      ...popupIdWaitingRu,
      ...popupPaymentAddingRu,
      ...popupPaymentReadingRu,
      ...popupPaymentWaitingRu,
      ...popupVehicleAddingRu,
      ...warningsRu,
    },
  },
  et: {
    translation: {
      ...welcomeEt,
      ...commonEt,
      ...buttonsEt,
      ...selectDateEt,
      ...selectTicketEt,
      ...summaryEt,
      ...confirmationEt,
      ...popupCommonEt,
      ...popupIdAddingEt,
      ...popupIdReadingEt,
      ...popupIdWaitingEt,
      ...popupPaymentAddingEt,
      ...popupPaymentReadingEt,
      ...popupPaymentWaitingEt,
      ...popupVehicleAddingEt,
      ...warningsEt,
    },
  },
  fi: {
    translation: {
      ...welcomeFi,
      ...commonFi,
      ...buttonsFi,
      ...selectDateFi,
      ...selectTicketFi,
      ...summaryFi,
      ...confirmationFi,
      ...popupCommonFi,
      ...popupIdAddingFi,
      ...popupIdReadingFi,
      ...popupIdWaitingFi,
      ...popupPaymentAddingFi,
      ...popupPaymentReadingFi,
      ...popupPaymentWaitingFi,
      ...popupVehicleAddingFi,
      ...warningsFi,
    },
  },
  de: {
    translation: {
      ...welcomeDe,
      ...commonDe,
      ...buttonsDe,
      ...selectDateDe,
      ...selectTicketDe,
      ...summaryDe,
      ...confirmationDe,
      ...popupCommonDe,
      ...popupIdAddingDe,
      ...popupIdReadingDe,
      ...popupIdWaitingDe,
      ...popupPaymentAddingDe,
      ...popupPaymentReadingDe,
      ...popupPaymentWaitingDe,
      ...popupVehicleAddingDe,
      ...warningsDe,
    },
  },
  sv: {
    translation: {
      ...welcomeSv,
      ...commonSv,
      ...buttonsSv,
      ...selectDateSv,
      ...selectTicketSv,
      ...summarySv,
      ...confirmationSv,
      ...popupCommonSv,
      ...popupIdAddingSv,
      ...popupIdReadingSv,
      ...popupIdWaitingSv,
      ...popupPaymentAddingSv,
      ...popupPaymentReadingSv,
      ...popupPaymentWaitingSv,
      ...popupVehicleAddingSv,
      ...warningsSv,
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'et',
  debug: false,
  fallbackLng: 'en',
  detection: {
    order: ['queryString', 'cookie'],
  },

  keySeparator: false,

  interpolation: {
    escapeValue: false,
  },
})

export default i18n
