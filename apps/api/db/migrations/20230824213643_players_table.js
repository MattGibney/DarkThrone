/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('players', table => {
      table.text('id').primary();
      table.text('user_id').references('id').inTable('users');
      table.text('display_name').notNullable();
      table.text('race').notNullable();
      table.text('class').notNullable();
      table.text('avatar_url');
      table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    })
    .alterTable('user_sessions', table => {
      table.text('player_id').references('id').inTable('players');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable('players')
    .alterTable('user_sessions', table => {
      table.dropColumn('player_id');
    });
};
