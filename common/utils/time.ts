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

export const startOfDay = (date: DateUTC): DateUTC => {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  )
}

export const getToday = (): DateUTC => {
  const now = new Date()

  return startOfDay(toUTC(now))
}

export const getStartOfWeek = (date: Date): DateUTC => {
  return toUTC(startOfDay(startOfWeek(date, {
    weekStartsOn: 1
  })))
}
