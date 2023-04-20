const VEHICLE_ERROR = {
  VEHICLE_INFO_NOT_FOUND_IN_REGISTRY: {
    code: 'VEHICLE_INFO_NOT_FOUND_IN_REGISTRY',
    message: 'Vehicle info is not found',
  },
  VEHICLE_REGISTER_FAILURE: {
    code: 'VEHICLE_REGISTER_FAILURE',
    message: 'Vehicle info is not found',
  },
  EXCLUDED_PRICE_CATEGORY: { code: 'EXCLUDED_PRICE_CATEGORY', message: 'No tickets available' },
  FAILED_TO_ALLOCATE_CAR_DECK_INVENTORY_BY_WEIGHT: {
    code: 'FAILED_TO_ALLOCATE_CAR_DECK_INVENTORY_BY_WEIGHT',
    message: 'Failed to allocate car deck inventory by weight',
  },
  FAILED_TO_ALLOCATE_CAR_DECK_INVENTORY: {
    code: 'FAILED_TO_ALLOCATE_CAR_DECK_INVENTORY',
    message: 'Failed to allocate car deck inventory',
  },
  VEHICLE_DISCOUNT_ALREADY_USED_ON_SAIL: {
    code: 'VEHICLE_DISCOUNT_ALREADY_USED_ON_SAIL',
    message: 'Vehicle discount already used on sail',
  },
  COMPANY_NOT_FOUND_IN_EBUSINESS_REGISTER: {
    code: 'COMPANY_NOT_FOUND_IN_EBUSINESS_REGISTER',
    message: 'Company not found in e-Business register',
  },
  INAPPROPRIATE_UI_FORM: {
    code: 'INAPPROPRIATE_UI_FORM',
    message: {
      vehicle: 'Please use add vehicle',
      trailer: 'Please use add trailer',
    },
  },
  COMMON_ERROR: {
    message: 'Request processing failed by some reason',
  },
}
export default VEHICLE_ERROR
