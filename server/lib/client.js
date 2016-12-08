import {EventEmitter} from 'events'

import {generateMessage, parseMessage, MESSAGE_TYPES} from '../../common/ws-messages'
import {INFRASTRUCTURE} from '../../common/events'
import Tag from './infrastructure/tag'

/**
 * This class handles WebSocket clients
 * This is where every request gets parsed / responded
 @augments EventEmitter
 */
export default class Client extends EventEmitter {
  /**
   * Constructor
   @param {Object} opts
   @param {Object} opts.$deps
   @param {MqttClient} opts.mqttClient
   @param {Infrastructure} opts.infrastructure
   */
  constructor (opts) {
    super()

    this.$deps = opts.$deps
    this.ws = opts.ws
    this.mqttClient = opts.mqttClient
    this.infrastructure = opts.infrastructure

    this.ws.send(generateMessage({ type: MESSAGE_TYPES.EVENT, event: INFRASTRUCTURE, value: this.infrastructure.toJSON() }))

    this.ws.on('message', data => {
      const message = parseMessage(data)
      this.onMessage(message)
    })

    this.ws.on('close', () => {
      this.emit('close')
    })
  }

  /**
   * This function sends a response
   @param {Object} request the initial request
   @param {} value value to respond
   */
  _sendResponse (request, value) {
    this.ws.send(generateMessage({ type: MESSAGE_TYPES.RESPONSE, id: request.id, value }))
  }

  /**
   * This function is called when we receive a message from the client
   @param {Object} message message received
   */
  async onMessage (message) {
    if (message.type !== MESSAGE_TYPES.REQUEST) return

    /* Handle requests */

    if (message.method === 'setState') {
      const deviceId = message.parameters.deviceId
      const nodeId = message.parameters.nodeId
      const property = message.parameters.property
      const value = message.parameters.value

      this.mqttClient.publish(`homie/${deviceId}/${nodeId}/${property}/set`, value, { qos: 1, retain: true })

      this._sendResponse(message, true)
    } else if (message.method === 'createTag') {
      const tagId = message.parameters.id

      const tag = new Tag()
      tag.id = tagId
      this.infrastructure.addTag(tag)

      this._sendResponse(message, true)
    } else if (message.method === 'toggleTag') {
      const deviceId = message.parameters.deviceId
      const nodeId = message.parameters.nodeId
      const tagId = message.parameters.tagId
      const operationAdd = message.parameters.operationAdd

      const node = this.infrastructure.getDevice(deviceId).getNode(nodeId)
      const tag = this.infrastructure.getTag(tagId)

      if (operationAdd) node.addTag(tag)
      else node.deleteTag(tag)

      this._sendResponse(message, true)
    } else if (message.method === 'deleteTag') {
      const tagId = message.parameters.tagId

      this.infrastructure.deleteTag(tagId)

      this._sendResponse(message, true)
    }
  }
}
