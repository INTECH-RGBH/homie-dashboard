import {EventEmitter} from 'events'
import homieTopicParser, {TOPIC_TYPES} from './homie-topic-parser'

export default class MqttRelay extends EventEmitter {
  constructor ({ $deps, mqttClient }) {
    super()
    this.$deps = $deps
    this.mqttClient = mqttClient

    this.completeDevices = {}
    this.incompleteDevices = {}

    this.mqttClient.on('message', (topic, value) => {
      const message = homieTopicParser.parse(topic, value.toString())
      if (message.type === TOPIC_TYPES.INVALID) return

      /* Handle device properties */

      if (message.type === TOPIC_TYPES.DEVICE_PROPERTY) {
        // if the device already sent its device properties
        if (this.completeDevices.hasOwnProperty(message.deviceId)) {
          let value
          switch (message.property) {
            case 'stats/signal':
              value = parseInt(message.value, 10)
              break
            case 'stats/uptime':
              value = parseInt(message.value, 10)
              break
            case 'online':
              value = message.value === 'true'
              this.completeDevices[message.deviceId].id = message.deviceId
              this.completeDevices[message.deviceId].state.online = value
              delete this.completeDevices[message.deviceId].incompleteNodes
              this.emit('deviceReady', this.completeDevices[message.deviceId])
              return
          }

          return this.emit('devicePropertyUpdate', {
            deviceId: message.deviceId,
            property: message.property,
            value
          })
        } else {
          if (!this.incompleteDevices[message.deviceId]) this.incompleteDevices[message.deviceId] = { stats: {}, fw: {} }
          const device = this.incompleteDevices[message.deviceId]
          switch (message.property) {
            case 'name':
              device.name = message.value
              return
            case 'ip':
              device.ip = message.value
              return
            case 'mac':
              device.mac = message.value
              return
            case 'stats/signal':
              device.stats.signal = parseInt(message.value, 10)
              return
            case 'stats/uptime':
              device.stats.uptime = parseInt(message.value, 10)
              return
            case 'stats/interval':
              device.stats.interval = parseInt(message.value, 10)
              return
            case 'fw/name':
              device.fw.name = message.value
              return
            case 'fw/version':
              device.fw.version = message.value
              return
            case 'fw/checksum':
              device.fw.checksum = message.value
              return
            case 'implementation': // end of device properties
              device.implementation = message.value
              this.completeDevices[message.deviceId] = { state: device, incompleteNodes: {}, completeNodes: {} }
              delete this.incompleteDevices[message.deviceId]
              return
          }
        }
      }

      if (!this.completeDevices.hasOwnProperty(message.deviceId)) return

      /* Handle node special properties */

      if (message.type === TOPIC_TYPES.NODE_SPECIAL_PROPERTY) {
        if (!this.completeDevices[message.deviceId].incompleteNodes[message.nodeId]) this.completeDevices[message.deviceId].incompleteNodes[message.nodeId] = { id: message.nodeId }
        const node = this.completeDevices[message.deviceId].incompleteNodes[message.nodeId]

        switch (message.property) {
          case 'type':
            node.type = message.value
            return
          case 'properties':
            node.properties = message.value
            this.completeDevices[message.deviceId].completeNodes[node.id] = node
            delete this.completeDevices[message.deviceId].incompleteNodes[node.id]
            return
        }
      }

      if (!this.completeDevices[message.deviceId].completeNodes.hasOwnProperty(message.nodeId)) return

      /* Handle node properties */

      if (message.type === TOPIC_TYPES.NODE_PROPERTY) {
        this.emit('nodePropertyUpdate', {
          deviceId: message.deviceId,
          nodeId: message.nodeId,
          property: message.property,
          value: message.value
        })
      }
    })
  }
}
