import {createServer} from 'http'
import cookie from 'cookie'
import express from 'express'
import uuid from 'uuid'
import bodyParser from 'body-parser'
import {Server as WebSocketServer} from 'ws'
import AuthTokenModel from '../models/auth-token'

/**
 * This function creates a WebSocket server.
 * The HTTP server created handles authentication
 * @param {ip: string, port: number, db: Database, settings: Object} opts options
 * @returns {Promise} promise, to be resolved on success with the WebSocket server instance or rejected on failure
 */
export default function createWebsocketServer (opts) {
  return new Promise((resolve, reject) => {
    const app = express()
    const httpServer = createServer()

    app.use(bodyParser.json())

    app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', req.headers.origin)
      res.header('Access-Control-Allow-Credentials', 'true')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
      next()
    })

    app.post('/login', async function (req, res) {
      if (req.body.password === opts.settings.password) {
        const token = uuid()
        await AuthTokenModel.forge({ token }).save(null, { method: 'insert' }) // we insert primary key so considered update by default
        const never = new Date(253402300000000) // year 999
        return res.cookie('ACCESSTOKEN', token, {
          expires: never,
          httpOnly: true
        }).sendStatus(200)
      } else {
        return res.sendStatus(401)
      }
    })

    app.post('/logout', async function (req, res) {
      const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : null
      if (!cookies || !cookies['ACCESSTOKEN']) return res.sendStatus(401)
      await AuthTokenModel.forge({ token: cookies['ACCESSTOKEN'] }).destroy()
      res.clearCookie('ACCESSTOKEN').sendStatus(204)
    })

    httpServer.on('request', app)

    const wss = new WebSocketServer({
      server: httpServer,
      async verifyClient (info, cb) {
        const fail = () => cb(false, 401, 'Unauthorized')
        const cookies = info.req.headers.cookie ? cookie.parse(info.req.headers.cookie) : null
        if (!cookies || !cookies['ACCESSTOKEN']) return fail()
        const tokenInDb = await AuthTokenModel.forge({ token: cookies['ACCESSTOKEN'] }).fetch()
        if (tokenInDb) return cb(true)
        else return fail()
      }
    })

    httpServer.listen(opts.port, opts.ip).on('listening', function onListening () {
      resolve(wss)
    }).on('error', function onError (err) {
      reject(err)
    })
  })
}
