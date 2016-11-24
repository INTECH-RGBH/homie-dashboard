import createMqttClient from './lib/mqtt-client'
import Client from './lib/client'
import MqttRelay from './lib/mqtt-relay'

export default function start ($deps) {
  const mqttClient = createMqttClient(`mqtt://${$deps.settings.mqtt.host}:${$deps.settings.mqtt.port}`)
  mqttClient.on('connect', function onConnect () {
    $deps.log.info('connected to broker')
    mqttClient.subscribe('homie/#', { qos: 1 })
  })

  const mqttRelay = new MqttRelay({ $deps, mqttClient })
  mqttRelay.on('deviceReady', function (device) {
    $deps.log.info('device ready', device)
  })

  mqttRelay.on('devicePropertyUpdate', function (property) {
    $deps.log.info('device property update', property)
  })

  mqttRelay.on('nodePropertyUpdate', function (property) {
    $deps.log.info('node property update', property)
  })

  const clients = []
  $deps.wss.on('connection', function onConnection (ws) {
    const client = new Client({ $deps, ws })
    clients.push(client)
    client.on('close', function onClose () {
      clients.splice(clients.indexOf(client), 1) // remove from array
    })
  })
}
