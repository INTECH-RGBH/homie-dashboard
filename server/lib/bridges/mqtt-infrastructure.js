import homieTopicParser, {TOPIC_TYPES} from '../homie-topic-parser'
import Device from '../infrastructure/device'
import Node from '../infrastructure/node'
import Property from '../infrastructure/property'

/**
 * This funcion bridges the MQTT to the infrastructure
 */
export function bridgeMqttToInfrastructure ({$deps, mqttClient, infrastructure}) {
  mqttClient.on('connect', function onConnect () {
    $deps.log.info('connected to broker')
    mqttClient.subscribe('homie/#', { qos: 1 })
  })
  mqttClient.on('message', (topic, value) => {
    const message = homieTopicParser.parse(topic, value.toString())
    if (message.type === TOPIC_TYPES.INVALID) return

    /* Handle device properties */

    if (message.type === TOPIC_TYPES.DEVICE_PROPERTY) {
      let device
      if (!infrastructure.hasDevice(message.deviceId)) {
        device = new Device()
        infrastructure.addDevice(device)
        device.id = message.deviceId
      } else device = infrastructure.getDevice(message.deviceId)

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

    if (!infrastructure.hasDevice(message.deviceId)) return
    const device = infrastructure.getDevice(message.deviceId)

    /* Handle node special properties */

    if (message.type === TOPIC_TYPES.NODE_SPECIAL_PROPERTY) {
      let node
      if (!device.hasNode(message.nodeId)) {
        node = new Node()
        device.addNode(node)
        node.device = device
        node.id = message.nodeId
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
        node.addProperty(property)
        property.node = node
        property.id = message.property
      } else property = node.getProperty(message.property)

      property.value = message.value
      return
    }
  })
}
