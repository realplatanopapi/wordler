import { startOfWeek } from "date-fns"

export type DateUTC = Date

export const toUTC = (date: Date): DateUTC => {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), 
      date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()
    )
  )
}

export const getStartOfDay = (date: DateUTC): DateUTC => {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  )
}

export const getToday = (): DateUTC => {
  const now = new Date()

  return getStartOfDay(toUTC(now))
}

export const getStartOfWeek = (date: Date): DateUTC => {
  return toUTC(getStartOfDay(startOfWeek(date, {
    weekStartsOn: 1
  })))
}
