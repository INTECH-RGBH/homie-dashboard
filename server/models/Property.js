import {bookshelf} from '../lib/database'

class Property extends bookshelf.Model {
  get tableName () { return 'properties' }

  node () {
    return this.belongsTo('Node')
  }

  history () {
    return this.hasMany('PropertyHistory')
  }
}

export default bookshelf.model('Property', Property)
