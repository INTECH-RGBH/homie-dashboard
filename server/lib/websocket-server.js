import {createServer} from 'http'
import cookie from 'cookie'
import express from 'express'
import bodyParser from 'body-parser'
import {Server as WebSocketServer} from 'ws'
import {createAuthToken, checkToken, deleteToken} from '../services/database'

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
        const token = await createAuthToken(opts)
        const never = new Date(253402300000000) // year 999
        return res.cookie('ACCESSTOKEN', token, {
          expires: never,
          httpOnly: true
        }).cookie('ACCESSTOKEN_SET', '1', {
          expires: never
        }).sendStatus(200)
      } else {
        return res.sendStatus(401)
      }
    })

    app.post('/logout', async function (req, res) {
      const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : null
      if (!cookies || !cookies['ACCESSTOKEN']) return res.sendStatus(401)
      const doesExist = await deleteToken(opts, cookies['ACCESSTOKEN'])
      if (doesExist) res.clearCookie('ACCESSTOKEN').clearCookie('ACCESSTOKEN_SET').sendStatus(204)
      else return res.sendStatus(401)
    })

    httpServer.on('request', app)

    const wss = new WebSocketServer({
      server: httpServer,
      async verifyClient (info, cb) {
        const fail = () => cb(false, 401, 'Unauthorized')
        const cookies = info.req.headers.cookie ? cookie.parse(info.req.headers.cookie) : null
        if (!cookies || !cookies['ACCESSTOKEN']) return fail()
        const isValidToken = await checkToken(opts, cookies['ACCESSTOKEN'])
        if (isValidToken) return cb(true)
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
