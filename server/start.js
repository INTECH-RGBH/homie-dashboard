import createMqttClient from './lib/mqtt-client'
import Client from './lib/client'
import {bridgeMqttToInfrastructure} from './lib/bridges/mqtt-infrastructure'
import {bridgeInfrastructureToDatabase} from './lib/bridges/infrastructure-database'
import {bridgeInfrastructureToWebsocket} from './lib/bridges/infrastructure-websocket'
import infrastructure from './lib/infrastructure/infrastructure'
import {getInfrastructure} from './services/database'

/* Register models */

import './models/AuthToken'
import './models/Device'
import './models/Floor'
import './models/Node'
import './models/Property'
import './models/PropertyHistory'
import './models/Room'
import './models/Tag'

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
