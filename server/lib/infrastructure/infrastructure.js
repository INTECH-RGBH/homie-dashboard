import {EventEmitter} from 'events'

class Infrastructure extends EventEmitter {
  constructor () {
    super()

    this._devices = new Map()

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

  _wasUpdated () {
    this.emit('update', { type: 'infrastructure' })
  }

  toJSON () {
    const representation = {}
    for (const device of this.getDevices()) {
      if (device.isValid) representation[device.id] = device.toJSON()
    }

    return representation
  }
}

export default new Infrastructure()
