import jsonpatch from 'fast-json-patch'
import WebSocket from '../lib/websocket'
import {login, logout} from '../services/api'
import {parseMessage, MESSAGE_TYPES} from '../../common/ws-messages'
import {INFRASTRUCTURE, INFRASTRUCTURE_PATCH} from '../../common/events'
import wsRequest from '../helpers/ws-request'

export const SET_IS_CONNECTED = 'SET_IS_CONNECTED'
export const SET_IS_AUTHENTIFIED = 'SET_IS_AUTHENTIFIED'
export const SET_WEBSOCKET_AUTH_FAILED = 'SET_WEBSOCKET_AUTH_FAILED'
export const SET_INTENDED_ROUTE = 'SET_INTENDED_ROUTE'
export const SET_INFRASTRUCTURE = 'SET_INFRASTRUCTURE'
export const PATCH_INFRASTRUCTURE = 'PATCH_INFRASTRUCTURE'

export default function initializeStore (app) {
  app.model({
    state: {
      isConnected: false,
      isAuthentified: false,
      websocketAuthFailed: false,
      intendedRoute: '/',
      infrastructure: {
        devices: {},
        tags: {}
      }
    },
    mutations: {
      [SET_IS_CONNECTED] (state, connected) {
        state.isConnected = connected
      },
      [SET_IS_AUTHENTIFIED] (state, authentified) {
        state.isAuthentified = authentified
      },
      [SET_WEBSOCKET_AUTH_FAILED] (state, failed) {
        state.websocketAuthFailed = failed
      },
      [SET_INTENDED_ROUTE] (state, route) {
        state.intendedRoute = route
      },
      [SET_INFRASTRUCTURE] (state, infrastructure) {
        state.infrastructure = infrastructure
      },
      [PATCH_INFRASTRUCTURE] (state, patch) {
        jsonpatch.apply(state.infrastructure, patch)

        for (const op of patch) {
          if (op.op === 'add') {
            state.infrastructure = JSON.parse(JSON.stringify(state.infrastructure))
            break
          }
        }
      }
    },
    actions: {
      async login ({commit, dispatch}, password) {
        const success = await login(password)
        if (success) {
          commit(SET_IS_AUTHENTIFIED, true)
          commit(SET_WEBSOCKET_AUTH_FAILED, false)
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
      },
      async setState ({commit}, opts) {
        const result = await wsRequest({
          ws,
          method: 'setState',
          parameters: {
            deviceId: opts.deviceId,
            nodeId: opts.nodeId,
            property: opts.property,
            value: opts.value
          }})

        return result
      }
    }
  })

  const ws = new WebSocket(`ws://127.0.0.1:5000`)
  ws.on('open', function onOpen () {
    app.$store.commit(SET_IS_CONNECTED, true)
  }).on('close', function onClose (event) {
    app.$store.commit(SET_IS_CONNECTED, false)
    if (event.code === 1006) { // auth error
      app.$store.commit(SET_IS_AUTHENTIFIED, false)
      app.$store.commit(SET_WEBSOCKET_AUTH_FAILED, true)
      ws.stop()
      app.$router.replace('/authentification')
    }
  }).on('error', function onError (err) {
    console.log(err)
  })

  ws.on('message', function onMessage (data) {
    const message = parseMessage(data)

    if (message.type !== MESSAGE_TYPES.EVENT) return

    switch (message.event) {
      case INFRASTRUCTURE:
        app.$store.commit(SET_INFRASTRUCTURE, message.value)
        return
      case INFRASTRUCTURE_PATCH:
        app.$store.commit(PATCH_INFRASTRUCTURE, message.value)
        return
    }
  })
}
