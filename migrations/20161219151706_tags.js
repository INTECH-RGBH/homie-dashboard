exports.up = function (knex) {
  return knex.schema
    .createTable('tags', function (table) {
      table.string('id').primary().notNullable()
    })
    .createTable('nodes_tags', function (table) {
      table.increments('id').primary().notNullable()
      table.string('node_id').notNullable().references('id').inTable('nodes')
      table.string('tag_id').notNullable().references('id').inTable('tags')

      table.unique(['node_id', 'tag_id'])
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('nodes_tags')
    .dropTableIfExists('tags')
}
