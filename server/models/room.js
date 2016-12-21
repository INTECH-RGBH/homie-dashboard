import {bookshelf} from '../lib/database'

class Room extends bookshelf.Model {
  get tableName () { return 'rooms' }

  floor () {
    return this.belongsTo('Floor')
  }
}

export default bookshelf.model('Room', Room)
