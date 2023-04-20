import { datesDiff } from '../time'

describe('Time utils', () => {
  describe('datesDiff()', () => {
    it('returns correct diff when first date newer then second', () => {
      expect(datesDiff(new Date('2020-01-02T00:00:00'), new Date('2020-01-01T00:00:00'))).toEqual({
        isFirstDateNewer: true,
        isSecondDateNewer: false,
        isDifferent: true,
        days: 1,
        hours: 0,
        minutes: 0,
        seconds: 0,
      })

      expect(datesDiff(new Date('2020-01-02T02:30:40'), new Date('2020-01-01T00:00:00'))).toEqual({
        isFirstDateNewer: true,
        isSecondDateNewer: false,
        isDifferent: true,
        days: 1,
        hours: 2,
        minutes: 30,
        seconds: 40,
      })
    })

    it('returns correct diff when first date older then second', () => {
      expect(datesDiff(new Date('2020-01-01T00:00:00'), new Date('2020-01-02T00:00:00'))).toEqual({
        isFirstDateNewer: false,
        isSecondDateNewer: true,
        isDifferent: true,
        days: 1,
        hours: 0,
        minutes: 0,
        seconds: 0,
      })

      expect(datesDiff(new Date('2020-01-01T00:00:00'), new Date('2020-01-02T02:30:40'))).toEqual({
        isFirstDateNewer: false,
        isSecondDateNewer: true,
        isDifferent: true,
        days: 1,
        hours: 2,
        minutes: 30,
        seconds: 40,
      })
    })

    it('returns correct diff when passed same dates', () => {
      const date = new Date('2020-01-01T00:00:00')

      expect(datesDiff(date, date)).toEqual({
        isFirstDateNewer: false,
        isSecondDateNewer: false,
        isDifferent: false,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      })
    })
  })
})
