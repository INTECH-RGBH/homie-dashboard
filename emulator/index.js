import bunyan from 'bunyan'
import mqtt from 'mqtt'

const BASE_TOPIC = 'homie'
const STATS_INTERVAL_IN_SECONDS = 3
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
  },
  {
    id: 'lightdevice',
    name: 'Lumière',
    fw: { name: 'firmware', version: '1.0.0' },
    nodes: [
      {
        id: 'lightnode',
        type: 'light',
        properties: [
          { id: 'color', settable: true },
          { id: 'intensity', settable: true }
        ]
      }
    ]
  },
  {
    id: 'switchdevice',
    name: 'Interrupteur',
    fw: { name: 'firmware', version: '1.0.0' },
    nodes: [
      {
        id: 'switchnode',
        type: 'switch',
        properties: [
          { id: 'on', settable: true }
        ]
      }
    ]
  },
  {
    id: 'humiditydevice',
    name: 'Humidité',
    fw: { name: 'firmware', version: '1.0.0' },
    nodes: [
      {
        id: 'humiditynode',
        type: 'humidity',
        properties: [
          { id: 'percentage', settable: false }
        ]
      }
    ]
  },
  {
    id: 'shuttersdevice',
    name: 'Volets',
    fw: { name: 'firmware', version: '1.0.0' },
    nodes: [
      {
        id: 'shuttersnode',
        type: 'shutters',
        properties: [
          { id: 'percentage', settable: true }
        ]
      }
    ]
  },
  {
    id: 'doordevice',
    name: 'Porte',
    fw: { name: 'firmware', version: '1.0.0' },
    nodes: [
      {
        id: 'doornode',
        type: 'door',
        properties: [
          { id: 'open', settable: false }
        ]
      }
    ]
  },
  {
    id: 'windowdevice',
    name: 'Fenêtre',
    fw: { name: 'firmware', version: '1.0.0' },
    nodes: [
      {
        id: 'windownode',
        type: 'window',
        properties: [
          { id: 'window', settable: false }
        ]
      }
    ]
  },
  {
    id: 'lockdevice',
    name: 'Verrou',
    fw: { name: 'firmware', version: '1.0.0' },
    nodes: [
      {
        id: 'locknode',
        type: 'lock',
        properties: [
          { id: 'open', settable: true }
        ]
      }
    ]
  },
  {
    id: 'heaterdevice',
    name: 'Chauffage',
    fw: { name: 'firmware', version: '1.0.0' },
    nodes: [
      {
        id: 'heaternode',
        type: 'heater',
        properties: [
          { id: 'degrees', settable: true }
        ]
      }
    ]
  },
  {
    id: 'sounddevice',
    name: 'Son',
    fw: { name: 'firmware', version: '1.0.0' },
    nodes: [
      {
        id: 'soundnode',
        type: 'sound',
        properties: [
          { id: 'intensity', settable: false }
        ]
      }
    ]
  },
  {
    id: 'luminositydevice',
    name: 'Luminosité',
    fw: { name: 'firmware', version: '1.0.0' },
    nodes: [
      {
        id: 'luminositynode',
        type: 'luminosity',
        properties: [
          { id: 'lux', settable: false }
        ]
      }
    ]
  },
  {
    id: 'motiondevice',
    name: 'Mouvement',
    fw: { name: 'firmware', version: '1.0.0' },
    nodes: [
      {
        id: 'motionnode',
        type: 'motion',
        properties: [
          { id: 'motion', settable: false }
        ]
      }
    ]
  },
  {
    id: 'buzzerdevice',
    name: 'Buzzer',
    fw: { name: 'firmware', version: '1.0.0' },
    nodes: [
      {
        id: 'buzzernode',
        type: 'buzzer',
        properties: [
          { id: 'buzzing', settable: true }
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

  client.subscribe('homie/+/+/+/set')

  interval = setInterval(sendAllStats, STATS_INTERVAL_IN_SECONDS * 1000)
})

client.on('message', function onMessage (topic, message) {
  client.publish(topic.substr(0, topic.length - 4), message)
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
      } else if (node.type === 'humidity') {
        client.publish(`${BASE_TOPIC}/${device.id}/${node.id}/percentage`, (Math.floor(Math.random() * 100) + 0).toString(), qos1Retained)
      } else if (node.type === 'door' || node.type === 'window') {
        client.publish(`${BASE_TOPIC}/${device.id}/${node.id}/open`, Math.random() < 0.5 ? '1' : '0', qos1Retained)
      } else if (node.type === 'sound') {
        client.publish(`${BASE_TOPIC}/${device.id}/${node.id}/intensity`, (Math.floor(Math.random() * 30) + 0).toString(), qos1Retained)
      } else if (node.type === 'luminosity') {
        client.publish(`${BASE_TOPIC}/${device.id}/${node.id}/lux`, (Math.floor(Math.random() * 30) + 0).toString(), qos1Retained)
      } else if (node.type === 'motion') {
        client.publish(`${BASE_TOPIC}/${device.id}/${node.id}/motion`, Math.random() < 0.5 ? '1' : '0', qos1Retained)
      }
    })
  }
}
