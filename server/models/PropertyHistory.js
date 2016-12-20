import {bookshelf} from '../lib/database'

class PropertyHistory extends bookshelf.Model {
  get tableName () { return 'property_history' }

  property () {
    return this.belongsTo('Node')
  }
}

export default bookshelf.model('PropertyHistory', PropertyHistory)
