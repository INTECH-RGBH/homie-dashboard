import createMqttClient from './lib/mqtt-client'
import Client from './lib/client'

export default function start ($deps) {
  const mqttClient = createMqttClient(`mqtt://${$deps.settings.mqtt.host}:${$deps.settings.mqtt.port}`)
  mqttClient.on('connect', function onConnect () {
    $deps.log.info('connected to broker')
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
