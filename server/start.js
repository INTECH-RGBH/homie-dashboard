import jsonpatch from 'fast-json-patch'
import createMqttClient from './lib/mqtt-client'
import Client from './lib/client'
import MqttRelay from './lib/mqtt-relay'
import infrastructure from './lib/infrastructure/infrastructure'
import {generateMessage, MESSAGE_TYPES} from '../common/ws-messages'
import {INFRASTRUCTURE_PATCH} from '../common/events'
import {syncInfrastructure, getInfrastructure} from './services/database'

const DB_SYNC_DELAY = 30 * 1000

export default async function start ($deps) {
  /* Populate the infrastructure from the DB */

  await getInfrastructure($deps, infrastructure)

  /* Initialize the MQTT client */

  const mqttClient = createMqttClient(`mqtt://${$deps.settings.mqtt.host}:${$deps.settings.mqtt.port}`)

  /* Hook the infrastructure to the MQTT */

  const mqttRelay = new MqttRelay({ $deps, mqttClient, infrastructure }) // eslint-disable-line no-unused-vars

  /* Handle infrastructure updates */

  let dbSyncDelay
  let lastInfrastructure = infrastructure.toJSON()
  infrastructure.on('update', function onUpdate (update) {
    const currentInfrastructure = infrastructure.toJSON()
    const patch = jsonpatch.compare(lastInfrastructure, currentInfrastructure)
    lastInfrastructure = currentInfrastructure
    const message = generateMessage({ type: MESSAGE_TYPES.EVENT, event: INFRASTRUCTURE_PATCH, value: patch })
    for (const client of $deps.wss.clients) {
      client.send(message)
    }

    if (dbSyncDelay) return
    dbSyncDelay = setTimeout(async () => {
      dbSyncDelay = null
      $deps.log.debug('synchronizing database')
      await syncInfrastructure($deps, infrastructure)
    }, DB_SYNC_DELAY)
  })

  /* Handle WS */

  const clients = new Set()
  $deps.wss.on('connection', function onConnection (ws) {
    $deps.log.debug('connection on websocket')
    const client = new Client({ $deps, ws, mqttClient, infrastructure })
    client.on('close', function onClientClose () {
      clients.delete(client)
    })
    clients.add(client)
  })
}
