import uuid from 'uuid'

export const MESSAGE_TYPES = {
  EVENT: 0,
  REQUEST: 1,
  RESPONSE: 2
}

export function parseMessage (text) {
  const parsed = JSON.parse(text)
  switch (parsed[0]) {
    case MESSAGE_TYPES.EVENT:
      return {
        type: MESSAGE_TYPES.EVENT,
        event: parsed[1],
        value: parsed[2]
      }
    case MESSAGE_TYPES.REQUEST:
      return {
        type: MESSAGE_TYPES.REQUEST,
        id: parsed[1],
        method: parsed[2],
        parameters: parsed[3]
      }
    case MESSAGE_TYPES.RESPONSE:
      return {
        type: MESSAGE_TYPES.RESPONSE,
        id: parsed[1],
        value: parsed[2]
      }
  }
}

export function generateMessage (options) {
  switch (options.type) {
    case MESSAGE_TYPES.EVENT:
      return JSON.stringify([MESSAGE_TYPES.EVENT, options.event, options.value])
    case MESSAGE_TYPES.REQUEST:
      const id = uuid()
      return {
        id,
        text: JSON.stringify([MESSAGE_TYPES.REQUEST, id, options.method, options.parameters])
      }
    case MESSAGE_TYPES.RESPONSE:
      return JSON.stringify([MESSAGE_TYPES.RESPONSE, options.id, options.value])
  }
}
