import bunyan from 'bunyan'
import mqtt from 'mqtt'

const BASE_TOPIC = 'homie'
const STATS_INTERVAL_IN_SECONDS = 10
const DEVICES = [
  {
    id: 'temperaturedevice',
    name: 'Température',
    fw: { name: 'firmware', version: '1.0.0' },
    nodes: [
      {
        id: 'temperaturenode',
        type: 'temperature',
        properties: [
          { id: 'degrees', settable: false }
        ]
      }
    ]
  }
]

const log = bunyan.createLogger({ name: 'emulator' })
const client = mqtt.connect('mqtt://127.0.0.1:1883')
const qos1Retained = { qos: 1, retain: true }
let interval = null
let startTime = null
client.on('connect', function onConnect () {
  log.info('connected to the broker')

  startTime = new Date()

  for (let device of DEVICES) {
    log.info(`sending data of device ${device.id}`)
    client.publish(`${BASE_TOPIC}/${device.id}/$homie`, '2.0.0', qos1Retained)
    client.publish(`${BASE_TOPIC}/${device.id}/$name`, device.name, qos1Retained)
    client.publish(`${BASE_TOPIC}/${device.id}/$localip`, '127.0.0.1', qos1Retained)
    client.publish(`${BASE_TOPIC}/${device.id}/$mac`, '00:00:00:00:00:00', qos1Retained)
    client.publish(`${BASE_TOPIC}/${device.id}/$stats/interval`, STATS_INTERVAL_IN_SECONDS.toString(), qos1Retained)
    sendStats(device)
    client.publish(`${BASE_TOPIC}/${device.id}/$fw/name`, device.fw.name, qos1Retained)
    client.publish(`${BASE_TOPIC}/${device.id}/$fw/version`, device.fw.version, qos1Retained)
    client.publish(`${BASE_TOPIC}/${device.id}/$fw/checksum`, '00000000000000000000000000000000', qos1Retained)
    client.publish(`${BASE_TOPIC}/${device.id}/$implementation`, 'esp8266', qos1Retained)

    for (let node of device.nodes) {
      client.publish(`${BASE_TOPIC}/${device.id}/${node.id}/$type`, node.type, qos1Retained)
      let properties = ''
      for (let property of node.properties) properties += `${property.id}${property.settable ? ':settable' : ''}`
      client.publish(`${BASE_TOPIC}/${device.id}/${node.id}/$properties`, properties, qos1Retained)
    }

    client.publish(`${BASE_TOPIC}/${device.id}/$online`, 'true', qos1Retained)
  }

  interval = setInterval(sendAllStats, STATS_INTERVAL_IN_SECONDS * 1000)
})

client.on('close', function onClose () {
  log.info('disconnected from the broker')
  if (interval) clearInterval(interval)
})

const sendStats = function (device) {
  log.info(`sending stats of device ${device.id}`)
  const now = new Date()
  client.publish(`${BASE_TOPIC}/${device.id}/$stats/uptime`, Math.floor((now - startTime) / 1000).toString(), qos1Retained)
  client.publish(`${BASE_TOPIC}/${device.id}/$stats/signal`, (Math.floor(Math.random() * 100) + 0).toString(), qos1Retained)
}

const sendAllStats = function () {
  for (let device of DEVICES) {
    sendStats(device)

    device.nodes.forEach(function (node) {
      if (node.type === 'temperature') {
        client.publish(`${BASE_TOPIC}/${device.id}/${node.id}/degrees`, (Math.floor(Math.random() * 30) + 0).toString(), qos1Retained)
      }
    })
  }
}
