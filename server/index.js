import path from 'path'
import Knex from 'knex'
import {bookshelf} from './lib/database'
import log from './lib/log'
import createWebsocketServer from './lib/websocket-server'
import start from './start'
import loadSettings from './lib/settings'

export async function bootstrap (opts) {
  log.info('starting')

  let settings
  try {
    settings = await loadSettings()
    log.info('settings loaded')
  } catch (err) {
    log.fatal('cannot load settings', err)
    process.exit(1)
  }

  const knex = new Knex({
    client: 'sqlite3',
    connection: {
      filename: path.join(opts.dataDir, './homie-dashboard.db')
    },
    useNullAsDefault: true
  })
  bookshelf.knex = knex

  try {
    await knex.raw('PRAGMA foreign_keys=ON')
    await knex.raw('PRAGMA locking_mode=EXCLUSIVE')
    await knex.raw('PRAGMA synchronous=NORMAL')
    await knex.migrate.latest()
    log.debug('database migrated')
  } catch (err) {
    log.fatal('cannot open or migrate database', err)
    process.exit(1)
  }

  let wss
  try {
    wss = await createWebsocketServer({ ip: opts.ip, port: opts.port, settings })
    log.info(`listening on ${opts.ip}:${opts.port}`)
  } catch (err) {
    log.fatal('cannot start server', err)
    process.exit(1)
  }

  start({ log, wss, settings })
}
