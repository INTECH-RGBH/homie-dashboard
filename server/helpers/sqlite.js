export function dateToSqlite (date) {
  return date.toISOString()
}

export function dateFromSqlite (sqlite) {
  return new Date(sqlite)
}
