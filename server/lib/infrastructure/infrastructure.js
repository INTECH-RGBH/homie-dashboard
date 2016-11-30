import {EventEmitter} from 'events'

class Infrastructure extends EventEmitter {
  constructor () {
    super()

    this._devices = new Map()

    this._tags = new Map()

    Object.seal(this)
  }

  hasDevice (deviceId) {
    return this._devices.has(deviceId)
  }

  addDevice (device) {
    this._devices.set(device.id, device)
    device.on('update', (update) => {
      this.emit('update', update)
    })
    this._wasUpdated()
  }

  getDevice (deviceId) {
    return this._devices.get(deviceId)
  }

  getDevices () {
    return this._devices.values()
  }

  hasTag (tagId) {
    return this._devices.has(tagId)
  }

  addTag (tag) {
    this._tags.set(tag.id, tag)
    this._wasUpdated()
  }

  getTag (tagId) {
    return this._tags.get(tagId)
  }

  getTags () {
    return this._tags.values()
  }

  _wasUpdated () {
    this.emit('update', { type: 'infrastructure' })
  }

  toJSON () {
    const representation = { devices: {}, tags: {} }

    for (const device of this.getDevices()) {
      if (device.isValid) representation.devices[device.id] = device.toJSON()
    }

    for (const tag of this.getTags()) {
      representation.tags[tag.id] = tag
    }

    return representation
  }
}

export default new Infrastructure()
