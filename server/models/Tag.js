import {bookshelf} from '../lib/database'

class Tag extends bookshelf.Model {
  get tableName () { return 'tags' }

  nodes () {
    return this.belongsToMany('Node')
  }
}

export default bookshelf.model('Tag', Tag)
