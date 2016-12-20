import dotenv from 'dotenv'

import {knex} from './lib/database'
import log from './lib/log'
import createWebsocketServer from './lib/websocket-server'
import start from './start'
import loadSettings from './lib/settings'

dotenv.config()

async function wrapper () {
  log.info('starting')

  let settings
  try {
    settings = await loadSettings()
    log.info('settings loaded')
  } catch (err) {
    log.fatal('cannot load settings', err)
    process.exit(1)
  }

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
    wss = await createWebsocketServer({ ip: process.env.WS_API_IP, port: parseInt(process.env.WS_API_PORT, 10), settings })
    log.info(`listening on ${process.env.WS_API_IP}:${process.env.WS_API_PORT}`)
  } catch (err) {
    log.fatal('cannot start server', err)
    process.exit(1)
  }

  start({ log, wss, settings })
}

wrapper().catch(function onError (err) {
  log.fatal('unhandled error', err)
  process.exit(2)
})
