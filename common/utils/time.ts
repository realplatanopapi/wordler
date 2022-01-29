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
