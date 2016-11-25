import {EventEmitter} from 'events'

export default class Device extends EventEmitter {
  constructor () {
    super()

    this._id = null
    this._name = null
    this._online = null
    this._localIp = null
    this._mac = null
    this._stats = new Map([
      ['signal', null],
      ['uptime', null],
      ['interval', null]
    ])
    this._fw = new Map([
      ['name', null],
      ['version', null],
      ['checksum', null]
    ])
    this._implementation = null

    this._nodes = new Map()

    this.isValid = false
  }

  hasNode (nodeId) {
    return this._nodes.has(nodeId)
  }

  addNode (node) {
    this._nodes.set(node.id, node)
    node.on('update', () => {
      this.emit('update')
    })
    this._wasUpdated()
  }

  getNode (nodeId) {
    return this._nodes.get(nodeId)
  }

  getNodes () {
    return this._nodes.values()
  }

  get id () { return this._id }
  set id (val) { this._id = val; this._wasUpdated() }
  get name () { return this._name }
  set name (val) { this._name = val; this._wasUpdated() }
  get online () { return this._online }
  set online (val) { this._online = val; this._wasUpdated() }
  get localIp () { return this._localIp }
  set localIp (val) { this._localIp = val; this._wasUpdated() }
  get mac () { return this._mac }
  set mac (val) { this._mac = val; this._wasUpdated() }
  getStatProperty (property) { return this._stats.get(property) }
  setStatProperty (property, value) { this._stats.set(property, value); this._wasUpdated() }
  getFirmwareProperty (property) { return this._fw.get(property) }
  setFirmwareProperty (property, value) { this._fw.set(property, value); this._wasUpdated() }
  get implementation () { return this._implementation }
  set implementation (val) { this._implementation = val; this._wasUpdated() }

  _wasUpdated () {
    const wasValid = this.isValid
    this.isValid = (
      this._id !== null &&
      this._name !== null &&
      this._online !== null &&
      this._localIp !== null &&
      this._mac !== null &&
      this._stats.get('signal') !== null &&
      this._stats.get('uptime') !== null &&
      this._stats.get('interval') !== null &&
      this._fw.get('name') !== null &&
      this._fw.get('version') !== null &&
      this._fw.get('checksum') !== null &&
      this._implementation !== null
    )

    if (!wasValid && this.isValid) this.emit('valid')

    this.emit('update')
  }
}
