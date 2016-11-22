import EventEmitter from 'eventemitter3'

export default class WebSocket extends EventEmitter {
  constructor (url) {
    super()

    const startWebsocket = () => {
      this.ws = new window.WebSocket(url)
      this.ws.onopen = (event) => {
        this.emit('open', event)
      }
      this.ws.onclose = (event) => {
        this.emit('close', event)

        setTimeout(startWebsocket, 2000)
      }
      this.ws.onmessage = (event) => {
        this.emit('message', event.data)
      }
    }

    startWebsocket()
  }

  send (message) {
    this.ws.send(message)
  }
}
