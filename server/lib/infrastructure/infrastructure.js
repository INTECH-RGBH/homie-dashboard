import {EventEmitter} from 'events'

/**
 * This class represents the whole devices infrastructure
 */
class Infrastructure extends EventEmitter {
  /**
   * Constructor
   */
  constructor () {
    super()

    this._devices = new Map()

    this._tags = new Map()

    this._houseFloors = new Map()

    Object.seal(this)
  }

  /**
   * Returns whether or not the device exists in the infrastructure
   * @param {string} deviceId the device ID
   * @returns {bool} whether or not the device exists
   */
  hasDevice (deviceId) {
    return this._devices.has(deviceId)
  }

  /**
   * Adds a device to the infrastructure
   * @param {Device} device
   */
  addDevice (device) {
    console.log()
    this._devices.set(device.id, device)
    device.on('valid', () => {
      this.emit('newDevice', device)
    })
    device.on('newNode', (node) => {
      this.emit('newNode', node)
    })
    device.on('newProperty', (property) => {
      this.emit('newProperty', property)
    })
    device.on('update', (update) => {
      this.emit('update', update)
    })
    this._wasUpdated()
  }

  /**
   * Gets a device from the infrastructure
   * @param {string} deviceId the device ID
   * @returns {Device} the device
   */
  getDevice (deviceId) {
    return this._devices.get(deviceId)
  }

  /**
   * Gets all devices from the infrastructure
   * @returns {Iterable.<Device>} the devices
   */
  getDevices () {
    return this._devices.values()
  }

  /**
   * Returns whether or not the infrastructure has the given tag
   * @returns {bool} whether or not the tag exists
   */
  hasTag (tagId) {
    return this._tags.has(tagId)
  }

  /**
   * Adds a tag
   * @param {Tag} tag the tag
   */
  addTag (tag) {
    this._tags.set(tag.id, tag)
    tag.on('update', (update) => {
      this.emit('update', update)
    })
    this._wasUpdated()
  }

  /**
   * Gets a tag
   * @param {string} tagId the tag ID
   * @returns {Tag} the tag
   */
  getTag (tagId) {
    return this._tags.get(tagId)
  }

  deleteTag (tagId) {
    this._tags.delete(tagId)
    this._wasUpdated()
  }
  /**
   * Gets all tags from the infrastructure
   * @returns {Iterable.<Tag>} the tags
   */
  getTags () {
    return this._tags.values()
  }

  hasFloor (floorId) {
    return this._houseFloors.has(floorId)
  }

  /**
   * Adds a floor
   * @param {Floor}  the floor
   */
  addFloor (floor) {
    this._houseFloors.set(floor.id, floor)
    floor.on('update', (update) => {
      this.emit('update', update)
    })
    this._wasUpdated()
  }

  /**
   * Gets a floor
   * @param {string} floorId the floor ID
   * @returns {Floor} the floor
   */
  getFloor (floorId) {
    return this._houseFloors.get(floorId)
  }

  deleteFloor (floorId) {
    this._houseFloors.delete(floorId)
    this._wasUpdated()
  }

  /**
   * Gets all floors from the infrastructure
   * @returns {Iterable.<Floor>} the floors
   */
  getFloors () {
    return this._houseFloors.values()
  }

  _wasUpdated () {
    this.emit('update', { entity: this })
  }

  toJSON () {
    const representation = { devices: {}, tags: {}, house: { floors: {} } }

    for (const device of this.getDevices()) {
      if (device.isValid) representation.devices[device.id] = device.toJSON()
    }

    for (const tag of this.getTags()) {
      if (tag.isValid) representation.tags[tag.id] = tag.toJSON()
    }

    for (const floor of this.getFloors()) {
      if (floor.isValid) representation.house.floors[floor.id] = floor.toJSON()
    }

    return representation
  }
}

export default new Infrastructure()
