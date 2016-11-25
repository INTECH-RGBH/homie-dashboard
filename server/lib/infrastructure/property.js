import {EventEmitter} from 'events'

export default class Property extends EventEmitter {
  constructor () {
    super()

    this._node = null

    this._id = null
    this._value = null

    this.isValid = false
  }

  get node () { return this._node }
  set node (val) { this._node = val; this._wasUpdated() }
  get id () { return this._id }
  set id (val) { this._id = val; this._wasUpdated() }
  get value () { return this._value }
  set value (val) { this._value = val; this._wasUpdated() }

  _wasUpdated () {
    const wasValid = this.isValid
    this.isValid = (
      this._node !== null &&
      this._id !== null &&
      this._value !== null
    )

    if (!wasValid && this.isValid) {
      if (this._node.device.isValid) this.emit('valid')
      else {
        this._node.device.once('valid', () => {
          this.emit('valid')
        })
      }
    }

    this.emit('update')
  }
}
