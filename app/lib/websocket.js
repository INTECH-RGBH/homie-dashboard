import EventEmitter from 'eventemitter3'

export default class WebSocket extends EventEmitter {
  constructor (url) {
    super()

    this.url = url
  }

  start () {
    this.stopped = false
    this.ws = new window.WebSocket(this.url)
    this.ws.onopen = (event) => {
      this.emit('open', event)
    }
    this.ws.onclose = (event) => {
      this.emit('close', event)

      if (!this.stopped) setTimeout(this.start.bind(this), 2000)
    }
    this.ws.onmessage = (event) => {
      this.emit('message', event.data)
    }
  }

  stop () {
    if (this.ws) this.ws.close()
    this.stopped = true
  }

  send (message) {
    this.ws.send(message)
  }
}
