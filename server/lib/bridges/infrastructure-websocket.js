import jsonpatch from 'fast-json-patch'
import {generateMessage, MESSAGE_TYPES} from '../../../common/ws-messages'
import {INFRASTRUCTURE_PATCH} from '../../../common/events'

/**
 * This funcion bridges the MQTT to the WebSocket
 */
export function bridgeInfrastructureToWebsocket ({$deps, infrastructure}) {
  let lastInfrastructure = infrastructure.toJSON()
  infrastructure.on('update', function onUpdate (update) {
    // send to ws
    const currentInfrastructure = infrastructure.toJSON()
    const patch = jsonpatch.compare(lastInfrastructure, currentInfrastructure)
    lastInfrastructure = currentInfrastructure
    const message = generateMessage({ type: MESSAGE_TYPES.EVENT, event: INFRASTRUCTURE_PATCH, value: patch })
    for (const client of $deps.wss.clients) {
      client.send(message)
    }
  })
}
