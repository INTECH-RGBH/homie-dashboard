import test from 'ava'

import {parseMessage, generateMessage, MESSAGE_TYPES} from '../common/ws-messages'

test('generate and parse an event', t => {
  const options = { type: MESSAGE_TYPES.EVENT, event: 'super_event', value: 'Wooh' }
  const message = generateMessage(options)
  const parsed = parseMessage(message)
  t.deepEqual(parsed, options)
})

test('generate and parse a request', t => {
  const options = { type: MESSAGE_TYPES.REQUEST, method: 'getStats', parameters: { timespan: 'all' } }
  const message = generateMessage(options)
  const parsed = parseMessage(message.text)
  t.is(parsed.type, options.type)
  t.is(parsed.method, options.method)
  t.deepEqual(parsed.parameters, options.parameters)
  t.regex(parsed.id, /^[a-z0-9]{8}-([a-z0-9]{4}-){3}[a-z0-9]{12}$/)
})

test('generate and parse a response', t => {
  const options = { type: MESSAGE_TYPES.RESPONSE, id: '110ec58a-a0f2-4ac4-8393-c866d813b8d1', value: 'Wooh' }
  const message = generateMessage(options)
  const parsed = parseMessage(message)
  t.deepEqual(parsed, options)
})
