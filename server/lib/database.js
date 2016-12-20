import Knex from 'knex'
import Bookshelf from 'bookshelf'
import knexConfig from '../../knexfile'

export const knex = new Knex(knexConfig)
export const bookshelf = new Bookshelf(knex)
bookshelf.plugin('registry')
