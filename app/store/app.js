import WebSocket from '../lib/websocket'
import {login, logout} from '../services/api'
import {parseMessage, MESSAGE_TYPES} from '../../common/ws-messages'

export const SET_IS_CONNECTED = 'SET_IS_CONNECTED'
export const SET_IS_AUTHENTIFIED = 'SET_IS_AUTHENTIFIED'
export const SET_INTENDED_ROUTE = 'SET_INTENDED_ROUTE'

export default function initializeStore (app) {
  app.model({
    state: {
      isConnected: false,
      isAuthentified: false,
      intendedRoute: '/'
    },
    mutations: {
      [SET_IS_CONNECTED] (state, connected) {
        state.isConnected = connected
      },
      [SET_IS_AUTHENTIFIED] (state, authentified) {
        state.isAuthentified = authentified
      },
      [SET_INTENDED_ROUTE] (state, route) {
        state.intendedRoute = route
      }
    },
    actions: {
      async login ({commit, dispatch}, password) {
        const success = await login(password)
        if (success) {
          commit(SET_IS_AUTHENTIFIED, true)
          dispatch('startWs')
        }

        app.$router.replace(app.$store.state.intendedRoute)

        return success
      },
      startWs () { ws.start() },
      async logout ({commit}) {
        const success = await logout()
        if (success) {
          ws.stop()
          commit(SET_IS_AUTHENTIFIED, false)
          app.$router.replace('/authentification')
        }

        return success
      }
    }
  })

  const ws = new WebSocket(`ws://127.0.0.1:5000`)
  ws.on('open', function onOpen () {
    app.$store.commit(SET_IS_CONNECTED, true)
  }).on('close', function onClose () {
    app.$store.commit(SET_IS_CONNECTED, false)
  })

  ws.on('message', function onMessage (data) {
    const message = parseMessage(data)

    if (message.type !== MESSAGE_TYPES.EVENT) return

    switch (message.event) {
    }
  })
}
