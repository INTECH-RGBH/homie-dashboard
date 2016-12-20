import {EventEmitter} from 'events'

/**
 * This class represents a floor
 */
export default class Floor extends EventEmitter {
  constructor () {
    super()

    this._id = null
    this._name = null

    this._rooms = new Map()

    this.isValid = false

    Object.seal(this)
  }

  hasRoom (roomId) {
    return this._rooms.has(roomId)
  }

  addRoom (room) {
    this._rooms.set(room.id, room)
    room.on('update', (update) => {
      this.emit('update', update)
    })
    this._wasUpdated()
  }

  getRoom (roomId) {
    return this._rooms.get(roomId)
  }

  getRooms () {
    return this._rooms.values()
  }

  get id () { return this._id }
  set id (val) {
    if (typeof val === undefined || this._id === val) return
    this._id = val
    this._wasUpdated()
  }
  get name () { return this._name }
  set name (val) {
    if (!val || this._name === val) return
    this._name = val
    this._wasUpdated()
  }

  _wasUpdated () {
    const wasValid = this.isValid
    this.isValid = (
      this._name !== null &&
      this._id !== null
    )

    if (!wasValid && this.isValid) this.emit('valid')

    if (this.isValid) this.emit('update', { entity: this })
  }

  toJSON () {
    const representation = { rooms: {} }
    representation.name = this.name
    for (const room of this.getRooms()) {
      if (room.isValid) representation.rooms[room.id] = room.toJSON()
    }

    return representation
  }
}
