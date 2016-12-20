import {EventEmitter} from 'events'

/**
 * This class represents a floor
 */
export default class Floor extends EventEmitter {
  constructor () {
    super()

    this._floor = null

    this._id = null
    this._name = null
    this._tagId = null

    this.isValid = false

    Object.seal(this)
  }

  get floor () { return this._floor }
  set floor (val) {
    if (!val || this._floor === val) return
    this._floor = val
    this._wasUpdated()
  }
  get id () { return this._id }
  set id (val) {
    if (!val || this._id === val) return
    this._id = val
    this._wasUpdated()
  }
  get name () { return this._name }
  set name (val) {
    if (!val || this._name === val) return
    this._name = val
    this._wasUpdated()
  }
  get tagId () { return this._tagId }
  set tagId (val) {
    if (!val || this._tagId === val) return
    this._tagId = val
    this._wasUpdated()
  }

  _wasUpdated () {
    const wasValid = this.isValid
    this.isValid = (
      this._name !== null &&
      this._id !== null &&
      this._floor !== null &&
      this._tagId !== null
    )

    if (!wasValid && this.isValid) this.emit('valid')

    if (this.isValid) this.emit('update', { entity: this })
  }

  toJSON () {
    const representation = {}
    representation.name = this.name
    representation.tagId = this.tagId

    return representation
  }
}
