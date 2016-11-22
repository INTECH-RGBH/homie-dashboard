import createMqttClient from './lib/mqtt-client'
import {generateMessage, parseMessage, MESSAGE_TYPES} from '../common/ws-messages'

export default function start ($deps) {
  const mqttClient = createMqttClient(`mqtt://${$deps.settings.mqtt.host}:${$deps.settings.mqtt.port}`)
  mqttClient.on('connect', function onConnect () {
    $deps.log.info('connected to broker')
  })

  $deps.wss.on('connection', function onConnection (ws) {
    let authentified = false

    ws.on('message', function onMessage (message) {
      const parsed = parseMessage(message)

      if (parsed.method === 'tryAuth') {
        if (parsed.parameters === $deps.settings.password) {
          authentified = true
          ws.send(generateMessage({ type: MESSAGE_TYPES.RESPONSE, id: parsed.id, value: true }))
        } else {
          const msg = generateMessage({ type: MESSAGE_TYPES.RESPONSE, id: parsed.id, value: false })
          ws.send(msg)
          return
        }
      } else if (!authentified) return

      /* Arrived here, we are authentified */

      switch (parsed.method) {
      }
    })
  })
}
