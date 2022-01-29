type DateUTC = Date

export const startOfDay = (date: DateUTC): DateUTC => {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  )
}

export const toUTC = (date: Date): DateUTC => {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), 
      date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()
    )
  )
}