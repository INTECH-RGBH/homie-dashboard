import WebSocket from '../lib/websocket'
import {tryAuth} from '../services/api'
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
      async tryAuth ({commit}, password) {
        const result = await tryAuth({ ws, parameters: password })
        if (result.success) {
          commit(SET_IS_AUTHENTIFIED, true)
          window.localStorage.setItem('access_token', result.token)
        }
        return result.success
      },
      logout ({commit}) {
        commit(SET_IS_AUTHENTIFIED, false)
        window.localStorage.removeItem('access_token')
        app.$router.replace('/authentification')
      }
    }
  })

  const accessToken = window.localStorage.getItem('access_token')
  const ws = new WebSocket(`ws://127.0.0.1:5000${accessToken ? `?access_token=${accessToken}` : ''}`)
  ws.on('open', function onOpen () {
    app.$store.commit(SET_IS_CONNECTED, true)
  }).on('close', function onClose () {
    app.$store.commit(SET_IS_CONNECTED, false)
    app.$store.commit(SET_IS_AUTHENTIFIED, false)
  })

  ws.on('message', function onMessage (data) {
    const message = parseMessage(data)

    if (message.type !== MESSAGE_TYPES.EVENT) return

    switch (message.event) {
      case 'auth':
        app.$store.commit(SET_IS_AUTHENTIFIED, true)
        console.log(app.$store.state.intendedRoute)
        app.$router.replace(app.$store.state.intendedRoute)
        break
    }
  })
}
