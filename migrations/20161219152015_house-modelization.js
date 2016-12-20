exports.up = function (knex) {
  return knex.schema
    .createTable('floors', function (table) {
      table.increments('id').primary().notNullable()
      table.string('name').notNullable()
    })
    .createTable('rooms', function (table) {
      table.increments('id').primary().notNullable()
      table.string('name').notNullable()
      table.string('floor_id').notNullable().references('id').inTable('floors')
      table.string('tag_id').notNullable().references('id').inTable('tags')

      table.unique(['node_id', 'tag_id'])
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('rooms')
    .dropTableIfExists('floors')
}
