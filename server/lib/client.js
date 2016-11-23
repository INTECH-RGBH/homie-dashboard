import {EventEmitter} from 'events'

import {generateMessage, parseMessage, MESSAGE_TYPES} from '../../common/ws-messages'

export default class Client extends EventEmitter {
  constructor (opts) {
    super()

    this.$deps = opts.$deps
    this.ws = opts.ws

    this.ws.on('message', data => {
      const message = parseMessage(data)
      this.onMessage(message)
    })

    this.ws.on('close', () => {
      this.emit('close')
    })
  }

  _sendResponse (request, value) {
    this.ws.send(generateMessage({ type: MESSAGE_TYPES.RESPONSE, id: request.id, value }))
  }

  async onMessage (message) {
    if (message.type !== MESSAGE_TYPES.REQUEST) return

    /* Handle requests */
  }
}
