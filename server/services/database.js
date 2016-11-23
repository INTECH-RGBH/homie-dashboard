import uuid from 'uuid'
import {dateToSqlite} from '../helpers/sqlite'

export async function createAuthToken ({ db }) {
  const token = uuid()
  const now = new Date()

  await db.run(
    'INSERT INTO auth_tokens (token, last_activity) VALUES (?, ?)',
    token, dateToSqlite(now)
  )

  return token
}

export async function checkToken ({ db }, token) {
  const record = await db.get(
    'SELECT * FROM auth_tokens WHERE token = ?',
    token
  )

  return record !== undefined
}

export async function deleteToken ({ db }, token) {
  const result = await db.run(
    'DELETE FROM auth_tokens WHERE token = ?',
    token
  )

  return result.changes === 1
}
