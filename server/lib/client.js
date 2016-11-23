import {EventEmitter} from 'events'
import {parse as parseUrl} from 'url'

import {generateMessage, parseMessage, MESSAGE_TYPES} from '../../common/ws-messages'
import {createAuthToken, checkToken} from '../services/database'

export default class Client extends EventEmitter {
  constructor (opts) {
    super()

    this.$deps = opts.$deps
    this.ws = opts.ws
    this.auth = false

    const accessToken = parseUrl(this.ws.upgradeReq.url, true).query.access_token
    if (accessToken) {
      checkToken(this.$deps, accessToken).then((validToken) => {
        if (validToken) this._setIsAuth()
      })
    }

    this.ws.on('message', data => {
      const message = parseMessage(data)
      this.onMessage(message)
    })

    this.ws.on('close', () => {
      this.emit('close')
    })
  }

  _setIsAuth () {
    this.auth = true
    this.ws.send(generateMessage({ type: MESSAGE_TYPES.EVENT, event: 'auth', value: true }))
  }

  _sendResponse (request, value) {
    this.ws.send(generateMessage({ type: MESSAGE_TYPES.RESPONSE, id: request.id, value }))
  }

  async onMessage (message) {
    if (message.type !== MESSAGE_TYPES.REQUEST) return

    /* Handle auth request */

    if (message.method === 'tryAuth') {
      if (this.auth) return this._sendResponse(message, { success: false })
      else if (message.parameters === this.$deps.settings.password) {
        const token = await createAuthToken(this.$deps)
        this._setIsAuth()
        return this._sendResponse(message, { success: true, token })
      } else {
        console.log('nope')
        return this._sendResponse(message, { success: false })
      }
    }

    if (!this.auth) return this._sendResponse(message, { success: false })

    /* After this point, the user is authentified */
  }
}
