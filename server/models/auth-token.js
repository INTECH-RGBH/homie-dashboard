import {bookshelf} from '../lib/database'

class AuthToken extends bookshelf.Model {
  get tableName () { return 'auth_tokens' }
  get idAttribute () { return 'token' }
}

export default bookshelf.model('AuthToken', AuthToken)
