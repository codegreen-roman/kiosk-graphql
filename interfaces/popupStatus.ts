export enum SubscriptionPopupStatus {
  ADDED = 'added',
  DENIED = 'denied',
  READING = 'reading',
  SUCCESS = 'success',
  ERROR = 'error',
  WAITING = 'waiting',
}

export enum VehiclePopupStep {
  INITIAL,
  SELECT_TYPE,
  MANUAL_FORM,
  AUTOMATIC_FORM,
}

export enum AlertPopupType {
  ALERT = 'alert',
  ERROR = 'error',
}
