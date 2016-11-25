import {EventEmitter} from 'events'
import homieTopicParser, {TOPIC_TYPES} from './homie-topic-parser'
import Device from './infrastructure/device'
import Node from './infrastructure/node'
import Property from './infrastructure/property'

export default class MqttRelay extends EventEmitter {
  constructor ({ $deps, mqttClient, infrastructure }) {
    super()
    this.$deps = $deps
    this.mqttClient = mqttClient
    this.infrastructure = infrastructure

    this.mqttClient.on('message', (topic, value) => {
      const message = homieTopicParser.parse(topic, value.toString())
      if (message.type === TOPIC_TYPES.INVALID) return

      /* Handle device properties */

      if (message.type === TOPIC_TYPES.DEVICE_PROPERTY) {
        let device
        if (!this.infrastructure.hasDevice(message.deviceId)) {
          device = new Device()
          device.once('valid', () => {
            this.emit('device', device)
          })
          device.id = message.deviceId
          this.infrastructure.addDevice(device)
        } else device = this.infrastructure.getDevice(message.deviceId)

        switch (message.property) {
          case 'name':
            device.name = message.value
            return
          case 'localip':
            device.localIp = message.value
            return
          case 'mac':
            device.mac = message.value
            return
          case 'stats/signal':
            device.setStatProperty('signal', parseInt(message.value, 10))
            return
          case 'stats/uptime':
            device.setStatProperty('uptime', parseInt(message.value, 10))
            return
          case 'stats/interval':
            device.setStatProperty('interval', parseInt(message.value, 10))
            return
          case 'fw/name':
            device.setFirmwareProperty('name', message.value)
            return
          case 'fw/version':
            device.setFirmwareProperty('version', message.value)
            return
          case 'fw/checksum':
            device.setFirmwareProperty('checksum', message.value)
            return
          case 'implementation':
            device.implementation = message.value
            return
          case 'online':
            device.online = message.value === 'true'
            return
        }
      }

      if (!this.infrastructure.hasDevice(message.deviceId)) return
      const device = this.infrastructure.getDevice(message.deviceId)

      /* Handle node special properties */

      if (message.type === TOPIC_TYPES.NODE_SPECIAL_PROPERTY) {
        let node
        if (!device.hasNode(message.nodeId)) {
          node = new Node()
          node.once('valid', () => {
            this.emit('node', node)
          })
          node.device = device
          node.id = message.nodeId
          device.addNode(node)
        } else node = device.getNode(message.nodeId)

        switch (message.property) {
          case 'type':
            node.type = message.value
            return
          case 'properties':
            node.propertiesDefinition = message.value
            return
        }
      }

      if (!device.hasNode(message.nodeId)) return
      const node = device.getNode(message.nodeId)

      /* Handle node properties */

      if (message.type === TOPIC_TYPES.NODE_PROPERTY) {
        let property
        if (!node.hasProperty(message.property)) {
          property = new Property()
          property.once('valid', () => {
            this.emit('property', property)
          })
          property.node = node
          property.id = message.property
          node.addProperty(property)
        } else property = node.getProperty(message.property)

        property.value = message.value
        return
      }
    })
  }
}
