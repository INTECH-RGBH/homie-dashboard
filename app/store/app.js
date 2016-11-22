import WebSocket from '../lib/websocket'
import {tryAuth} from '../services/api'

export const SET_IS_CONNECTED = 'SET_IS_CONNECTED'

export default function initializeStore (app) {
  app.model({
    state: {
      isConnected: false
    },
    mutations: {
      [SET_IS_CONNECTED] (state, connected) {
        state.isConnected = connected
      }
    },
    actions: {
      async tryAuth ({commit}, password) {
        const response = await tryAuth({ ws, parameters: password })
        return response
      }
    }
  })

  const ws = new WebSocket('ws://127.0.0.1:5000')
  ws.on('open', function onOpen () {
    app.$store.commit(SET_IS_CONNECTED, true)
  }).on('close', function onClose () {
    app.$store.commit(SET_IS_CONNECTED, false)
  })
}
