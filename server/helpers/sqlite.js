/**
 * This functions generates a SQLite Date from a JS Date
 @param {Date} date the JS Date
 @returns {string} the SQLite Date
 */
export function dateToSqlite (date) {
  return date.toISOString()
}

/**
 * This functions generates a JS Date from a SQLite Date string
 @param {string} string the SQLite Date
 @returns {Date} the JS Date
 */
export function dateFromSqlite (string) {
  return new Date(string)
}
