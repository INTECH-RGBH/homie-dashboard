import jsonpatch from 'fast-json-patch'
import WebSocket from '../lib/websocket'
import {login, logout} from '../services/api'
import {parseMessage, MESSAGE_TYPES} from '../../common/ws-messages'
import {VERSION, INFRASTRUCTURE, INFRASTRUCTURE_PATCH} from '../../common/events'
import wsRequest from '../helpers/ws-request'

export const SET_IS_CONNECTED = 'SET_IS_CONNECTED'
export const SET_IS_AUTHENTIFIED = 'SET_IS_AUTHENTIFIED'
export const SET_WEBSOCKET_AUTH_FAILED = 'SET_WEBSOCKET_AUTH_FAILED'
export const SET_INTENDED_ROUTE = 'SET_INTENDED_ROUTE'
export const SET_VERSION = 'SET_VERSION'
export const SET_INFRASTRUCTURE = 'SET_INFRASTRUCTURE'
export const PATCH_INFRASTRUCTURE = 'PATCH_INFRASTRUCTURE'
export const SET_STAT = 'SET_STAT'

export default function initializeStore (app) {
  app.model({
    state: {
      isConnected: false,
      isAuthentified: false,
      websocketAuthFailed: false,
      intendedRoute: '/',
      version: '',
      infrastructure: {
        devices: {},
        tags: {},
        house: { floors: {} },
        automation: '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>'
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
      [SET_VERSION] (state, version) {
        state.version = version
      },
      [SET_INFRASTRUCTURE] (state, infrastructure) {
        state.infrastructure = infrastructure
      },
      [PATCH_INFRASTRUCTURE] (state, patch) {
        jsonpatch.apply(state.infrastructure, patch)

        for (const op of patch) {
          if (op.op === 'add' || op.op === 'remove') {
            state.infrastructure = JSON.parse(JSON.stringify(state.infrastructure))
            break
          }
        }
      }
    },
    actions: {
      async login ({commit, dispatch}, opts) {
        const success = await login(opts)
        if (success) {
          window.localStorage.setItem('accessTokenSet', true)
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
          window.localStorage.setItem('accessTokenSet', false)
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
      },
      async createTag ({commit}, opts) {
        const result = await wsRequest({
          ws,
          method: 'createTag',
          parameters: {
            id: opts.id
          }
        })

        return result
      },
      async toggleTag ({commit}, opts) {
        const result = await wsRequest({
          ws,
          method: 'toggleTag',
          parameters: {
            deviceId: opts.deviceId,
            nodeId: opts.nodeId,
            tagId: opts.tagId,
            operationAdd: opts.operationAdd
          }
        })

        return result
      },
      async deleteTag ({commit}, opts) {
        const result = await wsRequest({
          ws,
          method: 'deleteTag',
          parameters: {
            tagId: opts.tagId
          }
        })

        return result
      },
      async addRoom ({commit}, opts) {
        const result = await wsRequest({
          ws,
          method: 'addRoom',
          parameters: {
            name: opts.name,
            floor_id: opts.floor_id
          }
        })
        return result
      },
      async deleteRoom ({commit}, opts) {
        const result = await wsRequest({
          ws,
          method: 'deleteRoom',
          parameters: {
            floorId: opts.floorId,
            roomId: opts.roomId
          }
        })

        return result
      },
      async changeNodeName ({commit}, opts) {
        const result = await wsRequest({
          ws,
          method: 'changeNodeName',
          parameters: {
            node: opts.node,
            name: opts.name
          }
        })

        return result
      },
      async addFloor ({commit}, opts) {
        const result = await wsRequest({
          ws,
          method: 'addFloor',
          parameters: {
            name: opts.name
          }
        })

        return result
      },
      async getStatistics ({commit}, opts) {
        const result = await wsRequest({
          ws,
          method: 'getStatistics',
          parameters: {
            deviceId: opts.deviceId,
            nodeId: opts.nodeId,
            propertyId: opts.propertyId,
            type: opts.type,
            granularity: opts.granularity,
            range: opts.range
          }
        })

        return result
      },
      async deleteFloor ({commit}, opts) {
        const result = await wsRequest({
          ws,
          method: 'deleteFloor',
          parameters: {
            floorId: opts.floorId
          }
        })

        return result
      },
      async updateMap ({commit}, opts) {
        const result = await wsRequest({
          ws,
          method: 'updateMap',
          parameters: {
            floorId: opts.floorId,
            map: opts.map
          }
        })

        return result
      },
      async getHomieEsp8266Settings ({commit}, opts) {
        const result = await wsRequest({
          ws,
          method: 'getHomieEsp8266Settings',
          parameters: null
        })

        return result
      },
      async saveAutomationScript ({commit}, opts) {
        const result = await wsRequest({
          ws,
          method: 'saveAutomationScript',
          parameters: {
            blocklyXml: opts.blocklyXml,
            script: opts.script
          }
        })

        return result
      },
      async updatePassword ({commit}, opts) {
        const result = await wsRequest({
          ws,
          method: 'updatePassword',
          parameters: {
            password: opts.password
          }
        })

        return result
      }
    }
  })

  let wsUrl
  if (process.env.NODE_ENV === 'production') {
    const l = window.location
    wsUrl = ((l.protocol === 'https:') ? 'wss://' : 'ws://') + l.host
  } else {
    wsUrl = 'ws://127.0.0.1:5000'
  }

  const ws = new WebSocket(wsUrl)
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
  }).on('error', function onError () {
  })

  ws.on('message', function onMessage (data) {
    const message = parseMessage(data)

    if (message.type !== MESSAGE_TYPES.EVENT) return

    switch (message.event) {
      case VERSION:
        app.$store.commit(SET_VERSION, message.value)
        return
      case INFRASTRUCTURE:
        app.$store.commit(SET_INFRASTRUCTURE, message.value)
        return
      case INFRASTRUCTURE_PATCH:
        app.$store.commit(PATCH_INFRASTRUCTURE, message.value)
        return
    }
  })
}
