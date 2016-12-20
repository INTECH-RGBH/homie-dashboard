import {EventEmitter} from 'events'

/**
 * This class represents a node
 */
export default class Node extends EventEmitter {
  constructor () {
    super()

    this._device = null

    this._id = null
    this._type = null
    this._propertiesDefinition = null

    this._properties = new Map()

    this._tags = new Set()

    this.isValid = false

    this.model = null

    Object.seal(this)
  }

  hasProperty (propertyId) {
    return this._properties.has(propertyId)
  }

  addProperty (property) {
    this._properties.set(property.id, property)
    property.on('valid', () => {
      this.emit('newProperty', property)
    })
    property.on('update', (update) => {
      this.emit('update', update)
    })
    this._wasUpdated()
  }

  getProperty (nodeId) {
    return this._properties.get(nodeId)
  }

  getProperties () {
    return this._properties.values()
  }

  addTag (tag) {
    this._tags.add(tag)
    this._wasUpdated()
  }

  deleteTag (tag) {
    this._tags.delete(tag)
    this._wasUpdated()
  }

  hasTag (tag) {
    return this._tags.has(tag)
  }

  getTags () {
    return this._tags.values()
  }

  get device () { return this._device }
  set device (val) {
    if (!val || this._device === val) return
    this._device = val
    this._wasUpdated()
  }
  get id () { return this._id }
  set id (val) {
    if (!val || this._id === val) return
    this._id = val
    this._wasUpdated()
  }
  get type () { return this._type }
  set type (val) {
    if (!val || this._type === val) return
    this._type = val
    this._wasUpdated()
  }
  get propertiesDefinition () { return this._propertiesDefinition }
  set propertiesDefinition (val) {
    if (!val || this._propertiesDefinition === val) return
    this._propertiesDefinition = val
    this._wasUpdated()
  }

  _wasUpdated () {
    const wasValid = this.isValid
    this.isValid = (
      this._device !== null &&
      this._id !== null &&
      this._type !== null &&
      this._propertiesDefinition !== null
    )

    if (!this.isValid) return

    if (wasValid) {
      this.emit('update', { entity: this })
    } else {
      if (this._device.isValid) this.emit('valid')
      else {
        this._device.once('valid', () => {
          this.emit('valid')
        })
      }
    }
  }

  toJSON () {
    const representation = {}
    representation.id = this.id
    representation.type = this.type
    representation.propertiesDefinition = this.propertiesDefinition
    representation.properties = {}
    for (const property of this.getProperties()) {
      if (property.isValid) representation.properties[property.id] = property.toJSON()
    }
    representation.tags = []
    for (const tag of this.getTags()) representation.tags.push(tag.id)

    return representation
  }
}
