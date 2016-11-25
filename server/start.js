import throttle from 'lodash.throttle'
import createMqttClient from './lib/mqtt-client'
import Client from './lib/client'
import MqttRelay from './lib/mqtt-relay'
import infrastructure from './lib/infrastructure/infrastructure'
import {generateMessage, MESSAGE_TYPES} from '../common/ws-messages'
import {INFRASTRUCTURE_UPDATE} from '../common/events'
import {syncInfrastructure, getAllDevices} from './services/database'

const UPDATE_THROTTLE = 200

export default async function start ($deps) {
  /* Populate the infrastructure from the DB */

  await getAllDevices($deps, infrastructure)

  /* Initialize the MQTT client */

  const mqttClient = createMqttClient(`mqtt://${$deps.settings.mqtt.host}:${$deps.settings.mqtt.port}`)
  mqttClient.on('connect', function onConnect () {
    $deps.log.info('connected to broker')
    mqttClient.subscribe('homie/#', { qos: 1 })
  })

  /* Hook the infrastructure to the MQTT */

  const mqttRelay = new MqttRelay({ $deps, mqttClient, infrastructure }) // eslint-disable-line no-unused-vars

  /* Handle infrastructure updates */

  infrastructure.on('update', throttle(async (update) => {
    $deps.log.debug('synchronizing database')
    await syncInfrastructure($deps, infrastructure)
    const message = generateMessage({ type: MESSAGE_TYPES.EVENT, event: INFRASTRUCTURE_UPDATE, value: infrastructure.toJSON() })
    for (const client of $deps.wss.clients) {
      client.send(message)
    }
  }, UPDATE_THROTTLE))

  /* Handle WS */

  const clients = new Set()
  $deps.wss.on('connection', function onConnection (ws) {
    $deps.log.debug('connection on websocket')
    const client = new Client({ $deps, ws })
    client.on('close', function onClientClose () {
      clients.delete(client)
    })
    clients.add(client)
  })
}
