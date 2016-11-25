import bunyan from 'bunyan'
import pkg from '../../package'

const log = bunyan.createLogger({
  name: pkg.name,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
})

export default log
