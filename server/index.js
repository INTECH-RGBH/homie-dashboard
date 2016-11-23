import dotenv from 'dotenv'
import sqlite from 'sqlite'

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

  let db
  try {
    db = await sqlite.open('./homie-dashboard.db')
    log.debug('database opened')
    await db.migrate()
    log.debug('database migrated')
  } catch (err) {
    log.fatal('cannot open or migrate database', err)
    process.exit(1)
  }

  let wss
  try {
    wss = await createWebsocketServer({ ip: process.env.WS_API_IP, port: parseInt(process.env.WS_API_PORT, 10), db, settings })
    log.info(`listening on ${process.env.WS_API_IP}:${process.env.WS_API_PORT}`)
  } catch (err) {
    log.fatal('cannot start server', err)
    process.exit(1)
  }

  start({ log, wss, db, settings })
}

wrapper().catch(function onError (err) {
  log.fatal('unhandled error', err)
  process.exit(2)
})
