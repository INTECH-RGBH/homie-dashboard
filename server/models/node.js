import {bookshelf} from '../lib/database'

class Node extends bookshelf.Model {
  get tableName () { return 'nodes' }

  device () {
    return this.belongsTo('Device')
  }

  properties () {
    return this.hasMany('Property')
  }

  tags () {
    return this.belongsToMany('Tag')
  }
}

export default bookshelf.model('Node', Node)
