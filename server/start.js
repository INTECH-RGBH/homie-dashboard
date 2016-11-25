import throttle from 'lodash.throttle'
import createMqttClient from './lib/mqtt-client'
import Client from './lib/client'
import MqttRelay from './lib/mqtt-relay'
import infrastructure from './lib/infrastructure/infrastructure'
import {syncInfrastructure, getAllDevices} from './services/database'

const UPDATE_THROTTLE = 200

export default async function start ($deps) {
  const mqttClient = createMqttClient(`mqtt://${$deps.settings.mqtt.host}:${$deps.settings.mqtt.port}`)
  mqttClient.on('connect', function onConnect () {
    $deps.log.info('connected to broker')
    mqttClient.subscribe('homie/#', { qos: 1 })
  })

  await getAllDevices($deps, infrastructure)

  const mqttRelay = new MqttRelay({ $deps, mqttClient, infrastructure })

  infrastructure.on('update', throttle(async () => {
    console.log('syncing database')
    await syncInfrastructure($deps, infrastructure)
  }, UPDATE_THROTTLE))

  const clients = []
  $deps.wss.on('connection', function onConnection (ws) {
    const client = new Client({ $deps, ws })
    clients.push(client)
    client.on('close', function onClose () {
      clients.splice(clients.indexOf(client), 1) // remove from array
    })
  })
}
