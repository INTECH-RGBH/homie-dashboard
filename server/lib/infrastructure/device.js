import {EventEmitter} from 'events'

/**
 * This class represents a device
 */
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

    this.model = null

    Object.seal(this)
  }

  hasNode (nodeId) {
    return this._nodes.has(nodeId)
  }

  addNode (node) {
    this._nodes.set(node.id, node)
    node.on('valid', () => {
      this.emit('newNode', node)
    })
    node.on('newProperty', (property) => {
      this.emit('newProperty', property)
    })
    node.on('update', (update) => {
      this.emit('update', update)
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
  get online () { return this._online }
  set online (val) {
    if (this._online === val) return
    this._online = val
    this._wasUpdated()
  }
  get localIp () { return this._localIp }
  set localIp (val) {
    if (!val || this._localIp === val) return
    this._localIp = val
    this._wasUpdated()
  }
  get mac () { return this._mac }
  set mac (val) {
    if (!val || this._mac === val) return
    this._mac = val
    this._wasUpdated()
  }
  getStatProperty (property) { return this._stats.get(property) }
  setStatProperty (property, value) {
    if (this._stats.get(property) === value) return
    this._stats.set(property, value)
    this._wasUpdated()
  }
  getFirmwareProperty (property) { return this._fw.get(property) }
  setFirmwareProperty (property, value) {
    if (!property || !value || this._fw.get(property) === value) return
    this._fw.set(property, value)
    this._wasUpdated()
  }
  get implementation () { return this._implementation }
  set implementation (val) {
    if (!val || this._implementation === val) return
    this._implementation = val
    this._wasUpdated()
  }

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

    if (!this.isValid) return

    if (!wasValid) this.emit('valid')

    this.emit('update', { entity: this })
  }

  toJSON () {
    const representation = {}
    representation.id = this.id
    representation.name = this.name
    representation.online = this.online
    representation.localIp = this.localIp
    representation.mac = this.mac
    representation.stats = {
      signal: this.getStatProperty('signal'),
      uptime: this.getStatProperty('uptime'),
      interval: this.getStatProperty('interval')
    }
    representation.fw = {
      name: this.getFirmwareProperty('name'),
      version: this.getFirmwareProperty('version'),
      checksum: this.getFirmwareProperty('checksum')
    }
    representation.implementation = this.implementation
    representation.nodes = {}
    for (const node of this.getNodes()) {
      if (node.isValid) representation.nodes[node.id] = node.toJSON()
    }

    return JSON.parse(JSON.stringify(representation))
  }
}
