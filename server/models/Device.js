import {bookshelf} from '../lib/database'

class Device extends bookshelf.Model {
  get tableName () { return 'devices' }

  nodes () {
    return this.hasMany('Node')
  }
}

export default bookshelf.model('Device', Device)
