import {EventEmitter} from 'events'

export default class Node extends EventEmitter {
  constructor () {
    super()

    this._device = null

    this._id = null
    this._type = null
    this._propertiesDefinition = null

    this._properties = new Map()

    this.isValid = false
  }

  hasProperty (propertyId) {
    return this._properties.has(propertyId)
  }

  addProperty (property) {
    this._properties.set(property.id, property)
    property.on('update', () => {
      this.emit('update')
    })
    this._wasUpdated()
  }

  getProperty (nodeId) {
    return this._properties.get(nodeId)
  }

  getProperties () {
    return this._properties.values()
  }

  get device () { return this._device }
  set device (val) { this._device = val; this._wasUpdated() }
  get id () { return this._id }
  set id (val) { this._id = val; this._wasUpdated() }
  get type () { return this._type }
  set type (val) { this._type = val; this._wasUpdated() }
  get propertiesDefinition () { return this._propertiesDefinition }
  set propertiesDefinition (val) { this._propertiesDefinition = val; this._wasUpdated() }

  _wasUpdated () {
    const wasValid = this.isValid
    this.isValid = (
      this._device !== null &&
      this._id !== null &&
      this._type !== null &&
      this._propertiesDefinition !== null
    )

    if (!wasValid && this.isValid) {
      if (this._device.isValid) this.emit('valid')
      else {
        this._device.once('valid', () => {
          this.emit('valid')
        })
      }
    }

    this.emit('update')
  }
}
