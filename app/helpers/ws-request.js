import {generateMessage, parseMessage, MESSAGE_TYPES} from '../../common/ws-messages'

export default function wsRequest (opts) {
  return new Promise(function (resolve, reject) {
    const request = generateMessage({ type: MESSAGE_TYPES.REQUEST, method: opts.method, parameters: opts.parameters })

    const removeWsListener = () => opts.ws.removeListener('message', onMessage)

    let timeout
    const onMessage = function (message) {
      const parsed = parseMessage(message)

      if (parsed.type === MESSAGE_TYPES.RESPONSE && parsed.id === request.id) {
        resolve(parsed.value)
        clearTimeout(timeout)
        removeWsListener()
      }
    }

    timeout = setTimeout(function onTimeout () {
      reject(new Error('Response timeout'))
      removeWsListener()
    }, 1000)

    opts.ws.on('message', onMessage)
    opts.ws.send(request.text)
  })
}
