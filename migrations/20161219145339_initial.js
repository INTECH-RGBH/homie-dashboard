exports.up = function (knex) {
  return knex.schema
    .createTable('devices', function (table) {
      table.string('id').primary().notNullable()
      table.string('name').notNullable()
      table.boolean('online').notNullable()
      table.string('local_ip').notNullable()
      table.string('mac').notNullable()
      table.integer('stats_signal').notNullable()
      table.integer('stats_uptime').notNullable()
      table.integer('stats_interval_in_seconds').notNullable()
      table.string('fw_name').notNullable()
      table.string('fw_version').notNullable()
      table.string('fw_checksum').notNullable()
      table.string('implementation').notNullable()
    })
    .createTable('nodes', function (table) {
      table.increments('id').primary().notNullable()
      table.string('device_id').notNullable().references('id').inTable('devices')
      table.string('device_node_id').notNullable()
      table.string('type').notNullable()
      table.string('properties').notNullable()

      table.unique(['device_id', 'device_node_id'])
    })
    .createTable('properties', function (table) {
      table.increments('id').primary().notNullable()
      table.integer('node_id').notNullable().references('id').inTable('nodes')
      table.string('node_property_id').notNullable()
    })
    .createTable('property_history', function (table) {
      table.increments('id').primary().notNullable()
      table.integer('property_id').notNullable().references('id').inTable('properties')
      table.string('value').notNullable()
      table.dateTime('date').notNullable()
    })
    .createTable('auth_tokens', function (table) {
      table.string('token').primary().notNullable()
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('auth_tokens')
    .dropTableIfExists('property_history')
    .dropTableIfExists('properties')
    .dropTableIfExists('nodes')
    .dropTableIfExists('devices')
}
