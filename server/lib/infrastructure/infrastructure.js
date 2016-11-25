import {EventEmitter} from 'events'

class Infrastructure extends EventEmitter {
  constructor () {
    super()

    this._devices = new Map()
  }

  hasDevice (deviceId) {
    return this._devices.has(deviceId)
  }

  addDevice (device) {
    this._devices.set(device.id, device)
    device.on('update', () => {
      this.emit('update')
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
    this.emit('update')
  }
}

export default new Infrastructure()
