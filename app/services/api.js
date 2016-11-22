import wsRequest from '../helpers/ws-request'

export async function tryAuth (opts) {
  return await wsRequest({ ws: opts.ws, method: 'tryAuth', parameters: opts.parameters })
}
