import DeviceModel from '../../models/Device'
import NodeModel from '../../models/Node'
import PropertyModel from '../../models/Property'
import PropertyHistoryModel from '../../models/PropertyHistory'
import Device from '../infrastructure/device'
import Node from '../infrastructure/node'
import Property from '../infrastructure/property'

/**
 * This funcion bridges the infrastructure to the database
 */
export function bridgeInfrastructureToDatabase ({$deps, infrastructure}) {
  let databaseQueue = Promise.resolve()

  infrastructure.on('newDevice', function onNewDevice (device) {
    databaseQueue = databaseQueue.then(() => {
      $deps.log.debug(`inserting new device ${device.id} into DB`)
      return DeviceModel.forge({
        id: device.id,
        name: device.name,
        online: device.online,
        local_ip: device.localIp,
        mac: device.mac,
        stats_signal: device.getStatProperty('signal'),
        stats_uptime: device.getStatProperty('uptime'),
        stats_interval_in_seconds: device.getStatProperty('interval'),
        fw_name: device.getFirmwareProperty('name'),
        fw_version: device.getFirmwareProperty('version'),
        fw_checksum: device.getFirmwareProperty('checksum'),
        implementation: device.implementation
      }).save(null, { method: 'insert' })
    }).then((model) => {
      device.model = model
    })
  })

  infrastructure.on('newNode', function onNewNode (node) {
    databaseQueue = databaseQueue.then(() => {
      $deps.log.debug(`inserting new node ${node.id} into DB`)
      return NodeModel.forge({
        device_id: node.device.id,
        device_node_id: node.id,
        type: node.type,
        properties: node.propertiesDefinition
      }).save()
    }).then((model) => {
      node.model = model
    })
  })

  infrastructure.on('newProperty', function onNewProperty (property) {
    databaseQueue = databaseQueue.then(() => {
      $deps.log.debug(`inserting new property ${property.id} into DB`)
      return PropertyModel.forge({
        node_id: property.node.model.id,
        node_property_id: property.id
      }).save()
    }).then((model) => {
      property.model = model

      return PropertyHistoryModel.forge({
        property_id: property.model.id,
        value: property.value,
        date: new Date()
      }).save()
    })
  })

  infrastructure.on('update', function onUpdate (update) {
    switch (update.entity.constructor) {
      case Device:
        if (!update.entity.model) return
        databaseQueue = databaseQueue.then(() => {
          $deps.log.debug(`updating device ${update.entity.id} in DB`)
          return update.entity.model.set({
            name: update.entity.name,
            online: update.entity.online,
            local_ip: update.entity.localIp,
            stats_signal: update.entity.getStatProperty('signal'),
            stats_uptime: update.entity.getStatProperty('uptime'),
            stats_interval_in_seconds: update.entity.getStatProperty('interval'),
            fw_name: update.entity.getFirmwareProperty('name'),
            fw_version: update.entity.getFirmwareProperty('version'),
            fw_checksum: update.entity.getFirmwareProperty('checksum')
          }).save()
        })

        break
      case Node:
        if (!update.entity.model) return
        databaseQueue = databaseQueue.then(() => {
          $deps.log.debug(`updating node ${update.entity.id} in DB`)
          return update.entity.model.set({
            type: update.entity.type,
            properties: update.entity.propertiesDefinition
          }).save()
        })

        break
      case Property:
        if (!update.entity.model) return
        databaseQueue = databaseQueue.then(() => {
          $deps.log.debug(`updating property ${update.entity.id} in DB`)
          return PropertyHistoryModel.forge({
            property_id: update.entity.model.id,
            value: update.entity.value,
            date: new Date()
          }).save()
        })
    }
  })
}
