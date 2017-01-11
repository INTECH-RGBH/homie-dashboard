import os from 'os'
import dgram from 'dgram'

const MULTICAST_ADDRESS = '224.0.0.50'
const SERVER_PORT = 9898

const BASE_TOPIC = 'homie'

const serverSocket = dgram.createSocket('udp4')
const qos1Retained = { qos: 1, retain: true }

export default function start (opts) {
  const { settings, log, mqttClient } = opts

  serverSocket.on('listening', function () {
    log.info('aqara binding listening')
    Object.values(os.networkInterfaces()).forEach(function (iface) {
      iface.forEach(function (connection) {
        if (connection.family === 'IPv4') serverSocket.addMembership(MULTICAST_ADDRESS, connection.address)
      })
    })
    log.info('aqara binding registered to multicast')

    const payload = '{"cmd": "get_id_list"}'
    serverSocket.send(payload, 0, payload.length, SERVER_PORT, settings.gateway.ip)
  })

  serverSocket.on('message', function (message) {
    message = JSON.parse(message.toString())

    switch (message.cmd) {
      case 'heartbeat':
        break
      case 'get_id_list_ack':
        for (const sid of JSON.parse(message.data)) {
          const payload = `{"cmd": "read", "sid": "${sid}"}`
          serverSocket.send(payload, 0, payload.length, SERVER_PORT, settings.gateway.ip)
        }
        break
      case 'read_ack':
        let sid = message.sid
        let type = message.model
        let state = JSON.parse(message.data)

        let mapped = mapToHomie({ sid, type, state })

        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$homie`, '2.0.0', qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$name`, mapped.deviceName, qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$localip`, settings.gateway.ip, qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$mac`, '00:00:00:00:00:00', qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$stats/interval`, '0', qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$stats/uptime`, '0', qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$stats/signal`, '100', qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$fw/name`, 'aqara-binding', qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$fw/version`, '1.0.0', qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$fw/checksum`, '00000000000000000000000000000000', qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$implementation`, 'aqara', qos1Retained)

        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/${mapped.nodeId}/$type`, mapped.nodeType, qos1Retained)
        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/${mapped.nodeId}/$properties`, mapped.nodeProperties, qos1Retained)
        for (const property of mapped.properties) mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/${mapped.nodeId}/${property.id}`, property.value, qos1Retained)

        mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/$online`, 'true', qos1Retained)

        break
      case 'report':
        sid = message.sid
        type = message.model
        state = JSON.parse(message.data)

        mapped = mapToHomie({ sid, type, state })

        for (const property of mapped.properties) mqttClient.publish(`${BASE_TOPIC}/${mapped.deviceId}/${mapped.nodeId}/${property.id}`, property.value, qos1Retained)

        break
    }
  })

  serverSocket.bind(SERVER_PORT)
}

function mapToHomie (opts) {
  const { sid, type, state } = opts

  const toReturn = {
    deviceId: `aqara-${sid}`,
    deviceName: null,
    nodeId: null,
    nodeType: null,
    nodeProperties: null,
    properties: []
  }

  switch (type) {
    case 'magnet':
      Object.assign(toReturn, {
        deviceName: 'Porte',
        nodeId: 'door',
        nodeType: 'door',
        nodeProperties: 'open'
      })
      toReturn.properties.push({ id: 'open', value: state.status === 'open' ? '0' : '1' })
      break
    case 'switch':
      Object.assign(toReturn, {
        deviceName: 'Bouton',
        nodeId: 'button',
        nodeType: 'button',
        nodeProperties: 'pressed'
      })
      toReturn.properties.push({ id: 'pressed', value: state.status === 'long_click_press' ? '1' : '0' })
      break
  }

  return toReturn
}
