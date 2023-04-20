import { useReducer } from 'react'
import { TicketType } from '@components/SelectTicketPanel/themes/kihnuKiosk/selectTickets'

interface TicketData {
  price: number
  type: string
  amount: number
}

export type TicketMap = {
  [key: string]: TicketData
}

export type TicketAction =
  | {
      type: 'INC'
      payload: { category: string }
    }
  | {
      type: 'DEC'
      payload: { category: string }
    }
  | {
      type: 'REM'
      payload: { category: string }
    }

const initTicketsState = {} as TicketMap

const reducer: (s: TicketMap, a: TicketAction) => TicketMap = (
  state: TicketMap = initTicketsState,
  action: TicketAction
) => {
  switch (action.type) {
    case 'INC':
      return {
        ...state,
        [action.payload.category]: {
          ...state[action.payload.category],
          amount: state[action.payload.category].amount + 1,
        },
      }
    case 'DEC':
      return {
        ...state,
        [action.payload.category]: {
          ...state[action.payload.category],
          amount: state[action.payload.category].amount - 1,
        },
      }
    case 'REM':
      return {
        ...state,
        [action.payload.category]: {
          ...state[action.payload.category],
          amount: 0,
        },
      }

    default:
      throw new Error('Unknown action type')
  }
}

interface HookResult {
  state: TicketMap
  increase(c: string): void
  decrease(c: string): void
  remove(c: string): void
}

export const useAmountClicks = (types: TicketType[]): HookResult => {
  const initialTypes: TicketMap = types.reduce(
    (acc, { count, price, type }) => ({
      ...acc,
      [type]: { price, type, amount: count },
    }),
    initTicketsState
  )

  const [state, dispatch] = useReducer(reducer, initialTypes)

  return {
    state,
    increase: (category: string): void => dispatch({ type: 'INC', payload: { category } }),
    decrease: (category: string): void => dispatch({ type: 'DEC', payload: { category } }),
    remove: (category: string): void => dispatch({ type: 'REM', payload: { category } }),
  }
}
