import createMqttClient from './lib/mqtt-client'
import Client from './lib/client'
import {bridgeMqttToInfrastructure} from './lib/bridges/mqtt-infrastructure'
import {bridgeInfrastructureToDatabase} from './lib/bridges/infrastructure-database'
import {bridgeInfrastructureToWebsocket} from './lib/bridges/infrastructure-websocket'
import infrastructure from './lib/infrastructure/infrastructure'
import {getInfrastructure} from './services/database'

/* import bindings */

import aqaraBinding from './bindings/aqara'
import yeelightBinding from './bindings/yeelight'
const BINDINGS = {
  aqara: aqaraBinding,
  yeelight: yeelightBinding
}

/* Register models */

import './models/auth-token'
import './models/device'
import './models/floor'
import './models/node'
import './models/property'
import './models/property-history'
import './models/room'
import './models/tag'

export default async function start ($deps) {
  /* Populate the infrastructure from the DB */

  await getInfrastructure(infrastructure)

  /* Initialize the MQTT client */

  const mqttClient = createMqttClient(`mqtt://${$deps.settings.mqtt.host}:${$deps.settings.mqtt.port}`)

  /* Handle infrastructure updates */

  bridgeInfrastructureToDatabase({ $deps, infrastructure })
  bridgeInfrastructureToWebsocket({ $deps, infrastructure })

  /* Bridge the MQTT to the infrastructure */

  bridgeMqttToInfrastructure({ $deps, mqttClient, infrastructure })

  /* start bindings */

  for (const binding of Object.keys($deps.settings.bindings)) {
    const settings = $deps.settings.bindings[binding]
    if (!settings.enabled) continue

    BINDINGS[binding]({ settings, log: $deps.log, mqttClient })
    $deps.log.info(`${binding} binding started`)
  }

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
