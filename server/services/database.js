import uuid from 'uuid'
import {dateToSqlite} from '../helpers/sqlite'
import Device from '../lib/infrastructure/device'
import Node from '../lib/infrastructure/node'
import Property from '../lib/infrastructure/property'

/* Auth */

export async function createAuthToken ({ db }) {
  const token = uuid()
  const now = new Date()

  await db.run(
    'INSERT INTO auth_tokens (token, last_activity) VALUES (?, ?)',
    token, dateToSqlite(now)
  )

  return token
}

export async function checkToken ({ db }, token) {
  const record = await db.get(
    'SELECT * FROM auth_tokens WHERE token = ?',
    token
  )

  return record !== undefined
}

export async function deleteToken ({ db }, token) {
  const result = await db.run(
    'DELETE FROM auth_tokens WHERE token = ?',
    token
  )

  return result.changes === 1
}

/* Devices */

export async function syncInfrastructure ({ db }, infrastructure) {
  for (let device of infrastructure.getDevices()) {
    const deviceInDb = await db.get(
      `SELECT * FROM devices WHERE id = ?`,
      device.id
    )

    if (deviceInDb) {
      await db.run(
        `UPDATE devices
        SET name = :name, online = :online, local_ip = :local_ip, mac = :mac, stats_signal = :stats_signal, stats_uptime = :stats_uptime, stats_interval_in_seconds = :stats_interval_in_seconds, fw_name = :fw_name, fw_version = :fw_version, fw_checksum = :fw_checksum, implementation = :implementation
        WHERE id = :id`, {
          ':name': device.name,
          ':online': device.online,
          ':local_ip': device.localIp,
          ':mac': device.mac,
          ':stats_signal': device.getStatProperty('signal'),
          ':stats_uptime': device.getStatProperty('uptime'),
          ':stats_interval_in_seconds': device.getStatProperty('interval'),
          ':fw_name': device.getFirmwareProperty('name'),
          ':fw_version': device.getFirmwareProperty('version'),
          ':fw_checksum': device.getFirmwareProperty('checksum'),
          ':implementation': device.implementation,
          ':id': device.id
        })
    } else {
      await db.run(
        `INSERT INTO devices (id, name, online, local_ip, mac, stats_signal, stats_uptime, stats_interval_in_seconds, fw_name, fw_version, fw_checksum, implementation)
        SELECT :id, :name, :online, :local_ip, :mac, :stats_signal, :stats_uptime, :stats_interval_in_seconds, :fw_name, :fw_version, :fw_checksum, :implementation
        WHERE (SELECT id FROM devices WHERE id = :id) IS NULL
        `, {
          ':id': device.id,
          ':name': device.name,
          ':online': device.online,
          ':local_ip': device.localIp,
          ':mac': device.mac,
          ':stats_signal': device.getStatProperty('signal'),
          ':stats_uptime': device.getStatProperty('uptime'),
          ':stats_interval_in_seconds': device.getStatProperty('interval'),
          ':fw_name': device.getFirmwareProperty('name'),
          ':fw_version': device.getFirmwareProperty('version'),
          ':fw_checksum': device.getFirmwareProperty('checksum'),
          ':implementation': device.implementation
        })
    }

    /* devices table now in sync */

    for (let node of device.getNodes()) {
      const nodeInDb = await db.get(
        `SELECT * FROM nodes WHERE device_id = :device_id AND device_node_id = :device_node_id`, {
          ':device_id': device.id,
          ':device_node_id': node.id
        })

      let nodeId
      if (nodeInDb) {
        nodeId = nodeInDb.id
        await db.run(
          `UPDATE nodes
          SET type = :type, properties = :properties
          WHERE id = :id`, {
            ':type': node.type,
            ':properties': node.propertiesDefinition,
            ':id': nodeId
          })
      } else {
        const statement = await db.run(
          `INSERT INTO nodes (device_id, device_node_id, type, properties)
          SELECT :device_id, :device_node_id, :type, :properties
          WHERE (SELECT id FROM nodes WHERE device_id = :device_id AND device_node_id = :device_node_id) IS NULL
          `, {
            ':device_id': device.id,
            ':device_node_id': node.id,
            ':type': node.type,
            ':properties': node.propertiesDefinition
          })
        nodeId = statement.lastID
      }

      /* syncing properties */

      for (let property of node.getProperties()) {
        const propertyInDb = await db.get(
          `SELECT * FROM properties WHERE node_id = :node_id AND node_property_id = :node_property_id`, {
            ':node_id': nodeId,
            ':node_property_id': property.id
          })

        let propertyId
        if (!propertyInDb) {
          let statement = await db.run(
            `INSERT INTO properties (node_id, node_property_id)
            SELECT :node_id, :node_property_id
            WHERE (SELECT id FROM properties WHERE node_id = :node_id AND node_property_id = :node_property_id) IS NULL
            `, {
              ':node_id': nodeId,
              ':node_property_id': property.id
            })

          propertyId = statement.lastID
        } else {
          propertyId = propertyInDb.id
        }

        /* syncing properties values */
        await db.run(
          `INSERT INTO property_history (property_id, value, date)
          SELECT :property_id, :value, :date
          WHERE (SELECT value FROM property_history WHERE property_id = :property_id ORDER BY id DESC LIMIT 1) IS NULL OR (SELECT value FROM property_history WHERE property_id = :property_id ORDER BY id DESC LIMIT 1) <> :value
          `, {
            ':property_id': propertyId,
            ':value': property.value,
            ':date': dateToSqlite(new Date())
          })
      }
    }
  }
}

export async function getAllDevices ({ db }, infrastructure) {
  const values = await db.all(
    `SELECT
      d.id AS 'd.id',
      d.name AS 'd.name',
      d.online AS 'd.online',
      d.local_ip AS 'd.local_ip',
      d.mac AS 'd.mac',
      d.stats_signal AS 'd.stats_signal',
      d.stats_uptime AS 'd.stats_uptime',
      d.stats_interval_in_seconds AS 'd.stats_interval_in_seconds',
      d.fw_name AS 'd.fw_name',
      d.fw_checksum AS 'd.fw_checksum',
      d.implementation AS 'd.implementation',
      n.device_node_id AS 'n.device_node_id',
      n.type AS 'n.type',
      n.properties AS 'n.properties',
      p.node_property_id AS 'p.node_property_id',
      h.value AS 'h.value'
    FROM property_history h
    INNER JOIN properties p ON h.property_id = p.id
    INNER JOIN nodes n ON p.node_id = n.id
    INNER JOIN devices d ON n.device_id = d.id
    GROUP BY d.id, n.device_node_id, p.node_property_id
    `)

  for (let value of values) {
    let device
    if (!infrastructure.hasDevice(value['d.id'])) {
      device = new Device()
      device.id = value['d.id']
      device.name = value['d.name']
      device.online = value['d.online']
      device.localIp = value['d.local_ip']
      device.mac = value['d.mac']
      device.setStatProperty('signal', parseInt(value['d.stats_signal'], 10))
      device.setStatProperty('uptime', parseInt(value['d.stats_uptime'], 10))
      device.setStatProperty('interval', parseInt(value['d.stats_interval_in_seconds'], 10))
      device.setFirmwareProperty('name', value['d.fw_name'])
      device.setFirmwareProperty('version', value['d.fw_version'])
      device.setFirmwareProperty('checksum', value['d.fw_checksum'])
      device.implementation = value['d.implementation']
      infrastructure.addDevice(device)
    } else device = infrastructure.getDevice(value['d.id'])

    let node
    if (!device.hasNode(value['n.device_node_id'])) {
      node = new Node()
      node.device = device
      node.id = value['n.device_node_id']
      node.type = value['n.type']
      node.propertiesDefinition = value['n.properties']
      device.addNode(node)
    } else node = device.getNode(value['n.device_node_id'])

    let property
    if (!node.hasProperty(value['p.node_property_id'])) {
      property = new Property()
      property.node = node
      property.id = value['p.node_property_id']
      property.value = value['h.value']
      node.addProperty(property)
    } else property = node.getProperty(value['p.node_property_id'])
  }
}
