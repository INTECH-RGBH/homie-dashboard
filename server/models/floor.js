import {bookshelf} from '../lib/database'

class Floor extends bookshelf.Model {
  get tableName () { return 'floors' }

  nodes () {
    return this.hasMany('Room')
  }
}

export default bookshelf.model('Floor', Floor)
