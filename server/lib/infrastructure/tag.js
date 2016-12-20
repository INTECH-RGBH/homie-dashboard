import {EventEmitter} from 'events'

/**
 * This class represents a tag
 */
export default class Tag extends EventEmitter {
  constructor () {
    super()

    this._id = null

    this.isValid = false

    this.model = null

    Object.seal(this)
  }

  get id () { return this._id }
  set id (val) {
    if (!val || this._id === val) return
    this._id = val
    this._wasUpdated()
  }

  _wasUpdated () {
    const wasValid = this.isValid
    this.isValid = (
      this._id !== null
    )

    if (!wasValid && this.isValid) this.emit('valid')

    if (this.isValid) this.emit('update', { entity: this })
  }

  toJSON () {
    const representation = {}
    representation.id = this.id

    return representation
  }
}
